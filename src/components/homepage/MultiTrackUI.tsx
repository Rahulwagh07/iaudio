import useMultiTrackStore from "../../store";
import CustomMultiTrack from "../multitrack/CustomMultiTrack";

export default function MultiTrackUI({
  multiTracks,
}: {
  multiTracks: CustomMultiTrack[];
}) {
  const deleteMultiTrack = useMultiTrackStore(
    (state) => state.deleteMultiTrack
  );
  return (
    <div className="flex flex-col gap-1 bg-purple-950 border border-purple-800 rounded-t-md">
      {multiTracks.map((multiTrack) => (
        <CustomMultiTrack
          key={multiTrack.id}
          multiTrack={multiTrack}
          onDeleteMultiTrack={deleteMultiTrack}
        />
      ))}
    </div>
  );
}
