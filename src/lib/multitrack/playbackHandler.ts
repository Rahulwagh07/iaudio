import { RefObject } from "react";
import MultiTrack from "wavesurfer-multitrack";
import { CustomMultiTrack } from "../../types";
import { calTimeLineDuration } from "../../utils/calTimeLineDuration";

interface PlayMultiTrackParams {
  multiTrack: CustomMultiTrack;
  multitrackRef: RefObject<MultiTrack | null>;
  containerRef: RefObject<HTMLDivElement>;
  isPlaying: boolean;
  playMultiTrack: (id: string) => void;
  pauseMultiTrack: (id: string) => void;
}

export const handlePlayMultiTrack = ({
  multiTrack,
  multitrackRef,
  containerRef,
  isPlaying,
  playMultiTrack,
  pauseMultiTrack,
}: PlayMultiTrackParams) => {
  if (multiTrack.tracks.length === 0) return;
  if (!multitrackRef.current) {
    return;
  }

  try {
    const currentTime = multitrackRef.current.getCurrentTime() || 0;
    const totalDuration = containerRef.current
      ? calTimeLineDuration(containerRef.current)
      : 0;

    if (currentTime >= totalDuration && totalDuration !== 0) {
      multitrackRef.current.setTime(0);
    } else {
      multitrackRef.current.setTime(currentTime);
    }

    if (isPlaying) {
      pauseMultiTrack(multiTrack.id);
    } else {
      playMultiTrack(multiTrack.id);
    }

  } catch (err) {
    console.log("Error playing track with id", multiTrack?.id, err);
  }
}; 