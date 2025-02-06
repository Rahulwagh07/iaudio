import MultiTrack from 'wavesurfer-multitrack'

export interface Track {
  id: string;
  file: File;
  url: string;
  startTime: number;
  name: string;
  duration: number;
}

export interface CustomMultiTrack {
  id: string;
  tracks: Track[];
  name: string;
  wavesurfer?: MultiTrack;
}

export interface MultiTrackState {
  multiTracks: CustomMultiTrack[]
  activeMultiTrackId: string | null
  volume: number
  setVolume: (volume: number) => void
  addMultiTrack: () => string
  addTracks: (multiTrackId: string, files: File[]) => Promise<void>
  setWaveSurfer: (multiTrackId: string, wavesurfer: MultiTrack | null) => void
  playMultiTrack: (multiTrackId: string) => void
  pauseMultiTrack: (multiTrackId: string) => void
  deleteMultiTrack: (multiTrackId: string) => void
  reorderTracks: (multiTrackId: string, fromIndex: number, toIndex: number) => void
  removeTrack: (multiTrackId: string, trackId: string) => void
  updateTrackStartTime: (multiTrackId: string, trackId: string, startTime: number) => void
}

