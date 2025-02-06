export const calAudioDuration = (file: File): Promise<number> => {
  return new Promise((resolve, reject) => {
    const audio = new Audio();
    const objectUrl = URL.createObjectURL(file);

    const cleanup = () => {
      URL.revokeObjectURL(objectUrl);
      audio.remove();
    };

    audio.addEventListener('loadedmetadata', () => {
      const duration = audio.duration;
      cleanup();
      resolve(duration);
    });

    audio.addEventListener('error', (error) => {
      cleanup();
      reject(new Error(`Error loading audio file: ${error.message}`));
    });

    audio.src = objectUrl;
  });
};