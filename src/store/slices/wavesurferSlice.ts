import { StateCreator } from 'zustand';
import { MultiTrackState } from '../../types';

export const createWavesurferSlice: StateCreator<
  MultiTrackState,
  [],
  [],
  { setWaveSurfer: MultiTrackState['setWaveSurfer'] }
> = (set) => ({
  setWaveSurfer: (multiTrackId, wavesurfer) => {
    set(state => {
      const multiTrackIndex = state.multiTracks.findIndex(t => t.id === multiTrackId);
      if (multiTrackIndex === -1) return state;

      if (state.multiTracks[multiTrackIndex].wavesurfer === wavesurfer) return state;

      if (
        state.multiTracks[multiTrackIndex].wavesurfer &&
        state.multiTracks[multiTrackIndex].wavesurfer !== wavesurfer
      ) {
        state.multiTracks[multiTrackIndex].wavesurfer.destroy();
      }

      const newMultiTracks = [...state.multiTracks];
      newMultiTracks[multiTrackIndex] = {
        ...newMultiTracks[multiTrackIndex],
        wavesurfer: wavesurfer || undefined,
      };

      return { multiTracks: newMultiTracks };
    }, false);
  },
});