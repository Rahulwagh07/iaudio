import MultiTrack from 'wavesurfer-multitrack';

export interface AudioPill {
  id: string;
  file: File;
  url: string;
  startTime: number;
  name: string;
}

export interface AudioTrack {
  id: string;
  pills: AudioPill[];
  name: string;
  wavesurfer?: MultiTrack;
}

export interface AudioStore {
  tracks: AudioTrack[]
  currentTime: number
  isPlaying: boolean
  activeTrackId: string | null
  addTrack: () => string
  addPill: (trackId: string, file: File) => AudioPill
  setWaveSurfer: (trackId: string, wavesurfer: MultiTrack | null) => void
  playTrack: (trackId: string) => void
  pauseTrack: (trackId: string) => void
  setCurrentTime: (time: number) => void
  deleteTrack: (trackId: string) => void
  isTrackPlaying: (trackId: string) => boolean
}