import MultiTrackUI from "./components/homepage/MultiTrackUI";
import Navbar from "./components/navbar/Navbar";
import Logo from "./components/navbar/Logo";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import FileUploadZone from "./components/homepage/FileUploadZone";
import useMultiTrackStore from "./store";

function App() {
  const { multiTracks } = useMultiTrackStore();

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gradient-to-br from-purple-800 via-blue-900 to-teal-800 text-white">
        {multiTracks.length > 0 ? (
          <div className="flex flex-col w-full md:w-11/12 mx-auto">
            <Navbar />
            <div className="flex-grow p-4 overflow-auto">
              <MultiTrackUI multiTracks={multiTracks} />
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-8 items-center justify-center min-h-screen p-4">
            <Logo />
            <h1 className="text-5xl font-bold mb-4 text-center">
              Create Multi-Track Audio Compositions
            </h1>

            <FileUploadZone />
          </div>
        )}
      </div>
    </DndProvider>
  );
}

export default App;
