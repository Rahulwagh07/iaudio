import type React from "react";
import { useDrop } from "react-dnd";
import { NativeTypes } from "react-dnd-html5-backend";
import useAudioStore from "../store/useAudioStore";
import { handleFileUpload } from "../lib/fileUpload";

export default function InitialAudioUpload() {
  const { addPills, addTrack } = useAudioStore();

  const [{ isOver, canDrop }, drop] = useDrop({
    accept: [NativeTypes.FILE],
    drop: (item: { files: FileList }) => {
      const { files } = handleFileUpload(item.files);
      const trackId = addTrack();
      addPills(trackId, files);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const { files: processedFiles } = handleFileUpload(files);
      const trackId = addTrack();
      addPills(trackId, processedFiles);
    }
  };

  return (
    <div
      ref={drop}
      className={`p-12 border-2 border-dashed rounded-xl text-center transition-colors w-full max-w-xl
        ${
          isOver && canDrop
            ? "border-yellow-400 bg-yellow-400/10"
            : "border-white/50"
        }`}
    >
      <input
        type="file"
        accept=".mp3,.wav"
        onChange={handleFileChange}
        className="hidden"
        id="file-upload"
        multiple
      />
      <label
        htmlFor="file-upload"
        className="cursor-pointer inline-block bg-white text-purple-800 font-bold py-3 px-6 
        rounded-full hover:bg-yellow-400 transition-colors duration-200 mb-4"
      >
        Select File
      </label>
      <p className="mt-4 text text-white/80">
        Or drag a file here
      </p>
      <p className="mt-2 text-xs text-white/60">Supported formats: MP3, WAV</p>
    </div>
  );
}
