"use client";

import { useState, useEffect, useRef } from "react";
import { isVideoUrl } from "@/lib/media";
import { isInAppBrowserCached } from "@/lib/inAppBrowser";

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
  const [inAppBrowser, setInAppBrowser] = useState(false);
  const [userStartedPlayback, setUserStartedPlayback] = useState(false);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    setInAppBrowser(isInAppBrowserCached());
  }, []);

  useEffect(() => {
    fetchVideos();
  }, [category]);

  const fetchVideos = async () => {
    try {
      const response = await fetch('/api/gallery');
      if (!response.ok) return;

      const data = await response.json();
      // Filter for videos in the specified category
      const categoryVideos = data.filter((item: any) =>
        isVideoUrl(item.image_url) &&
        (item.category === category || (!item.category && category === "home-showcase"))
      );

      if (categoryVideos.length > 0) {
        setVideos(categoryVideos);
      }
    } catch (error) {
      console.error('Error fetching videos:', error);
    }
  };

  // Auto-advance to next video (disabled in in-app browser until user starts)
  useEffect(() => {
    if (videos.length === 0) return;
    if (inAppBrowser && !userStartedPlayback) return;

    const timer = setInterval(() => {
      setIsTransitioning(true);

      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % videos.length);
        setIsTransitioning(false);
      }, 500); // Fade duration
    }, interval);

    return () => clearInterval(timer);
  }, [videos.length, interval, inAppBrowser, userStartedPlayback]);

  // Auto-play current video (only in normal browser, or after user starts in in-app)
  useEffect(() => {
    if (inAppBrowser && !userStartedPlayback) return;

    const currentVideo = videoRefs.current[currentIndex];
    if (currentVideo) {
      currentVideo.play().catch(() => {
        console.log('Video autoplay failed');
      });
    }
  }, [currentIndex, inAppBrowser, userStartedPlayback]);

  const handleStartPlayback = () => {
    setUserStartedPlayback(true);
    const currentVideo = videoRefs.current[currentIndex];
    if (currentVideo) {
      currentVideo.play().catch(() => {});
    }
  };

  if (videos.length === 0) {
    // Fallback to elegant gradient when no videos are available
    return (
      <div className="aspect-[4/5] bg-gradient-to-br from-primary via-primary-container to-secondary relative z-10 flex items-center justify-center">
        <div className="text-center text-white/90 px-6">
          <svg className="w-16 h-16 mx-auto mb-4 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <p className="text-sm font-light opacity-80">Upload videos to showcase your work</p>
        </div>
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
          preload={inAppBrowser ? "metadata" : "auto"}
          onLoadedData={(e) => {
            console.log('Video loaded:', video.image_url);
          }}
        >
          <source src={video.image_url} />
        </video>
      ))}

      {/* Tap-to-play overlay (in-app browser only) */}
      {inAppBrowser && !userStartedPlayback && (
        <button
          onClick={handleStartPlayback}
          className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-primary/50 cursor-pointer"
          aria-label="Tap to play video"
        >
          <div className="w-14 h-14 rounded-full bg-secondary/90 flex items-center justify-center mb-2 shadow-lg">
            <svg className="w-7 h-7 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
          <span className="text-white text-xs font-label-caps uppercase tracking-widest">Tap to Play</span>
        </button>
      )}

      {/* Video counter indicator */}
      <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-xs font-bold z-10">
        {currentIndex + 1} / {videos.length}
      </div>
    </div>
  );
}