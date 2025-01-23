import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import FileUpload from "./components/FileUpload";
import TrackList from "./components/TrackList";
import useAudioStore from "./store/useAudioStore";
import Navbar from "./components/Navbar";
import Logo from "./components/Logo";

function App() {
  const { tracks } = useAudioStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-800 via-blue-900 to-teal-800 text-white">
      {tracks.length > 0 ? (
        <div className="flex flex-col w-full sm:w-11/12 mx-auto">
          <Navbar />
          <div className="flex-grow p-4 overflow-auto">
            <TrackList tracks={tracks} />
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-8 items-center justify-center min-h-screen p-4">
          <Logo />
          <h1 className="text-5xl font-bold mb-4 text-center">
            Create Multi-Track Audio Compositions
          </h1>

          <DndProvider backend={HTML5Backend}>
            <FileUpload />
          </DndProvider>
        </div>
      )}
    </div>
  );
}

export default App;
