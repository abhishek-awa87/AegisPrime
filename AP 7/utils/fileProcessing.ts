export const MAX_FILE_SIZE_MB = 50;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export const ACCEPTED_MIME_TYPES = {
  image: ['image/jpeg', 'image/png', 'image/webp'],
  audio: ['audio/mpeg', 'audio/wav', 'audio/mp4', 'audio/ogg'],
  video: ['video/mp4', 'video/quicktime', 'video/webm', 'video/x-msvideo'],
  pdf: ['application/pdf'],
};

export const ALL_ACCEPTED_MIME_TYPES = [
    ...ACCEPTED_MIME_TYPES.image,
    ...ACCEPTED_MIME_TYPES.audio,
    ...ACCEPTED_MIME_TYPES.video,
    ...ACCEPTED_MIME_TYPES.pdf
];

export const getFileType = (mimeType: string): 'image' | 'audio' | 'video' | 'pdf' | 'unsupported' => {
    if (ACCEPTED_MIME_TYPES.image.includes(mimeType)) return 'image';
    if (ACCEPTED_MIME_TYPES.audio.includes(mimeType)) return 'audio';
    if (ACCEPTED_MIME_TYPES.video.includes(mimeType)) return 'video';
    if (ACCEPTED_MIME_TYPES.pdf.includes(mimeType)) return 'pdf';
    return 'unsupported';
};


export const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      // The result is "data:mime/type;base64,the-data"
      // We only want "the-data" which is after the first comma.
      const base64String = (reader.result as string).split(',')[1];
      if (base64String) {
        resolve(base64String);
      } else {
        reject(new Error("Failed to convert file to base64."));
      }
    };
    reader.onerror = (error) => reject(error);
  });
};

export const getAudioVideoMetadata = (file: File): Promise<{ duration: number }> => {
  return new Promise((resolve, reject) => {
    const mediaElement = document.createElement(file.type.startsWith('audio') ? 'audio' : 'video');
    mediaElement.preload = 'metadata';
    mediaElement.onloadedmetadata = () => {
      window.URL.revokeObjectURL(mediaElement.src);
      resolve({ duration: mediaElement.duration });
    };
    mediaElement.onerror = () => {
      window.URL.revokeObjectURL(mediaElement.src);
      reject(new Error(`Failed to load metadata for ${file.name}`));
    };
    mediaElement.src = window.URL.createObjectURL(file);
  });
};

export const getPDFMetadata = (file: File): Promise<{ pageCount: number }> => {
    return new Promise((resolve) => {
        // Simulating PDF page count extraction as a full library is too heavy for this task.
        setTimeout(() => {
            const simulatedPageCount = Math.floor(file.size / 15000) + 1; // Rough estimation
            resolve({ pageCount: Math.max(1, simulatedPageCount) });
        }, 200);
    });
};

export const formatDuration = (seconds: number): string => {
  if (isNaN(seconds) || seconds < 0) return '00:00';
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};