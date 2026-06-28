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
  const videoRef = useRef<HTMLVideoElement>(null);

  // Helper function to check if URL is a video - ALL FORMATS SUPPORTED
  const isVideo = (url: string): boolean => {
    if (!url) return false;
    const urlWithoutParams = url.split('?')[0].toLowerCase();

    // Support ALL video and audio formats
    const mediaExtensions = [
      '.mp4', '.webm', '.ogg', '.mov', '.avi', '.m4v', '.mkv', '.flv', '.wmv',
      '.mp3', '.wav', '.m4a', '.aac', '.flac', '.wma', '.opus'
    ];

    const isMediaFile = mediaExtensions.some(ext => urlWithoutParams.endsWith(ext)) ||
                        urlWithoutParams.includes('video') ||
                        urlWithoutParams.includes('/videos/');

    console.log('🎥 Checking:', url, '→', isMediaFile);
    return isMediaFile;
  };

  useEffect(() => {
    fetchImages();
  }, [category]);

  // Simple slideshow - change media every 5 seconds
  useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      setFadeClass('opacity-0');
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
        setFadeClass('opacity-100');
      }, 500);
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length]);

  // Simple video autoplay - works with ALL formats
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const playVideo = () => {
      video.muted = true;
      video.play().catch(() => {
        // If autoplay fails, try again after user interaction
        document.addEventListener('click', () => {
          video.play().catch(() => {});
        }, { once: true });
      });
    };

    playVideo();
  }, [currentIndex]);

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

  console.log('🎬 Media:', currentMedia, '| Video?', isCurrentMediaVideo);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Background Media (Video or Image) with Fade Transition */}
      {isCurrentMediaVideo ? (
        // Video Background - Supports ALL video formats (MP4, WebM, OGG, MOV, AVI, etc.)
        <video
          ref={videoRef}
          key={currentMedia}
          src={currentMedia}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 z-0 ${fadeClass}`}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          onError={(e) => {
            console.error('❌ Video error:', e);
            console.error('Failed video URL:', currentMedia);
          }}
          onLoadedData={() => {
            console.log('✅ Video loaded successfully');
            videoRef.current?.play().catch(err => console.log('Play error:', err));
          }}
        />
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
