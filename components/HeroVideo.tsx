"use client";

import { useEffect, useRef, useState } from 'react';

interface HeroVideoProps {
  videoUrls: string[];
  children: React.ReactNode;
}

const DEFAULT_VIDEO = "https://jqxpqrjykxmrzgtgfxpi.supabase.co/storage/v1/object/public/salon-images/hero-home/nzyn2iplvum_1782592129209.MP4";
const CYCLE_INTERVAL_MS = 8000;

export default function HeroVideo({ videoUrls, children }: HeroVideoProps) {
  const urls = videoUrls.length > 0 ? videoUrls : [DEFAULT_VIDEO];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState<number | null>(null);
  const [transitioning, setTransitioning] = useState(false);

  const currentRef = useRef<HTMLVideoElement>(null);
  const nextRef = useRef<HTMLVideoElement>(null);

  // Play/load a video element
  const playVideo = (el: HTMLVideoElement | null) => {
    if (!el) return;
    el.muted = true;
    el.volume = 0;
    el.load();
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
    playVideo(currentRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, urls[currentIndex]]);

  // Auto-cycle to next video
  useEffect(() => {
    if (urls.length <= 1) return;
    const timer = setInterval(() => {
      const next = (currentIndex + 1) % urls.length;
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
  }, [currentIndex, urls.length]);

  // Pre-load next video as soon as it's assigned
  useEffect(() => {
    if (nextIndex !== null) {
      playVideo(nextRef.current);
    }
  }, [nextIndex]);

  return (
    <div className="relative rounded-lg overflow-hidden shadow-2xl w-full bg-primary h-[60vh] min-h-[400px] sm:h-[65vh] sm:min-h-[500px]">

      {/* Current video */}
      <video
        key={`current-${currentIndex}`}
        ref={currentRef}
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
        style={{ opacity: transitioning ? 0 : 1, objectFit: 'cover', objectPosition: 'center' }}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
      >
        <source src={urls[currentIndex]} />
      </video>

      {/* Next video (fades in during transition) */}
      {nextIndex !== null && (
        <video
          key={`next-${nextIndex}`}
          ref={nextRef}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
          style={{ opacity: transitioning ? 1 : 0, objectFit: 'cover', objectPosition: 'center' }}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
        >
          <source src={urls[nextIndex]} />
        </video>
      )}

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/60 to-primary/30" />

      {/* Dot indicators (only if multiple videos) */}
      {urls.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-30">
          {urls.map((_, i) => (
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
