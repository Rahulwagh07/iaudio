import { FFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL, fetchFile } from '@ffmpeg/util';
import { AudioTrack, AudioExportProgress } from '../types';


export class AudioExporter {
  private context: AudioContext;
  private sampleRate: number = 44100;
  private onProgress: (progress: AudioExportProgress) => void;
  private ffmpeg: FFmpeg;

  constructor(onProgress: (progress: AudioExportProgress) => void) {
    this.context = new AudioContext({ sampleRate: this.sampleRate });
    this.onProgress = onProgress;
    this.ffmpeg = new FFmpeg();

    this.ffmpeg.on('progress', ({ progress }: { progress: number }) => {
      const percent: number = Math.round(progress * 100);
      this.onProgress({ status: 'encoding', progress: 60 + (percent * 0.2) });
    });
  }

  async exportToMp3(track: AudioTrack): Promise<void> {
    try {
      this.onProgress({ status: 'preparing', progress: 0 });

      const baseURL = 'https://unpkg.com/@ffmpeg/core-mt@0.12.6/dist/esm';
      await this.ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
        workerURL: await toBlobURL(`${baseURL}/ffmpeg-core.worker.js`, 'text/javascript'),
      });

      this.onProgress({ status: 'preparing', progress: 20 });

      // mix audio
      const mixedBuffer = await this.mixAudioBuffers(track);
      this.onProgress({ status: 'mixing', progress: 40 });

      // convert to WAV
      const wavBlob = await this.audioBufferToWav(mixedBuffer);
      this.onProgress({ status: 'encoding', progress: 60 });

      await this.ffmpeg.writeFile('input.wav', await fetchFile(wavBlob));

      // convert to MP3
      await this.ffmpeg.exec([
        '-i', 'input.wav',
        '-c:a', 'libmp3lame',
        '-b:a', '192k',
        'output.mp3'
      ]);

      //process final output
      const data = await this.ffmpeg.readFile('output.mp3');
      const mp3Blob = new Blob([data], { type: 'audio/mp3' });
      this.onProgress({ status: 'downloading', progress: 90 });

      //  download
      await this.downloadFile(mp3Blob, `${track.name}.mp3`);
      this.onProgress({ status: 'complete', progress: 100 });

    } catch (error) {
      console.log('download error:', error);
      this.onProgress({ status: 'error', progress: 0 });
      throw error;
    } finally {
      this.ffmpeg.terminate();
    }
  }

  private async mixAudioBuffers(track: AudioTrack): Promise<AudioBuffer> {
    const totalPills = track.pills.length;
    let processedPills = 0;

    // find min start time 
    const minStartTime = Math.min(...track.pills.map(pill => pill.startTime));
    const timeOffset = minStartTime < 0 ? Math.abs(minStartTime) : 0;

    // cal total duration  
    const totalDuration = Math.max(
      ...track.pills.map(pill => (pill.startTime + timeOffset) + pill.duration)
    );

    // process multiple audio faster than real time
    const offlineContext = new OfflineAudioContext(
      2,
      Math.ceil(totalDuration * this.sampleRate),
      this.sampleRate
    );

    // mix audio
    const masterGain = offlineContext.createGain();
    masterGain.connect(offlineContext.destination);

    // process each pill
    await Promise.all(track.pills.map(async (pill) => {
      const response = await fetch(pill.url);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.context.decodeAudioData(arrayBuffer);

      const source = offlineContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(masterGain);
      source.start(pill.startTime + timeOffset);

      processedPills++;
      const mixProgress = Math.round((processedPills / totalPills) * 20) + 20;
      this.onProgress({ status: 'mixing', progress: mixProgress });
    }));

    return offlineContext.startRendering();
  }

  private async audioBufferToWav(buffer: AudioBuffer): Promise<Blob> {
    const numberOfChannels = buffer.numberOfChannels;
    const length = buffer.length * numberOfChannels * 2;
    const wavData = new ArrayBuffer(44 + length);
    const view = new DataView(wavData);

    const writeString = (offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };

    writeString(0, 'RIFF');
    view.setUint32(4, 36 + length, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, numberOfChannels, true);
    view.setUint32(24, buffer.sampleRate, true);
    view.setUint32(28, buffer.sampleRate * numberOfChannels * 2, true);
    view.setUint16(32, numberOfChannels * 2, true);
    view.setUint16(34, 16, true);
    writeString(36, 'data');
    view.setUint32(40, length, true);

    // write audio data
    const offset = 44;
    for (let i = 0; i < buffer.length; i++) {
      for (let channel = 0; channel < numberOfChannels; channel++) {
        const sample = Math.max(-1, Math.min(1, buffer.getChannelData(channel)[i]));
        view.setInt16(offset + (i * numberOfChannels + channel) * 2, sample * 0x7FFF, true);
      }
    }

    return new Blob([wavData], { type: 'audio/wav' });
  }

  private async downloadFile(blob: Blob, filename: string): Promise<void> {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
} 
