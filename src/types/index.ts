import MultiTrack from 'wavesurfer-multitrack'

export interface AudioPill {
  id: string;
  file: File;
  url: string;
  startTime: number;
  name: string;
}

export interface AudioTrack {
  id: string;
  pills: AudioPill[];
  name: string;
  wavesurfer?: MultiTrack;
}

export interface AudioStore {
  tracks: AudioTrack[]
  isPlaying: boolean
  activeTrackId: string | null
  addTrack: () => string
  addPills: (trackId: string, files: File[]) => void
  setWaveSurfer: (trackId: string, wavesurfer: MultiTrack | null) => void
  playTrack: (trackId: string) => void
  pauseTrack: (trackId: string) => void
  deleteTrack: (trackId: string) => void
  isTrackPlaying: (trackId: string) => boolean
  reorderPills: (trackId: string, fromIndex: number, toIndex: number) => void
  removePill: (trackId: string, pillId: string) => void
}