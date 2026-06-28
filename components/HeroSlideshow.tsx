"use client";

import { useState, useEffect, useRef } from 'react';

interface HeroSlideshowProps {
  category: 'hero-home' | 'hero-services';
  children: React.ReactNode;
  className?: string;
}

interface GalleryImage {
  id: number;
  title: string | null;
  image_url: string;
  category: string | null;
  description: string | null;
  display_order: number | null;
}

export default function HeroSlideshow({ category, children, className = "" }: HeroSlideshowProps) {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [fadeClass, setFadeClass] = useState('opacity-100');
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Helper function to check if URL is a video (supports MP4, MP3, and other video formats)
  const isVideo = (url: string): boolean => {
    if (!url) return false;
    // Remove query parameters to check the actual file extension
    const urlWithoutParams = url.split('?')[0];
    const lowerUrl = urlWithoutParams.toLowerCase();

    // Check for video and audio extensions
    const videoExtensions = ['.mp4', '.webm', '.mov', '.avi', '.ogg', '.m4v', '.mp3', '.wav', '.m4a'];
    const hasVideoExtension = videoExtensions.some(ext => lowerUrl.endsWith(ext));

    // Also check if URL path contains 'video' or common video MIME types
    const hasVideoInPath = lowerUrl.includes('video') || lowerUrl.includes('/videos/');

    const isVideoFile = hasVideoExtension || hasVideoInPath;
    console.log('🎥 Video detection for:', url, '| Is Video:', isVideoFile);
    return isVideoFile;
  };

  useEffect(() => {
    fetchImages();
  }, [category]);

  useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      setFadeClass('opacity-0');

      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
        setFadeClass('opacity-100');
      }, 500); // Half of transition duration
    }, 5000); // Change image/video every 5 seconds

    return () => clearInterval(interval);
  }, [images.length]);

  // Force video to play - multiple aggressive attempts
  const forcePlayVideo = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.volume = 0;
    video.setAttribute('muted', 'true');
    video.setAttribute('playsinline', 'true');

    const attemptPlay = () => {
      video.play()
        .then(() => {
          console.log('✅ Video is now playing!');
          setIsPlaying(true);
        })
        .catch(err => {
          console.log('⚠️ Video autoplay prevented:', err);
          setIsPlaying(false);
        });
    };

    attemptPlay();
    // Retry multiple times
    setTimeout(attemptPlay, 100);
    setTimeout(attemptPlay, 500);
    setTimeout(attemptPlay, 1000);
  };

  // Auto-play video when it becomes visible or loads
  useEffect(() => {
    const video = videoRef.current;
    if (!video || images.length === 0) return;

    // Calculate current media URL
    const mediaUrl = images[currentIndex]?.image_url;
    if (!mediaUrl || !isVideo(mediaUrl)) return;

    console.log('🎬 Attempting to play video:', mediaUrl);

    video.addEventListener('loadeddata', forcePlayVideo);
    video.addEventListener('canplay', forcePlayVideo);
    video.addEventListener('canplaythrough', forcePlayVideo);

    // Also try immediately
    if (video.readyState >= 2) {
      forcePlayVideo();
    }

    return () => {
      video.removeEventListener('loadeddata', forcePlayVideo);
      video.removeEventListener('canplay', forcePlayVideo);
      video.removeEventListener('canplaythrough', forcePlayVideo);
    };
  }, [currentIndex, images]);

  // Use Intersection Observer to play when visible
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            forcePlayVideo();
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(container);

    return () => observer.disconnect();
  }, [images, currentIndex]);

  const fetchImages = async () => {
    try {
      const response = await fetch('/api/gallery');
      if (!response.ok) throw new Error('Failed to fetch images');
      const data: GalleryImage[] = await response.json();

      // Filter by category and sort by display_order
      const categoryImages = data
        .filter(img => img.category === category)
        .sort((a, b) => (a.display_order || 0) - (b.display_order || 0));

      console.log('📸 Fetched images for category:', category, '| Count:', categoryImages.length);
      console.log('📋 Images:', categoryImages.map(img => ({ url: img.image_url, category: img.category })));

      setImages(categoryImages);
    } catch (error) {
      console.error('Error fetching hero images:', error);
      // Fall back to default image if fetch fails
      setImages([]);
    } finally {
      setLoading(false);
    }
  };

  // Default fallback image if no media uploaded
  const defaultImage = category === 'hero-home'
    ? 'https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=2574'
    : 'https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=2669';

  const currentMedia = images.length > 0 ? images[currentIndex].image_url : defaultImage;
  const isCurrentMediaVideo = currentMedia && isVideo(currentMedia);

  console.log('🎬 Current media:', currentMedia, '| Is video:', isCurrentMediaVideo, '| Index:', currentIndex);

  // Handle click to play video if autoplay failed
  const handleClick = () => {
    if (isCurrentMediaVideo && !isPlaying) {
      forcePlayVideo();
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      onClick={handleClick}
    >
      {/* Background Media (Video or Image) with Fade Transition */}
      {isCurrentMediaVideo ? (
        // Video Background - Autoplays MP4, MP3 and other video formats
        <video
          ref={videoRef}
          key={currentMedia} // Force re-mount when video changes
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 z-0 ${fadeClass}`}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          controls={false}
          onLoadedMetadata={forcePlayVideo}
          onCanPlay={forcePlayVideo}
          onCanPlayThrough={forcePlayVideo}
          onPlay={() => {
            console.log('🎥 Video started playing');
            setIsPlaying(true);
          }}
          onPause={() => {
            console.log('⏸️ Video paused');
            setIsPlaying(false);
            // Auto-resume if paused
            setTimeout(forcePlayVideo, 100);
          }}
          onSuspend={forcePlayVideo}
          onWaiting={forcePlayVideo}
        >
          <source src={currentMedia} type="video/mp4" />
          <source src={currentMedia} type="video/webm" />
          <source src={currentMedia} type="video/ogg" />
          Your browser does not support the video tag.
        </video>
      ) : (
        // Image Background
        <div
          className={`absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-1000 z-0 ${fadeClass}`}
          style={{
            backgroundImage: `url('${currentMedia}')`,
          }}
        />
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-primary/40 z-10"></div>

      {/* Play button overlay if video not playing */}
      {isCurrentMediaVideo && !isPlaying && (
        <button
          onClick={forcePlayVideo}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-15 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-6 transition-all group"
          aria-label="Play video"
        >
          <svg className="w-12 h-12 text-white group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20">
            <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
          </svg>
        </button>
      )}

      {/* Content */}
      <div className="relative z-20">
        {children}
      </div>

      {/* Indicators */}
      {images.length > 1 && (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-30 flex gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex
                  ? 'bg-white w-8'
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
