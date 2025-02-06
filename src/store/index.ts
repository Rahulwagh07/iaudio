import { create } from 'zustand';
import { MultiTrackState } from '../types';

import { createWavesurferSlice } from './slices/wavesurferSlice';
import { createVolumeSlice } from './slices/volumeSlice';
import { createTrackSlice } from './slices/trackSlice';
import { createPlayerSlice } from './slices/playerSlice';
import { createMultiTrackSlice } from './slices/multiTrackSlice';

const useMultiTrackStore = create<MultiTrackState>((...a) => ({
  multiTracks: [],
  activeMultiTrackId: null,
  volume: 1,
  ...createWavesurferSlice(...a),
  ...createVolumeSlice(...a),
  ...createTrackSlice(...a),
  ...createPlayerSlice(...a),
  ...createMultiTrackSlice(...a),
}));

export default useMultiTrackStore;