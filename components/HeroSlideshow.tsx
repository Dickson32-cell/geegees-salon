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

  // Aggressive video autoplay - works with ALL formats including Supabase videos
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    console.log('🎬 Setting up video playback...');

    const playVideo = () => {
      console.log('▶️ Attempting to play video...');
      video.muted = true;
      video.volume = 0;

      // Multiple play attempts
      const tryPlay = () => {
        video.play()
          .then(() => {
            console.log('✅ SUCCESS! Video is playing!');
          })
          .catch((error) => {
            console.log('⚠️ Autoplay blocked:', error.message);
            console.log('💡 Click anywhere on the page to start video');

            // Retry on any user interaction
            const userInteraction = () => {
              video.play()
                .then(() => console.log('✅ Playing after user interaction'))
                .catch(() => {});
              document.removeEventListener('click', userInteraction);
              document.removeEventListener('touchstart', userInteraction);
            };

            document.addEventListener('click', userInteraction, { once: true });
            document.addEventListener('touchstart', userInteraction, { once: true });
          });
      };

      tryPlay();
      setTimeout(tryPlay, 100);
      setTimeout(tryPlay, 300);
      setTimeout(tryPlay, 500);
    };

    // Wait for video to be ready
    if (video.readyState >= 3) {
      playVideo();
    } else {
      video.addEventListener('loadeddata', playVideo);
      video.addEventListener('canplay', playVideo);
    }

    return () => {
      video.removeEventListener('loadeddata', playVideo);
      video.removeEventListener('canplay', playVideo);
    };
  }, [currentIndex]);

  const fetchImages = async () => {
    try {
      console.log('🔄 Fetching gallery images for category:', category);
      const response = await fetch('/api/gallery');

      if (!response.ok) {
        console.error('❌ API response not OK:', response.status, response.statusText);
        throw new Error(`Failed to fetch images: ${response.status}`);
      }

      const data: GalleryImage[] = await response.json();
      console.log('📦 Total images received from API:', data.length);

      // Filter by category and sort by display_order
      const categoryImages = data
        .filter(img => img.category === category)
        .sort((a, b) => (a.display_order || 0) - (b.display_order || 0));

      console.log('✅ Images for category "' + category + '":', categoryImages.length);
      if (categoryImages.length > 0) {
        console.log('📋 Image URLs:');
        categoryImages.forEach((img, index) => {
          console.log(`   ${index + 1}. ${img.image_url}`);
        });
      } else {
        console.warn('⚠️ No images found for category:', category);
        console.log('💡 Using default fallback image');
      }

      setImages(categoryImages);
    } catch (error) {
      console.error('❌ Error fetching hero images:', error);
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

  console.log('==========================================');
  console.log('🖼️  HERO SLIDESHOW STATUS');
  console.log('==========================================');
  console.log('Category:', category);
  console.log('Total images loaded:', images.length);
  console.log('Current index:', currentIndex);
  console.log('Current media URL:', currentMedia);
  console.log('Is video?', isCurrentMediaVideo);
  console.log('Using fallback?', images.length === 0);
  console.log('==========================================');

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
        // Video Background - Supports ALL video formats including Supabase MP4 files
        <video
          ref={videoRef}
          key={currentMedia}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 z-0 ${fadeClass}`}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          crossOrigin="anonymous"
          onError={(e) => {
            const videoElement = e.currentTarget;
            console.error('❌ VIDEO ERROR:');
            console.error('   URL:', currentMedia);
            console.error('   Error code:', videoElement.error?.code);
            console.error('   Error message:', videoElement.error?.message);
            console.error('   Network state:', videoElement.networkState);
            console.error('   Ready state:', videoElement.readyState);
          }}
          onLoadedMetadata={() => {
            console.log('📹 Video metadata loaded');
            console.log('   Duration:', videoRef.current?.duration, 'seconds');
            console.log('   Dimensions:', videoRef.current?.videoWidth, 'x', videoRef.current?.videoHeight);
          }}
          onLoadedData={() => {
            console.log('✅ Video data loaded successfully');
            console.log('   URL:', currentMedia);
          }}
          onPlaying={() => {
            console.log('🎥 Video is now PLAYING!');
          }}
          onPause={() => {
            console.log('⏸️ Video paused - attempting to resume...');
            videoRef.current?.play().catch(() => {});
          }}
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
