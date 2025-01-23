import { create } from 'zustand'
import { AudioStore } from '../types'
import { nanoid } from 'nanoid';

const useAudioStore = create<AudioStore>((set, get) => ({
  tracks: [],
  currentTime: 0,
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

  addPill: (trackId, file) => {
    const newPill = {
      id: nanoid(),
      file,
      url: URL.createObjectURL(file),
      startTime: 0,
      duration: 0,
      name: file.name
    };

    set(state => ({
      tracks: state.tracks.map(track =>
        track.id === trackId
          ? {
            ...track,
            pills: [...track.pills, newPill]
          }
          : track
      )
    }));

    return newPill;
  },

  setWaveSurfer: (trackId, wavesurfer) => set(state => ({
    tracks: state.tracks.map(track =>
      track.id === trackId
        ? { ...track, wavesurfer: wavesurfer || undefined }
        : track
    )
  })),

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

  setCurrentTime: (time: number) => set({ currentTime: time }),

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
  })
}))

export default useAudioStore