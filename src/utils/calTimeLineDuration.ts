export const calTimeLineDuration = (container: HTMLElement): number => {
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