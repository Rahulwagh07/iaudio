import { StateCreator } from 'zustand';
import { MultiTrackState } from '../../types';

export const createPlayerSlice: StateCreator<
  MultiTrackState,
  [],
  [],
  Pick<MultiTrackState, 'playMultiTrack' | 'pauseMultiTrack'>
> = (set, get) => ({
  playMultiTrack: (multiTrackId: string) => {
    const state = get();
    const multiTrack = state.multiTracks.find(t => t.id === multiTrackId);

    if (multiTrack?.wavesurfer) {
      if (state.activeMultiTrackId === multiTrackId && multiTrack.wavesurfer.isPlaying()) {
        multiTrack.wavesurfer.pause();
        set({ activeMultiTrackId: null });
      } else {
        state.multiTracks.forEach(t => {
          if (t.id !== multiTrackId) {
            t.wavesurfer?.pause();
          }
        });
        multiTrack.wavesurfer?.play();
        set({ activeMultiTrackId: multiTrackId });
      }
    }
  },

  pauseMultiTrack: (multiTrackId: string) => {
    const state = get();
    const multiTrack = state.multiTracks.find(t => t.id === multiTrackId);
    if (multiTrack?.wavesurfer) {
      multiTrack.wavesurfer.pause();
      set({ activeMultiTrackId: null });
    }
  },
});