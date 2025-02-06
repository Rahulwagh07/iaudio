import { StateCreator } from 'zustand';
import { MultiTrackState } from '../../types';

export const createTrackSlice: StateCreator<
  MultiTrackState,
  [],
  [],
  Pick<MultiTrackState, 'updateTrackStartTime' | 'removeTrack'>
> = (set, get) => ({
  updateTrackStartTime: (multiTrackId: string, trackId: string, startTime: number) => {
    const state = get();
    const multiTrack = state.multiTracks.find(t => t.id === multiTrackId);
    if (multiTrack) {
      const track = multiTrack.tracks.find(t => t.id === trackId);
      if (track) {
        track.startTime = startTime;
      }
    }
  },

  removeTrack: (multiTrackId: string, trackId: string) => {
    set(state => ({
      multiTracks: state.multiTracks.map(multiTrack =>
        multiTrack.id === multiTrackId
          ? { ...multiTrack, tracks: multiTrack.tracks.filter(track => track.id !== trackId) }
          : multiTrack
      ),
    }));
  },
});