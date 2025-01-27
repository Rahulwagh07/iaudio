<div align="center">

# iAudio - Multi-Track Audio Compositions

An interactive multi-track audio timeline player built with React and wavesurfer.js, upload audio files and create dynamic audio compositions through intuitive drag-and-drop interfaces and real-time playback controls.

</div>

## Table of Contents
- [Features](#features) 
- [Installation](#installation) 
- [Tech Stack](#tech-stack) 
- [Future Enhancements](#future-enhancements) 
- [Contributing](#contributing) 

## Features

- 🎹 Create multiple audio tracks
- 🎵 Drag-and-drop file support
- 🎚️ Individual track controls
- 🎯 Drag-and-drop audio positioning
- 📊 Visual waveform representation
- 🔄 Real-time track reordering
- ▶️ Individual track playback
- ⏯️ Global play/pause functionality
- 🔊 Master volume control
- 🎼 Synchronized multi-track playback
 

## Installation

1. Clone the repository:

```bash
git clone https://github.com/Rahulwagh07/iaudio.git
cd iaudio
```

2. Install dependencies:

```bash
pnpm install
```

3. Start the development server:

```bash
pnpm dev
```

4. Build for production:

```bash
# Create optimized production build
pnpm build

# Preview production build locally
pnpm preview
```

## Tech Stack
 
- [React](https://react.dev/) with [TypeScript](https://www.typescriptlang.org/)
- [Zustand](https://github.com/pmndrs/zustand) for state management
- [WaveSurfer.js](https://wavesurfer-js.org/) for audio visualization
- [FFmpeg](https://github.com/ffmpegwasm/ffmpeg.wasm) for audio processing
- [React DnD](https://react-dnd.github.io/react-dnd/) for drag-and-drop functionality
- [TailwindCSS](https://tailwindcss.com/) for styling
- [wavesurfer-multitrack](https://wavesurfer-multitrack.pages.dev/docs/) for multi-track support
 

## Architecture  

### State Management
- Centralized state using Zustand
- Immutable state updates
- Action-based state modifications

### Component Structure
```
src/
├── components/        # React components
├── lib/               # Utility functions and services
├── store/             # State management
├── hooks/             # Custom React hooks
├── types/             # TypeScript definitions
└── styles/            # CSS styles
```

 
## Future Enhancements

1. **Audio Effects** 
   - Real-time audio effects processing
   - Volume control for individual audio within tracks

2. **Enhanced Multi-track Wavesurfer Plugin** 
   - Implement custom multitrack Wavesurfer plugin with extended features
   - Extend plugin to support track reordering

3. **Performance Optimizations** 
   - Web Worker implementation
   - Audio streaming support
   - Lazy loading improvements
 
---

<div align="center">

### 🎵 Transform Your Audio Ideas Into Reality 🎵

Give this repo a ⭐ and start mixing your next masterpiece!

</div>

 
