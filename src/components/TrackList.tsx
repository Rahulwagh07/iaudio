import Track from "./Track";
import { AudioTrack } from "../types";
import useAudioStore from "../store/useAudioStore";

export default function TrackList({ tracks }: { tracks: AudioTrack[] }) {
  const { deleteTrack } = useAudioStore();

  return (
    <div className="flex flex-col gap-1 bg-purple-950 border border-purple-800 rounded-t-md">
      {tracks.map((track) => (
        <Track key={track.id} track={track} onDeleteTrack={deleteTrack} />
      ))}
    </div>
  );
}
