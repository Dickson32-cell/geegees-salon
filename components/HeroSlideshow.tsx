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

  // Helper function to check if URL is a video
  const isVideo = (url: string): boolean => {
    const videoExtensions = ['.mp4', '.webm', '.mov', '.avi', '.ogg', '.m4v'];
    return videoExtensions.some(ext => url.toLowerCase().includes(ext));
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

  // Auto-play video when it becomes visible or loads
  useEffect(() => {
    const video = videoRef.current;
    if (!video || images.length === 0) return;

    // Calculate current media URL
    const mediaUrl = images[currentIndex]?.image_url;
    if (!mediaUrl || !isVideo(mediaUrl)) return;

    const playVideo = () => {
      video.play().catch(err => {
        console.log('Video autoplay prevented:', err);
      });
    };

    // Play immediately if video is ready
    if (video.readyState >= 2) {
      playVideo();
    } else {
      // Wait for video to load enough data before playing
      video.addEventListener('loadeddata', playVideo);
    }

    return () => {
      video.removeEventListener('loadeddata', playVideo);
    };
  }, [currentIndex, images]);

  const fetchImages = async () => {
    try {
      const response = await fetch('/api/gallery');
      if (!response.ok) throw new Error('Failed to fetch images');
      const data: GalleryImage[] = await response.json();

      // Filter by category and sort by display_order
      const categoryImages = data
        .filter(img => img.category === category)
        .sort((a, b) => (a.display_order || 0) - (b.display_order || 0));

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

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Background Media (Video or Image) with Fade Transition */}
      {isCurrentMediaVideo ? (
        // Video Background
        <video
          ref={videoRef}
          key={currentMedia} // Force re-mount when video changes
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 z-0 ${fadeClass}`}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
        >
          <source src={currentMedia} type="video/mp4" />
          <source src={currentMedia} type="video/webm" />
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
