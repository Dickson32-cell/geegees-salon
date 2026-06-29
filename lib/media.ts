/**
 * Robust check to determine if a URL points to a video file
 */
export const isVideoUrl = (url: string | null | undefined): boolean => {
  if (!url) return false;
  
  // Remove query parameters
  const urlWithoutParams = url.split('?')[0].toLowerCase();

  // Comprehensive list of video and audio extensions
  const mediaExtensions = [
    '.mp4', '.webm', '.ogg', '.mov', '.avi', '.m4v', '.mkv', '.flv', '.wmv',
    '.mp3', '.wav', '.m4a', '.aac', '.flac', '.wma', '.opus'
  ];

  return mediaExtensions.some(ext => urlWithoutParams.endsWith(ext)) ||
         urlWithoutParams.includes('video') ||
         urlWithoutParams.includes('/videos/') ||
         urlWithoutParams.includes('/storage/v1/object/public/'); // Common for Supabase storage objects that might be videos
};
