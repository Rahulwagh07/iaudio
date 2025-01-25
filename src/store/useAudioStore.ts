import { create } from 'zustand'
import { AudioStore } from '../types'
import { nanoid } from 'nanoid';

const useAudioStore = create<AudioStore>((set, get) => ({
  tracks: [],
  isPlaying: false,
  activeTrackId: null,
  hasTrackFinished: false,

  addTrack: () => {
    const newTrackId = nanoid();
    set(state => ({
      tracks: [
        ...state.tracks,
        {
          id: newTrackId,
          name: `Track ${state.tracks.length + 1}`,
          pills: [],
          clips: []
        }
      ]
    }));
    return newTrackId;
  },

  addPills: (trackId: string, files: File[]) => {
    set(state => {
      const newPills = files.map((file) => ({
        id: nanoid(),
        file,
        url: URL.createObjectURL(file),
        startTime: 0,
        duration: 0,
        name: file.name
      }));

      return {
        tracks: state.tracks.map(track => {
          if (track.id === trackId) {
            return {
              ...track,
              pills: [...track.pills, ...newPills]
            };
          }
          return track;
        })
      };
    });
  },
 

  setWaveSurfer: (trackId, wavesurfer) => {
    set(state => {
      const trackIndex = state.tracks.findIndex(t => t.id === trackId);
      if (trackIndex === -1) return state;

      if (state.tracks[trackIndex].wavesurfer === wavesurfer) return state;

      if (state.tracks[trackIndex].wavesurfer && state.tracks[trackIndex].wavesurfer !== wavesurfer) {
        state.tracks[trackIndex].wavesurfer.destroy();
      }

      const newTracks = [...state.tracks];
      newTracks[trackIndex] = {
        ...newTracks[trackIndex],
        wavesurfer: wavesurfer || undefined
      };

      return { tracks: newTracks };
    }, false);
  },

  playTrack: (trackId: string) => {
    const state = get();
    const track = state.tracks.find(t => t.id === trackId);

    if (track?.wavesurfer) {
      if (state.activeTrackId === trackId && track.wavesurfer.isPlaying()) {
        track.wavesurfer.pause();
        set({ isPlaying: false, activeTrackId: null });
      } else {
        state.tracks.forEach(t => {
          if (t.id !== trackId) {
            t.wavesurfer?.pause();
          }
        });

        track.wavesurfer?.play();
        set({ isPlaying: true, activeTrackId: trackId });
      }
    }
  },

  pauseTrack: (trackId: string) => {
    const state = get();
    const track = state.tracks.find(t => t.id === trackId);
    if (track?.wavesurfer) {
      track.wavesurfer.pause();
      set({ isPlaying: false, activeTrackId: null });
    }
  },

  isTrackPlaying: (trackId: string) => {
    const state = get();
    return state.activeTrackId === trackId;
  },

  deleteTrack: (trackId: string) => set(state => {
    const filteredTracks = state.tracks.filter(t => t.id !== trackId);
    const updatedTracks = filteredTracks.map((track, index) => ({
      ...track,
      name: `Track ${index + 1}`
    }));

    const newState: Partial<AudioStore> = { tracks: updatedTracks };
    if (state.activeTrackId === trackId) {
      newState.activeTrackId = null;
      newState.isPlaying = false;
    }

    return newState;
  }),

  reorderPills: (trackId: string, fromIndex: number, toIndex: number) => {
    console.log('Store reorderPills called:', { trackId, fromIndex, toIndex });
    
    set(state => {
      const trackIndex = state.tracks.findIndex(t => t.id === trackId);
      if (trackIndex === -1) return state;

      const track = state.tracks[trackIndex];
      const newPills = [...track.pills];
      const [movedPill] = newPills.splice(fromIndex, 1);
      newPills.splice(toIndex, 0, movedPill);

      const newTrack = { ...track, pills: newPills };
      const newTracks = [...state.tracks];
      newTracks[trackIndex] = newTrack;

      return {
        ...state,
        tracks: newTracks
      };
    }, false);
  },

  removePill: (trackId: string, pillId: string) => {
    set(state => ({
      tracks: state.tracks.map(track => {
        if (track.id === trackId) {
          return {
            ...track,
            pills: track.pills.filter(pill => pill.id !== pillId)
          };
        }
        return track;
      })
    }));
  },

  reorderTracks: (fromIndex: number, toIndex: number) => {
    set(state => {
      const newTracks = [...state.tracks];
      const [movedTrack] = newTracks.splice(fromIndex, 1);
      newTracks.splice(toIndex, 0, movedTrack);

      return {
        tracks: newTracks.map((track, index) => ({
          ...track,
          name: `Track ${index + 1}`
        }))
      };
    }, false);
  },
}))

export default useAudioStore