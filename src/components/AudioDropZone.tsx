import { useDrop } from 'react-dnd';
import { NativeTypes } from 'react-dnd-html5-backend';
import useAudioStore from '../store/useAudioStore';
import { IoCloudUpload } from "react-icons/io5";
import { handleFileUpload } from "../lib/fileUpload";

interface AudioDropZoneProps {
  trackId: string;
}

const AudioDropZone = ({ trackId}: AudioDropZoneProps) => {
  const { addPills } = useAudioStore();

  const [{ isOver, canDrop }, drop] = useDrop({
    accept: [NativeTypes.FILE],
    drop: (item: { files: FileList }) => {
      const { files } = handleFileUpload(item.files);
      if (files.length > 0) {
        addPills(trackId, files);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  });

  return (
    <>
      {(canDrop) && (
        <div className="absolute w-full h-[80%] bottom-4 flex items-center justify-center">
          <div 
            ref={drop} 
            className={`z-10 flex flex-col border-2 border-dashed w-72 h-full items-center justify-center
              bg-purple-900/10 backdrop-blur-sm rounded-lg
              ${isOver 
                ? 'border-purple-400 scale-105' 
                : 'border-purple-600 scale-100'
              } 
              transition-all duration-200 ease-in-out`}
          >
            <IoCloudUpload 
              className={`w-8 h-8 mb-2
                ${isOver ? 'text-purple-300' : 'text-purple-500'}
                transition-colors duration-200`} 
            />
            <p className={`text-sm font-medium
              ${isOver ? 'text-purple-200' : 'text-purple-300'}
              transition-colors duration-200`}>
              {isOver ? 'Release to add' : 'Drop audio file here'}
            </p>
            <p className="text-purple-400/70 text-xs mt-1">
              MP3, WAV
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default AudioDropZone;
 