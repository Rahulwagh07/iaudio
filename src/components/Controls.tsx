import useAudioStore from "../store/useAudioStore";
import { IoAdd } from "react-icons/io5";

export default function Controls() {
  const { addTrack } = useAudioStore();

  return (
    <div className="flex gap-4">
      <button
        onClick={addTrack}
        className="px-4 py-2 bg-purple-600 bg-opacity-50 text-white rounded-md 
          hover:bg-opacity-75 transition-colors duration-200 flex items-center"
      >
        <IoAdd className="w-4 h-4 mr-2" />
        Add Track
      </button>
    </div>
  );
}
