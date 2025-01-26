import MultiTrack from "wavesurfer-multitrack";
import { AudioPill } from "../types";
import { initVerticalDragging } from "./trackUtils";

interface CreateMultiTrackParams {
  container: HTMLDivElement;
  pills: AudioPill[];
  trackId: string;
  callbacks: {
    setWaveSurfer: (trackId: string, instance: MultiTrack) => void;
    reorderPills: (trackId: string, fromIndex: number, toIndex: number) => void;
    removePill: (trackId: string, pillId: string) => void;
    updatePillStartTime: (trackId: string, pillId: string, startTime: number) => void;
  };
}

export function createMultiTrack({
  container,
  pills,
  trackId,
  callbacks,
}: CreateMultiTrackParams): MultiTrack {
  const instance = MultiTrack.create(
    pills.map((pill) => ({
      id: pill.id,
      draggable: true,
      startPosition: pill.startTime,
      eenvelope: [{
        time: 0,
        volume: 1
      }],
      options: {
        waveColor: "hsl(210, 87%, 50%)",
        progressColor: "hsl(210, 87%, 40%)",
      },
      url: pill.url,
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

  callbacks.setWaveSurfer(trackId, instance);
  initVerticalDragging(instance);

  // @ts-ignore
  instance.on("reorder-track", ({ fromIndex, toIndex }: { fromIndex: number; toIndex: number }) => {
    callbacks.reorderPills(trackId, fromIndex, toIndex);
  });

  // @ts-ignore
  instance.on("remove-track", ({ id }: { id: string }) => {
    callbacks.removePill(trackId, id.toString());
  });

  instance.on("start-position-change", ({ id, startPosition }) => {
    callbacks.updatePillStartTime(trackId, id.toString(), startPosition);
  });

  return instance;
}

