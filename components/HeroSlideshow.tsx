"use client";

import { useState, useEffect, useRef } from "react";
import { isVideoUrl } from "@/lib/media";
import { isInAppBrowserCached } from "@/lib/inAppBrowser";

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
  const [inAppBrowser, setInAppBrowser] = useState(false);
  const [userStartedPlayback, setUserStartedPlayback] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setInAppBrowser(isInAppBrowserCached());
  }, []);

  useEffect(() => {
    fetchImages();
  }, [category]);

  // Simple slideshow - change media every 5 seconds (disabled in in-app until user starts)
  useEffect(() => {
    if (images.length <= 1) return;
    if (inAppBrowser && !userStartedPlayback) return;

    const interval = setInterval(() => {
      setFadeClass('opacity-0');
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
        setFadeClass('opacity-100');
      }, 500);
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length, inAppBrowser, userStartedPlayback]);

  // Video autoplay — only in normal browser, or after user taps in in-app browser
  useEffect(() => {
    if (inAppBrowser && !userStartedPlayback) return;

    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.volume = 0;

    video.play().catch(() => {
      // Autoplay was blocked — in normal browser, retry on user interaction
      if (inAppBrowser) return;

      const userInteraction = () => {
        video.play().catch(() => {});
        document.removeEventListener('click', userInteraction);
        document.removeEventListener('touchstart', userInteraction);
      };

      document.addEventListener('click', userInteraction, { once: true });
      document.addEventListener('touchstart', userInteraction, { once: true });
    });
  }, [currentIndex, inAppBrowser, userStartedPlayback]);

  const handleStartPlayback = () => {
    setUserStartedPlayback(true);
    const video = videoRef.current;
    if (video) {
      video.muted = true;
      video.volume = 0;
      video.play().catch(() => {});
    }
  };

  const fetchImages = async () => {
    try {
      const response = await fetch('/api/gallery');

      if (!response.ok) {
        throw new Error(`Failed to fetch images: ${response.status}`);
      }

      const data: GalleryImage[] = await response.json();

      // Filter by category and sort by display_order
      const categoryImages = data
        .filter(img => img.category === category)
        .sort((a, b) => (a.display_order || 0) - (b.display_order || 0));

      setImages(categoryImages);
    } catch (error) {
      console.error('Error fetching hero images:', error);
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
  const isCurrentMediaVideo = isVideoUrl(currentMedia);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Loading indicator */}
      {loading && (
        <div className="absolute top-4 right-4 z-50 bg-white/10 backdrop-blur-sm px-3 py-2 rounded text-white text-sm">
          Loading media...
        </div>
      )}

      {/* Background Media (Video or Image) with Fade Transition */}
      {isCurrentMediaVideo ? (
        <video
          ref={videoRef}
          key={currentMedia}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 z-0 ${fadeClass}`}
          loop
          muted
          playsInline
          preload={inAppBrowser ? "metadata" : "auto"}
          onError={(e) => {
            const videoElement = e.currentTarget;
            console.error('VIDEO ERROR:', videoElement.error?.code, videoElement.error?.message);
          }}
        >
          <source src={currentMedia} />
          Your browser does not support the video tag.
        </video>
      ) : (
        <div
          className={`absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-1000 z-0 ${fadeClass}`}
          style={{
            backgroundImage: `url('${currentMedia}')`,
          }}
        />
      )}

      {/* Tap-to-play overlay (in-app browser only) */}
      {inAppBrowser && !userStartedPlayback && isCurrentMediaVideo && (
        <button
          onClick={handleStartPlayback}
          className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-primary/40 cursor-pointer"
          aria-label="Tap to play video"
        >
          <div className="w-16 h-16 rounded-full bg-secondary/90 flex items-center justify-center mb-3 shadow-lg">
            <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
          <span className="text-white text-sm font-label-caps uppercase tracking-widest">Tap to Play</span>
        </button>
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