import { useEffect, useRef, memo } from "react";
import MultiTrack from "wavesurfer-multitrack";
import type { CustomMultiTrack } from "../../types";
import { FaPause, FaPlay } from "react-icons/fa";
import { BiX } from "react-icons/bi";
import "../../styles/track.css";
import { initMultiTrack } from "../../lib/multitrack/initMultiTrack";
import { createFileInput } from "../../lib/fileUpload";
import { usePlayingState } from "../../hooks/usePlayingState";
import { GoUpload } from "react-icons/go";
import DragDropZone from "./DragDropZone";
import { handlePlayMultiTrack } from "../../lib/multitrack/playbackHandler";
import useMultiTrackStore from "../../store";

interface CustomMultiTrackProps {
  multiTrack: CustomMultiTrack;
  onDeleteMultiTrack: (multiTrackId: string) => void;
}

const CustomMultiTrack = memo(
  ({ multiTrack, onDeleteMultiTrack }: CustomMultiTrackProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const multitrackRef = useRef<MultiTrack | null>(null);
    const isPlaying = usePlayingState(multitrackRef);

    const setWaveSurfer = useMultiTrackStore((state) => state.setWaveSurfer);
    const addTracks = useMultiTrackStore((state) => state.addTracks);
    const playMultiTrack = useMultiTrackStore((state) => state.playMultiTrack);
    const pauseMultiTrack = useMultiTrackStore(
      (state) => state.pauseMultiTrack
    );
    const reorderTracks = useMultiTrackStore((state) => state.reorderTracks);
    const removeTrack = useMultiTrackStore((state) => state.removeTrack);
    const updateTrackStartTime = useMultiTrackStore(
      (state) => state.updateTrackStartTime
    );

    useEffect(() => {
      if (containerRef.current) {
        if (multitrackRef.current) {
          multitrackRef.current.destroy();
        }
        multitrackRef.current = initMultiTrack({
          container: containerRef.current,
          tracks: multiTrack.tracks,
          multiTrackId: multiTrack.id,
          callbacks: {
            setWaveSurfer,
            reorderTracks,
            removeTrack,
            updateTrackStartTime,
            updateCursorPosition,
          },
        });
      }
      return () => {
        if (multitrackRef.current) {
          multitrackRef.current.destroy();
          multitrackRef.current = null;
        }
      };
    }, [
      multiTrack.id,
      multiTrack.tracks,
      reorderTracks,
      removeTrack,
      setWaveSurfer,
      playMultiTrack,
      updateTrackStartTime,
    ]);

    const handleUploadFile = async () => {
      const fileInput = createFileInput((files) => {
        if (files.length > 0 && multitrackRef.current) {
          try {
            addTracks(multiTrack.id, files);
          } catch (error) {
            console.log("Failed to add track:", error);
          }
        }
      });
      fileInput.click();
    };

    const handlePlay = () => {
      handlePlayMultiTrack({
        multiTrack,
        multitrackRef,
        containerRef,
        isPlaying,
        playMultiTrack,
        pauseMultiTrack,
      });
    };

    const handleDeleteTrack = () => {
      try {
        if (multitrackRef.current) {
          multitrackRef.current.destroy();
        }
        onDeleteMultiTrack(multiTrack.id);
      } catch (err) {
        console.log("Error deleting track with id", multiTrack?.id, err);
      }
    };

    const updateCursorPosition = (wasPlaying: boolean, currentTime: number) => {
      if (!multitrackRef.current) return;
      console.log("updateCursorPosition", currentTime);
      setTimeout(() => {
        multitrackRef.current?.setTime(currentTime);
        if (wasPlaying) {
          multitrackRef.current?.play();
        }
      }, 100);
    };

    return (
      <div
        ref={containerRef}
        className={`flex h-full border-purple-700 relative ${
          multiTrack.tracks.length === 0 ? "timeline-hidden" : ""
        }`}
      >
        <DragDropZone multiTrackId={multiTrack.id} />
        <div
          className=" relative rounded-tl-md w-24 sm:w-36 min-h-16 bg-purple-900 
        flex flex-col items-center justify-center gap-2 p-2"
        >
          <div className="text-sm font-medium text-gray-300">
            {multiTrack.name}
          </div>
          <div className="flex gap-2 flex-col sm:flex-row">
            <button
              onClick={handleUploadFile}
              className="p-2 rounded-lg bg-purple-800 hover:bg-purple-700 transition-colors"
            >
              <GoUpload className="w-4 h-4 text-gray-300" />
            </button>
            <button
              onClick={handlePlay}
              className={`p-2 rounded-lg
                bg-purple-800 hover:bg-purple-700
               transition-colors`}
            >
              {isPlaying ? (
                <FaPause className="w-4 h-4 text-gray-300" />
              ) : (
                <FaPlay className="w-4 h-4 text-gray-300" />
              )}
            </button>
          </div>
          <button
            onClick={handleDeleteTrack}
            className="absolute top-1 left-1 p-1 hover:bg-purple-800  rounded-full"
          >
            <BiX className="w-3 h-3 text-white " />
          </button>
        </div>
      </div>
    );
  }
);

CustomMultiTrack.displayName = "CustomMultiTrack";

export default CustomMultiTrack;
