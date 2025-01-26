import { useEffect, useRef, memo, useState } from "react";
import MultiTrack from "wavesurfer-multitrack";
import useAudioStore from "../store/useAudioStore";
import { AudioTrack, AudioExportProgress } from "../types";
import { FaPause, FaPlay} from "react-icons/fa";
import { BiX } from "react-icons/bi";
import "../styles/track.css";
import AudioDropZone from "./AudioDropZone";
import { createMultiTrack } from "../lib/createMultiTrack";
import { createFileInput } from "../lib/fileUpload";
import { getTotalDuration } from "../lib/trackUtils";
import { usePlayingState } from "../hooks/usePlayingState";
import { AudioExporter } from '../lib/audioExport';
import { GoUpload, GoDownload } from "react-icons/go";
import Progress from "./Progress";

interface TrackProps {
  track: AudioTrack;
  onDeleteTrack: (trackId: string) => void;
}

const Track = memo(({ track, onDeleteTrack }: TrackProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const multitrackRef = useRef<MultiTrack | null>(null);
  const isPlaying = usePlayingState(multitrackRef);
  const [exportProgress, setExportProgress] = useState<AudioExportProgress | null>(null);
  const {
    setWaveSurfer,
    addPills,
    playTrack,
    pauseTrack,
    reorderPills,
    removePill,
    playMode,
    setPlayMode,
    isExporting,
    setIsExporting,
    updatePillStartTime,
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
          updatePillStartTime,
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
    track.id,
    track.pills,
    reorderPills,
    removePill,
    setWaveSurfer,
    playTrack,
  ]);

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

    if (playMode === "All") {
      return;
    }

    if (!multitrackRef.current) {
      return;
    }

    try {
      const currentTime = multitrackRef.current?.getCurrentTime() || 0;
      const totalDuration = containerRef.current
        ? getTotalDuration(containerRef.current)
        : 0;
      if (currentTime >= totalDuration) {
        multitrackRef.current?.setTime(0);
      } else {
        multitrackRef.current?.setTime(currentTime);
      }
      if (multitrackRef.current?.isPlaying()) {
        pauseTrack(track.id);
        setPlayMode("None");
      } else {
        playTrack(track.id);
        setPlayMode("Individual");
      }
    } catch (err) {
      console.log("error playing track with id", track?.id, err);
    }
  };

  const handleDeleteTrack = () => {
    try {
      if (multitrackRef.current) {
        multitrackRef.current.destroy();
      }
      onDeleteTrack(track.id);
    } catch (err) {
      console.log("error deleting track with id", track?.id, err);
    }
  };

  const handleExport = async () => {
    if (isExporting || track.pills.length === 0) return;

    try {
      setIsExporting(true);
      const exporter = new AudioExporter(setExportProgress);
      await exporter.exportToMp3(track);
    } catch (error) {
      console.log('failed to export', error);
    } finally {
      setIsExporting(false);
      setExportProgress(null);
    }
  };

  return (
    <>
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
              <GoUpload className="w-4 h-4 text-gray-300" />
            </button>
            <button
              onClick={handlePlayTrack}
              className={`p-2 rounded-lg ${
                playMode === "All"
                  ? "bg-purple-700 hover:bg-purple-800 cursor-auto"
                  : "bg-purple-800 hover:bg-purple-700"
              } transition-colors`}
            >
              {isPlaying ? (
                <FaPause className="w-4 h-4 text-gray-300" />
              ) : (
                <FaPlay className="w-4 h-4 text-gray-300" />
              )}
            </button>
            <button
              onClick={handleExport}
              disabled={track.pills.length === 0 || isExporting}
              className={`p-2 rounded-lg bg-purple-800 hover:bg-purple-700 
                transition-colors ${isExporting && 'cursor-auto'}`}
              title="Export as MP3"
            >
              <GoDownload className="w-4 h-4 text-gray-300" />
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

      {exportProgress && (
        <Progress exportProgress={exportProgress} />
      )}
    </>
  );
});

Track.displayName = "Track";

export default Track;
