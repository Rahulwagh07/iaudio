import type React from "react";
import { useDrop } from "react-dnd";
import { NativeTypes } from "react-dnd-html5-backend";
import useAudioStore from "../store/useAudioStore";
import { ACCEPTED_TYPES } from "../lib/constant";

export default function FileUpload() {
  const { addPill, addTrack } = useAudioStore();

  const [{ isOver }, drop] = useDrop({
    accept: [NativeTypes.FILE],
    drop: (item: { files: FileList }) => {
      const file = Array.from(item.files).find((file) =>
        ACCEPTED_TYPES.some((type) => file.name.toLowerCase().endsWith(type))
      );

      if (file) {
        const trackId = addTrack();
        addPill(trackId, file);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const trackId = addTrack();
      addPill(trackId, file);
    }
  };

  return (
    <div
      ref={drop}
      className={`p-12 border-2 border-dashed rounded-xl text-center transition-colors w-full max-w-xl
        ${isOver ? "border-yellow-400 bg-yellow-400/10" : "border-white/50"}`}
    >
      <input
        type="file"
        accept=".mp3,.wav"
        onChange={handleFileChange}
        className="hidden"
        id="file-upload"
      />
      <label
        htmlFor="file-upload"
        className="cursor-pointer inline-block bg-white text-purple-800 font-bold py-3 px-6 
        rounded-full hover:bg-yellow-400 transition-colors duration-200 mb-4"
      >
        Select File
      </label>
      <p className="mt-4 text-sm text-white/80">
        Or drag and drop an audio file here
      </p>
      <p className="mt-2 text-xs text-white/60">Supported formats: MP3, WAV</p>
    </div>
  );
}
