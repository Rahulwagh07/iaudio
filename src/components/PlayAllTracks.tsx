import { useEffect, useRef, useState } from "react";
import { FaPause, FaPlay } from "react-icons/fa";
import useAudioStore from "../store/useAudioStore";
import { usePlayingState } from "../hooks/usePlayingState";
import MultiTrack from "wavesurfer-multitrack";

export default function PlayAllTracks() {
  const wavesurferRef = useRef<MultiTrack | null>(null);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [lastPlayedTime, setLastPlayedTime] = useState(0);
  const [isPausedByUser, setIsPausedByUser] = useState(false);
  const [isUserClicked, setIsUserClicked] = useState(false);

  const trackRef = useRef(currentTrackIndex);
  const tracksRef = useRef<typeof tracks>([]);
  const playModeRef = useRef<typeof playMode>("None");
  const isPausedRef = useRef(isPausedByUser);
  const isUserClickedRef = useRef(isUserClicked);
  const currentTrackWavesurferRef = useRef<MultiTrack | null>(null);

  const { tracks, playMode, setPlayMode } = useAudioStore();
  const currentTrack = tracks[currentTrackIndex];
  const isPlaying = usePlayingState(wavesurferRef);

  useEffect(() => {
    trackRef.current = currentTrackIndex;
    tracksRef.current = tracks;
    playModeRef.current = playMode;
    isPausedRef.current = isPausedByUser;
    isUserClickedRef.current = isUserClicked;
    currentTrackWavesurferRef.current = currentTrack?.wavesurfer || null;
  }, [
    currentTrackIndex,
    tracks,
    playMode,
    isPausedByUser,
    isUserClicked,
    currentTrack?.wavesurfer,
  ]);

  // to update the ws ref to the current track
  useEffect(() => {
    wavesurferRef.current = currentTrack?.wavesurfer || null;
  }, [currentTrack?.wavesurfer]);

  //auto play next track in a continuous loop
  useEffect(() => {
    if (!isPlaying) {
      if (playModeRef.current === "Individual" || !isUserClickedRef.current) {
        return;
      }

      if (currentTrackWavesurferRef.current && !isPausedRef.current) {
        const nextIndex = (trackRef.current + 1) % tracksRef.current.length;

        setTimeout(() => {
          setCurrentTrackIndex(nextIndex);
          const nextTrack = tracksRef.current[nextIndex]?.wavesurfer;
          if (nextTrack) {
            nextTrack.setTime(0);
            nextTrack.play();
          }
        }, 0);
      }
    }
  }, [isPlaying]);

  const handlePlayAllTracks = () => {
    if (tracks.length === 0) {
      return;
    }

    if (playMode === "Individual") {
      return;
    }
    setIsUserClicked(true);

    try {
      if (isPlaying && playMode === "All") {
        setIsPausedByUser(true);
        setLastPlayedTime(currentTrack?.wavesurfer?.getCurrentTime() || 0);
        tracks.forEach((track) => {
          track.wavesurfer?.pause();
        });
        setPlayMode("None");
      } else if (!isPlaying) {
        setIsPausedByUser(false);
        const currentTime = currentTrack?.wavesurfer?.getCurrentTime() || 0;

        if (Math.abs(currentTime - lastPlayedTime) > 0.1) {
          setCurrentTrackIndex(0);
          tracks.forEach((track, index) => {
            if (index === 0) {
              track.wavesurfer?.setTime(0);
              track.wavesurfer?.play();
            } else {
              track.wavesurfer?.pause();
            }
          });
        } else {
          currentTrack?.wavesurfer?.play();
        }
        setPlayMode("All");
      }
    } catch (err) {
      console.log("error playing all tracks", err);
    }
  };

  return (
    <button
      onClick={handlePlayAllTracks}
      className={`sm:px-4 px-3  py-3  ${
        playMode === "Individual" && "cursor-auto"
      }  bg-purple-600 bg-opacity-50 text-white border-2 border-purple-600 rounded-md
          hover:bg-opacity-75 transition-colors duration-200  flex items-center whitespace-nowrap`}
    >
      {isPlaying && playMode === "All" ? (
        <FaPause className="w-4 h-4 sm:mr-2" />
      ) : (
        <FaPlay className="w-4 h-4 sm:mr-2" />
      )}

      <span className="hidden sm:block">
        {" "}
        {isPlaying && playMode === "All" ? "Stop All" : "Play All"}
      </span>
    </button>
  );
}
