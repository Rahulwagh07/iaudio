import MultiTrack from 'wavesurfer-multitrack'

export interface AudioPill {
  id: string;
  file: File;
  url: string;
  startTime: number;
  name: string;
  duration: number;
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
  volume: number
  playMode: PlayMode
  isExporting: boolean
  setVolume: (volume: number) => void
  addTrack: () => string
  addPills: (trackId: string, files: File[]) => void
  setWaveSurfer: (trackId: string, wavesurfer: MultiTrack | null) => void
  playTrack: (trackId: string) => void
  pauseTrack: (trackId: string) => void
  deleteTrack: (trackId: string) => void
  reorderPills: (trackId: string, fromIndex: number, toIndex: number) => void
  removePill: (trackId: string, pillId: string) => void
  setPlayMode: (mode: "All" | "Individual" | "None") => void
  setIsExporting: (isExporting: boolean) => void
  updatePillStartTime: (trackId: string, pillId: string, startTime: number) => void
}

export type PlayMode = "All" | "Individual" | "None"

export interface AudioExportProgress {
  status: 'preparing' | 'mixing' | 'encoding' | 'downloading' | 'complete' | 'error';
  progress: number;
}

export interface AudioExportStore {
  isExporting: boolean
  exportProgress: AudioExportProgress
  setIsExporting: (isExporting: boolean) => void
  setExportProgress: (progress: AudioExportProgress) => void
}
