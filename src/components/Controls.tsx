import useAudioStore from "../store/useAudioStore";
import { IoAdd } from "react-icons/io5";
import { FaVolumeUp } from "react-icons/fa";
import PlayAllTracks from "./PlayAllTracks";

export default function Controls() {
  const { addTrack, setVolume, volume } = useAudioStore();
  const handleVolumeChange = (volume: number) => {
    setVolume(volume);
  };

  return (
    <div className=" flex  gap-4 items-center">
      <div className="flex items-center gap-2 border-2 sm:px-5 px-3 sm:py-4 py-3  border-purple-600 rounded-md">
        <FaVolumeUp className="w-4 h-4 text-purple-600" />
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
          className="w-24 accent-purple-600"
        />
      </div>

      <PlayAllTracks />
      <button
        onClick={addTrack}
        className="sm:px-5 px-3 py-3   bg-purple-600 bg-opacity-50 text-white border-2 border-purple-600 rounded-md
          hover:bg-opacity-75 transition-colors duration-200 flex items-center whitespace-nowrap"
      >
        <IoAdd className="w-4 h-4 sm:mr-2" />
        <span className="hidden sm:block">Add Track</span>
      </button>
    </div>
  );
}
