import { useEffect, useRef, memo } from "react";
import MultiTrack from "wavesurfer-multitrack";
import useAudioStore from "../store/useAudioStore";
import { AudioTrack } from "../types";
import { IoCloudUpload } from "react-icons/io5";
import { FaPause, FaPlay } from "react-icons/fa";
import { BiX } from "react-icons/bi";
import "../styles/track.css";
import AudioDropZone from "./AudioDropZone";
import { createMultiTrack } from "../lib/createMultiTrack";
import { createFileInput } from "../lib/fileUpload";

interface TrackProps {
  track: AudioTrack;
  onDeleteTrack: (trackId: string) => void;
}

const Track = memo(({ track, onDeleteTrack }: TrackProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const multitrackRef = useRef<MultiTrack | null>(null);

  const {
    setWaveSurfer,
    addPills,
    playTrack,
    pauseTrack,
    isTrackPlaying,
    reorderPills,
    removePill,
  } = useAudioStore();

  useEffect(() => {
    if (containerRef.current) {
      if (multitrackRef.current) {
        multitrackRef.current.destroy();
      }

      multitrackRef.current = createMultiTrack({
        container: containerRef.current,
        pills: track.pills,
        trackId: track.id,
        callbacks: {
          setWaveSurfer,
          reorderPills,
          removePill,
        },
      });

      console.log(multitrackRef.current.isPlaying());
       
    }

    return () => {
      if (multitrackRef.current) {
        multitrackRef.current.destroy();
        multitrackRef.current = null;
      }
    };
  }, [track.id, track.pills, reorderPills, removePill, setWaveSurfer, playTrack, isTrackPlaying]);

  const handleUploadFile = async () => {
    const fileInput = createFileInput((files) => {
      if (files.length > 0 && multitrackRef.current) {
        try {
          addPills(track.id, files);
        } catch (error) {
          console.log("Failed to add track:", error);
        }
      }
    });
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
      className={`flex h-full border-purple-700 relative ${
        track.pills.length === 0 ? "timeline-hidden" : ""
      }`}
    >
      <AudioDropZone trackId={track.id} />
      <div
        className=" relative rounded-tl-md w-24 sm:w-36 min-h-16 bg-purple-900 
      flex flex-col items-center justify-center gap-2 p-2"
      >
        <div className="text-sm font-medium text-gray-300">{track.name}</div>
        <div className="flex gap-2 flex-col sm:flex-row">
          <button
            onClick={handleUploadFile}
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
          className="absolute top-1 left-1 p-1   hover:bg-purple-800  rounded-full"
        >
          <BiX className="w-3 h-3 text-white " />
        </button>
      </div>
    </div>
  );
});

export default Track;
