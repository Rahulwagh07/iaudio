import { StateCreator } from 'zustand';
import { MultiTrackState } from '../../types';
import { nanoid } from 'nanoid';
import { calAudioDuration } from '../../utils/calAudioDuration';

export const createMultiTrackSlice: StateCreator<
  MultiTrackState,
  [],
  [],
  Pick<MultiTrackState, 'addMultiTrack' | 'deleteMultiTrack' | 'addTracks' | 'reorderTracks'>
> = (set) => ({
  addMultiTrack: () => {
    const newMultiTrackId = nanoid();
    set(state => ({
      multiTracks: [
        ...state.multiTracks,
        {
          id: newMultiTrackId,
          name: `MultiTrack ${state.multiTracks.length + 1}`,
          tracks: [],
        },
      ],
    }));
    return newMultiTrackId;
  },

  deleteMultiTrack: (multiTrackId: string) =>
    set(state => {
      const filteredMultiTracks = state.multiTracks.filter(t => t.id !== multiTrackId);
      const updatedMultiTracks = filteredMultiTracks.map((multiTrack, index) => ({
        ...multiTrack,
        name: `MultiTrack ${index + 1}`,
      }));

      const newState: Partial<MultiTrackState> = { multiTracks: updatedMultiTracks };

      if (state.activeMultiTrackId === multiTrackId) {
        newState.activeMultiTrackId = null;
      }

      return newState;
    }),

  addTracks: async (multiTrackId: string, files: File[]) => {
    try {
      const newTracks = await Promise.all(
        files.map(async file => {
          const duration = await calAudioDuration(file);
          return {
            id: nanoid(),
            file,
            url: URL.createObjectURL(file),
            startTime: 0,
            duration,
            name: file.name,
          };
        })
      );

      set(state => ({
        multiTracks: state.multiTracks.map(multiTrack =>
          multiTrack.id === multiTrackId
            ? { ...multiTrack, tracks: [...multiTrack.tracks, ...newTracks] }
            : multiTrack
        ),
      }));
    } catch (error) {
      console.error('error adding tracks:', error);
    }
  },

  reorderTracks: (multiTrackId: string, fromIndex: number, toIndex: number) => {
    set(state => {
      const multiTrackIndex = state.multiTracks.findIndex(t => t.id === multiTrackId);
      if (multiTrackIndex === -1) return state;

      const multiTrack = state.multiTracks[multiTrackIndex];
      const newTracks = [...multiTrack.tracks];
      const [movedTrack] = newTracks.splice(fromIndex, 1);
      newTracks.splice(toIndex, 0, movedTrack);

      const newMultiTrack = { ...multiTrack, tracks: newTracks };
      const newMultiTracks = [...state.multiTracks];
      newMultiTracks[multiTrackIndex] = newMultiTrack;

      return { multiTracks: newMultiTracks };
    }, false);
  },
});