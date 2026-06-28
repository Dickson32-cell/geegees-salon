"use client";

import { useState, useEffect, useRef } from 'react';

interface GalleryVideo {
  id: number;
  image_url: string;
  title: string | null;
}

interface VideoSlideshowProps {
  category?: string; // Filter by category, defaults to "home-showcase"
  interval?: number; // Time per video in milliseconds, defaults to 8000
}

export default function VideoSlideshow({
  category = "home-showcase",
  interval = 8000
}: VideoSlideshowProps) {
  const [videos, setVideos] = useState<GalleryVideo[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    fetchVideos();
  }, [category]);

  const fetchVideos = async () => {
    try {
      const response = await fetch('/api/gallery');
      if (!response.ok) return;

      const data = await response.json();
      // Filter for videos in the specified category
      const categoryVideos = data.filter((item: GalleryVideo) =>
        item.image_url &&
        /\.(mp4|webm|mov|avi|ogg|m4v)$/i.test(item.image_url)
      );

      if (categoryVideos.length > 0) {
        setVideos(categoryVideos);
      }
    } catch (error) {
      console.error('Error fetching videos:', error);
    }
  };

  // Auto-advance to next video
  useEffect(() => {
    if (videos.length === 0) return;

    const timer = setInterval(() => {
      setIsTransitioning(true);

      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % videos.length);
        setIsTransitioning(false);
      }, 500); // Fade duration
    }, interval);

    return () => clearInterval(timer);
  }, [videos.length, interval]);

  // Auto-play current video
  useEffect(() => {
    const currentVideo = videoRefs.current[currentIndex];
    if (currentVideo) {
      currentVideo.play().catch(() => {
        console.log('Video autoplay failed');
      });
    }
  }, [currentIndex]);

  if (videos.length === 0) {
    // Fallback to static image if no videos
    return (
      <div className="aspect-[4/5] bg-cover bg-center relative z-10"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1595475207225-428b62bda831?q=80&w=2574')",
        }}>
      </div>
    );
  }

  return (
    <div className="aspect-[4/5] relative z-10 overflow-hidden bg-gradient-to-br from-primary to-primary-container">
      {videos.map((video, index) => (
        <video
          key={video.id}
          ref={(el) => { videoRefs.current[index] = el; }}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
            index === currentIndex && !isTransitioning ? 'opacity-100' : 'opacity-0'
          }`}
          loop
          muted
          playsInline
          preload="auto"
          onLoadedData={(e) => {
            // Ensure smooth appearance when loaded
            if (index === currentIndex) {
              e.currentTarget.style.opacity = '1';
            }
          }}
        >
          <source src={video.image_url} type="video/mp4" />
        </video>
      ))}

      {/* Video counter indicator */}
      <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-xs font-bold z-10">
        {currentIndex + 1} / {videos.length}
      </div>
    </div>
  );
}
