"use client";

import { useEffect, useRef, useState } from "react";
import { isInAppBrowserCached } from "@/lib/inAppBrowser";

interface HeroVideoProps {
  videoUrls: string[];
  children: React.ReactNode;
}

const CYCLE_INTERVAL_MS = 8000;

export default function HeroVideo({ videoUrls, children }: HeroVideoProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState<number | null>(null);
  const [transitioning, setTransitioning] = useState(false);
  const [inAppBrowser, setInAppBrowser] = useState(false);
  const [userStartedPlayback, setUserStartedPlayback] = useState(false);

  const currentRef = useRef<HTMLVideoElement>(null);
  const nextRef = useRef<HTMLVideoElement>(null);

  // Detect in-app browser on mount
  useEffect(() => {
    setInAppBrowser(isInAppBrowserCached());
  }, []);

  // Play/load a video element
  const playVideo = (el: HTMLVideoElement | null) => {
    if (!el) return;
    el.muted = true;
    el.volume = 0;
    el.load();

    // In in-app browser: only play if user has tapped to start
    if (inAppBrowser && !userStartedPlayback) {
      return;
    }

    el.play().catch(() => { });
  };

  // Reset to index 0 whenever the videoUrls prop changes (e.g. async data arrives)
  useEffect(() => {
    setCurrentIndex(0);
    setNextIndex(null);
    setTransitioning(false);
  }, [videoUrls]);

  // Reload + play whenever the URL at the current index changes
  useEffect(() => {
    if (videoUrls.length > 0) {
      playVideo(currentRef.current);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, videoUrls[currentIndex], userStartedPlayback, inAppBrowser]);

  // Auto-cycle to next video (only in normal browser, or if user has started playback)
  useEffect(() => {
    if (videoUrls.length <= 1) return;
    if (inAppBrowser && !userStartedPlayback) return; // Don't auto-cycle until user starts

    const timer = setInterval(() => {
      const next = (currentIndex + 1) % videoUrls.length;
      setNextIndex(next);
      setTransitioning(true);

      // After crossfade completes, swap to next as current
      setTimeout(() => {
        setCurrentIndex(next);
        setNextIndex(null);
        setTransitioning(false);
      }, 1000);
    }, CYCLE_INTERVAL_MS);

    return () => clearInterval(timer);
  }, [currentIndex, videoUrls.length, inAppBrowser, userStartedPlayback]);

  // Pre-load next video as soon as it's assigned
  useEffect(() => {
    if (nextIndex !== null) {
      playVideo(nextRef.current);
    }
  }, [nextIndex]);

  // Handle user tap to start playback (in-app browser mode)
  const handleStartPlayback = () => {
    setUserStartedPlayback(true);
    // Immediately play current video
    const el = currentRef.current;
    if (el) {
      el.muted = true;
      el.volume = 0;
      el.play().catch(() => { });
    }
  };

  return (
    <div className="relative rounded-lg overflow-hidden shadow-2xl w-full bg-primary h-[60vh] min-h-[400px] sm:h-[65vh] sm:min-h-[500px]">

      {/* Current video */}
      {videoUrls.length > 0 && (
        <video
          key={`current-${currentIndex}`}
          ref={currentRef}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
          style={{ opacity: transitioning ? 0 : 1, objectFit: 'cover', objectPosition: 'center' }}
          loop
          muted
          playsInline
          preload={inAppBrowser ? "metadata" : "auto"}
        >
          <source src={videoUrls[currentIndex]} />
        </video>
      )}

      {/* Next video (fades in during transition) */}
      {nextIndex !== null && videoUrls.length > 0 && (
        <video
          key={`next-${nextIndex}`}
          ref={nextRef}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
          style={{ opacity: transitioning ? 1 : 0, objectFit: 'cover', objectPosition: 'center' }}
          loop
          muted
          playsInline
          preload="auto"
        >
          <source src={videoUrls[nextIndex]} />
        </video>
      )}

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/60 to-primary/30" />

      {/* Tap-to-play overlay (in-app browser only, before user starts) */}
      {inAppBrowser && !userStartedPlayback && videoUrls.length > 0 && (
        <button
          onClick={handleStartPlayback}
          className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-primary/60 cursor-pointer"
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

      {/* Dot indicators (only if multiple videos) */}
      {videoUrls.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-30">
          {videoUrls.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${i === currentIndex ? 'bg-secondary w-6' : 'bg-white/50'
                }`}
              aria-label={`Play video ${i + 1}`}
            />
          ))}
        </div>
      )}

      {/* Text overlay */}
      <div className="absolute inset-0 flex items-center justify-center text-center px-6 z-20">
        {children}
      </div>
    </div>
  );
}