import { useEffect, useRef, memo } from "react";
import MultiTrack from "wavesurfer-multitrack";
import useAudioStore from "../store/useAudioStore";
import { AudioTrack } from "../types";
import { IoCloudUpload } from "react-icons/io5";
import { FaPause, FaPlay } from "react-icons/fa";
import { BiX } from "react-icons/bi";
import "../styles/track.css";
import { ACCEPTED_TYPES } from "../lib/constant";

interface TrackProps {
  track: AudioTrack;
  onDeleteTrack: (trackId: string) => void;
}

const Track = memo(({ track, onDeleteTrack }: TrackProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const multitrackRef = useRef<MultiTrack | null>(null);
  const { setWaveSurfer, addPill, playTrack, pauseTrack, isTrackPlaying } =
    useAudioStore();

  useEffect(() => {
    if (containerRef.current && !multitrackRef.current) {
      const instance = MultiTrack.create(
        track.pills.map((pill) => ({
          id: pill.id,
          draggable: true,
          startPosition: pill.startTime,
          volume: 1,
          options: {
            waveColor: "hsl(210, 87%, 50%)",
            progressColor: "hsl(210, 87%, 40%)",
          },
          url: pill.url,
        })),
        {
          container: containerRef.current,
          minPxPerSec: 15,
          cursorColor: "#6b21a8",
          dragBounds: false, //to make the longest pill draggable
          cursorWidth: 2,
          trackBorderColor: "hsl(210, 60%, 30%)",
        }
      );

      containerRef.current.classList.add("multitrack-container");

      multitrackRef.current = instance;
      setWaveSurfer(track.id, instance);
    }

    return () => {
      if (multitrackRef.current) {
        multitrackRef.current.destroy();
        multitrackRef.current = null;
      }
    };
  }, [track.id, track.pills, setWaveSurfer]);

  const uploadFile = async () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ACCEPTED_TYPES.join(",");
    fileInput.onchange = async (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        addPill(track.id, file);
      }
    };
    fileInput.click();
  };

  const handlePlayTrack = () => {
    if (track.pills.length === 0) return;
    if (isTrackPlaying(track.id)) {
      pauseTrack(track.id);
    } else {
      playTrack(track.id);
    }
  };

  const handleDeleteTrack = () => {
    if (multitrackRef.current) {
      multitrackRef.current.destroy();
    }
    onDeleteTrack(track.id);
  };

  return (
    <div
      ref={containerRef}
      className={`flex h-full border-purple-700 ${
        track.pills.length === 0 ? "timeline-hidden" : ""
      }`}
    >
      <div
        className=" relative rounded-tl-md w-24 sm:w-36 min-h-16 bg-purple-900 
      flex flex-col items-center justify-center gap-2 p-2"
      >
        <div className="text-sm font-medium text-gray-300">{track.name}</div>
        <div className="flex gap-2 flex-col sm:flex-row">
          <button
            onClick={uploadFile}
            className="p-2 rounded-lg bg-purple-800 hover:bg-purple-700 transition-colors"
          >
            <IoCloudUpload className="w-4 h-4 text-gray-300" />
          </button>
          <button
            onClick={handlePlayTrack}
            className="p-2 rounded-lg bg-purple-700 hover:bg-purple-800 transition-colors"
          >
            {isTrackPlaying(track.id) ? (
              <FaPause className="w-4 h-4 text-gray-300" />
            ) : (
              <FaPlay className="w-4 h-4 text-gray-300" />
            )}
          </button>
        </div>
        <button
          onClick={handleDeleteTrack}
          className="absolute top-1 left-1 p-1  hover:bg-purple-800  rounded-full"
        >
          <BiX className="w-3 h-3 text-white " />
        </button>
      </div>

      <div className="h-full flex-1">
        <div id={`waveform-${track.id}`} className="h-full" />
      </div>
    </div>
  );
});

export default Track;
