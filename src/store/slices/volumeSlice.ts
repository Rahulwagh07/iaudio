import { StateCreator } from 'zustand';
import { MultiTrackState } from '../../types';

export const createVolumeSlice: StateCreator<
  MultiTrackState,
  [],
  [],
  { setVolume: MultiTrackState['setVolume'] }
> = (set, get) => ({
  setVolume: (volume: number) => {
    set({ volume });
    const state = get();
    state.multiTracks.forEach(multiTrack => {
      if (multiTrack.wavesurfer) {
        multiTrack.tracks.forEach((_, index) => {
          multiTrack.wavesurfer?.setTrackVolume(index, volume);
        });
      }
    });
  },
});