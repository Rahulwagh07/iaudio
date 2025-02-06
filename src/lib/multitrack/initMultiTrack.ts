import MultiTrack from "wavesurfer-multitrack";
import { Track } from "../../types";
import { initVerticalDragging } from "./initVerticleDragging";

interface MultiTrackParams {
  container: HTMLDivElement;
  tracks: Track[];
  multiTrackId: string;
  callbacks: {
    setWaveSurfer: (multiTrackId: string, instance: MultiTrack) => void;
    reorderTracks: (multiTrackId: string, fromIndex: number, toIndex: number) => void;
    removeTrack: (multiTrackId: string, trackId: string) => void;
    updateTrackStartTime: (multiTrackId: string, trackId: string, startTime: number) => void;
    updateCursorPosition: (wasPlaying: boolean, currentTime: number) => void;
  };
}

export function initMultiTrack({
  container,
  tracks,
  multiTrackId,
  callbacks,
}: MultiTrackParams): MultiTrack {
  const instance = MultiTrack.create(
    tracks.map((track) => ({
      id: track.id,
      draggable: true,
      startPosition: track.startTime,
      eenvelope: [{
        time: 0,
        volume: 1
      }],
      options: {
        waveColor: "hsl(210, 87%, 50%)",
        progressColor: "hsl(210, 87%, 40%)",
      },
      url: track.url,
    })),

    {
      container,
      minPxPerSec: 15,
      cursorColor: "#6b21a8",
      dragBounds: false,
      cursorWidth: 2,
      trackBorderColor: "hsl(210, 60%, 30%)",
    }
  );

  container.classList.add("multitrack-container");

  callbacks.setWaveSurfer(multiTrackId, instance);
  initVerticalDragging(instance);

  // @ts-ignore
  instance.on("reorder-track", ({ fromIndex, toIndex }: { fromIndex: number; toIndex: number }) => {
    const wasPlaying = instance.isPlaying();
    const currentTime = instance.getCurrentTime();
    callbacks.reorderTracks(multiTrackId, fromIndex, toIndex);
    callbacks.updateCursorPosition(wasPlaying, currentTime);
  });

  // @ts-ignore
  instance.on("remove-track", ({ id }: { id: string }) => {
    console.log("remove-track", id);
    callbacks.removeTrack(multiTrackId, id);
  });


  instance.on("start-position-change", ({ id, startPosition }) => {
    callbacks.updateTrackStartTime(multiTrackId, id.toString(), startPosition);
  });
  return instance;
}

