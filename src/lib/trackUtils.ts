import type MultiTrack from 'wavesurfer-multitrack'
import type WaveSurfer from 'wavesurfer.js'
import { makeDraggable } from 'wavesurfer.js/dist/draggable.js'
import { SVG_STRINGS } from '../assets/svg/svgStrings';


declare module 'wavesurfer-multitrack' {
  export interface MultiTrack {
    on(event: 'reorder-track', callback: (data: { fromIndex: number; toIndex: number }) => void): void;
    on(event: 'remove-track', callback: (data: { id: string }) => void): void;
    emit(event: 'reorder-track', data: { fromIndex: number; toIndex: number }): void;
    emit(event: 'remove-track', data: { id: string }): void;
  }
}

type InternalMultiTrackStructure = {
  rendering: {
    containers: HTMLElement[];
    wrapper: HTMLElement;
  };
  tracks: Array<{
    id: string;
  }>;
  audios: AudioBuffer[];
  wavesurfers: WaveSurfer[];
  envelopes: EnvelopePoint[][];
  subscriptions: Array<() => void>;
  emit(event: string, data: unknown): void;
}

interface EnvelopePoint {
  time: number;
  value: number;
}

export function initVerticalDragging(multitrack: MultiTrack) {
  const mt = multitrack as unknown as InternalMultiTrackStructure;
  const containers = mt.rendering.containers;
  const wrapper = containers[0]?.parentElement;
  if (!wrapper) return;

  const tracks = mt.tracks;

  tracks.forEach((track, index) => {
    if (track.id === 'placeholder') return;

    const container = containers[index];
    if (!container) return;

    const dragHandle = document.createElement('div');
    dragHandle.innerHTML = SVG_STRINGS.drag;
    dragHandle.classList.add('drag-handle');

    const deleteButton = document.createElement('div');
    deleteButton.innerHTML = SVG_STRINGS.delete;
    deleteButton.classList.add('delete-button');

    container.addEventListener('mouseenter', () => {
      dragHandle.style.opacity = '1';
      dragHandle.style.pointerEvents = 'auto';
      deleteButton.style.opacity = '1';
      deleteButton.style.pointerEvents = 'auto';
    });
    container.addEventListener('mouseleave', () => {
      if (!isDragging) {
        dragHandle.style.opacity = '0';
        dragHandle.style.pointerEvents = 'none';
        deleteButton.style.opacity = '0';
        deleteButton.style.pointerEvents = 'none';
      }
    });

    deleteButton.addEventListener('click', () => {
      const track = tracks[index];
      if (!track) return;

      const wavesurfer = mt.wavesurfers[index];
      if (wavesurfer) {
        wavesurfer.destroy();
      }

      // Remove from internal arrays
      tracks.splice(index, 1);
      mt.audios.splice(index, 1);
      mt.wavesurfers.splice(index, 1);
      if (mt.envelopes[index]) {
        mt.envelopes.splice(index, 1);
      }

      //remove from the dom
      container.remove();

      mt.emit('remove-track', { id: track.id });
    });

    container.appendChild(dragHandle);
    container.appendChild(deleteButton);

    let isDragging = false;
    let startIndex = index;
    let currentIndex = index;
    let totalDy = 0;
    let startLeft = 0;   

    const unsubscribe = makeDraggable(
      dragHandle,
      (_: number, dy: number) => {
        if (!isDragging) return;

        totalDy += dy;
        const containerHeight = container.offsetHeight;

        container.style.transition = 'none';
        container.style.left = `${startLeft}px`;
        container.style.transform = `translateY(${totalDy}px)`;
        container.style.zIndex = '1000';

        const rawNewIndex = Math.round(totalDy / containerHeight) + startIndex;
        const boundedIndex = Math.max(0, Math.min(rawNewIndex, tracks.length - 2));

        if (boundedIndex !== currentIndex && !isNaN(boundedIndex)) {
          containers.forEach((otherContainer: HTMLElement, i: number) => {
            if (!otherContainer || i === startIndex) return;

            if (boundedIndex > startIndex) {
              if (i > startIndex && i <= boundedIndex) {
                otherContainer.style.transform = `translateY(${-containerHeight}px)`;
              } else {
                otherContainer.style.transform = '';
              }
            } else if (boundedIndex < startIndex) {
              if (i < startIndex && i >= boundedIndex) {
                otherContainer.style.transform = `translateY(${containerHeight}px)`;
              } else {
                otherContainer.style.transform = '';
              }
            }
          });

          currentIndex = boundedIndex;
        }
      },
      () => {
        isDragging = true;
        dragHandle.style.cursor = 'grabbing';
        container.style.zIndex = '1000';
        const rect = container.getBoundingClientRect();
        startLeft = rect.left - (container.offsetParent?.getBoundingClientRect().left || 0);
        container.style.position = 'relative';
        container.style.left = `${startLeft}px`;

        totalDy = 0;
        startIndex = index;
        currentIndex = index;
      },
      () => {
        isDragging = false;
        dragHandle.style.cursor = 'move';
        container.style.zIndex = '';

        if (currentIndex !== startIndex && !isNaN(currentIndex)) {
          const [movedTrack] = tracks.splice(startIndex, 1);
          tracks.splice(currentIndex, 0, movedTrack);

          const [movedAudio] = mt.audios.splice(startIndex, 1);
          mt.audios.splice(currentIndex, 0, movedAudio);

          const [movedWavesurfer] = mt.wavesurfers.splice(startIndex, 1);
          mt.wavesurfers.splice(currentIndex, 0, movedWavesurfer);

          if (mt.envelopes[startIndex]) {
            const [movedEnvelope] = mt.envelopes.splice(startIndex, 1);
            mt.envelopes.splice(currentIndex, 0, movedEnvelope);
          }

          const parent = container.parentElement;
          if (parent) {
            if (currentIndex > startIndex) {
              const referenceNode = parent.children[currentIndex + 1] || null;
              parent.insertBefore(container, referenceNode);
            } else {
              const referenceNode = parent.children[currentIndex];
              parent.insertBefore(container, referenceNode);
            }
          }

          mt.emit('reorder-track', { fromIndex: startIndex, toIndex: currentIndex });
        }

        // Reset styles
        requestAnimationFrame(() => {
          containers.forEach((cont: HTMLElement) => {
            if (cont) {
              cont.style.transition = 'transform 0.15s ease';
              cont.style.transform = '';
              cont.style.zIndex = '';
            }
          });
        });

        totalDy = 0;
        startIndex = index;
        currentIndex = index;
      }
    );

    mt.subscriptions.push(unsubscribe);
  });
}

export const getTotalDuration = (container: HTMLElement): number => {
  const timelineWrapper = container.querySelector('div[part="timeline-wrapper"] > div') as HTMLElement;
  const lastTimeMarker = timelineWrapper?.lastElementChild as HTMLElement;
  const totalDuration = parseTimelineTime(lastTimeMarker?.textContent || '0');
  return totalDuration;
};

const parseTimelineTime = (timeStr: string): number => {
  if (!timeStr) return 0;
  if (timeStr.includes(':')) {
    const [mins, secs] = timeStr.split(':').map(Number);
    return mins * 60 + (secs || 0);
  }
  return Number(timeStr) || 0;
};

