import { create } from 'zustand'
import { AudioStore, PlayMode } from '../types'
import { nanoid } from 'nanoid';
import { getAudioDuration } from '../lib/fileUpload';

const useAudioStore = create<AudioStore>((set, get) => ({
  tracks: [],
  isPlaying: false,
  activeTrackId: null,
  hasTrackFinished: false,
  volume: 1,
  playMode: "None" as PlayMode,
  isExporting: false,

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

  addPills: async (trackId: string, files: File[]) => {
    try {
      const newPills = await Promise.all(
        files.map(async (file) => {
          const duration = await getAudioDuration(file);
          return {
            id: nanoid(),
            file,
            url: URL.createObjectURL(file),
            startTime: 0,
            duration,
            name: file.name
          };
        })
      );
  
      set(state => ({
        tracks: state.tracks.map(track => {
          if (track.id === trackId) {
            return {
              ...track,
              pills: [...track.pills, ...newPills]
            };
          }
          return track;
        })
      }));
    } catch (error) {
      console.log('error adding pills with duration:', error);
    }
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

  setVolume: (volume: number) => {
    set({ volume: volume });
    const state = get();
    state.tracks.forEach((track) => {
      if (track.wavesurfer) {
        track.pills.forEach((_, index) => {
          track.wavesurfer?.setTrackVolume(index, volume);
        });
      }
    });
  },

  setPlayMode: (mode: "None" | "All" | "Individual") => {
    set({ playMode: mode });
  },

  setIsExporting: (isExporting: boolean) => set({ isExporting }),

  updatePillStartTime: (trackId: string, pillId: string, startTime: number) => {
    const state = get();
    const track = state.tracks.find(t => t.id === trackId);
    if (track) {
      const pill = track.pills.find(p => p.id === pillId);
      if (pill) {
        pill.startTime = startTime; // Direct mutation without rerender
      }
    }
  },
}))

export default useAudioStore