import { useState, useEffect } from 'react';
import MultiTrack from "wavesurfer-multitrack";

//regularly check that track is finished playing
export const usePlayingState = (multitrackRef: React.RefObject<MultiTrack | null>) => {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const checkPlayingState = setInterval(() => {
      if (multitrackRef.current) {
        setIsPlaying(multitrackRef.current.isPlaying());
      }
    }, 300);

    return () => clearInterval(checkPlayingState);
  }, [multitrackRef]);

  return isPlaying;
};