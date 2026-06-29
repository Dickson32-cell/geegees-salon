"use client";

import { useEffect, useRef, useState } from 'react';

interface HeroVideoProps {
  videoUrl: string;
  children: React.ReactNode;
}

export default function HeroVideo({ videoUrl, children }: HeroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPlayButton, setShowPlayButton] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Force video to be muted and ready to play
    video.muted = true;
    video.volume = 0;

    const attemptPlay = () => {
      video.play()
        .then(() => {
          console.log('✅ Video is playing!');
          setIsPlaying(true);
          setShowPlayButton(false);
        })
        .catch((error) => {
          console.log('⚠️ Autoplay blocked, showing play button');
          setShowPlayButton(true);
          setIsPlaying(false);
        });
    };

    // Try to play when loaded
    const handleCanPlay = () => {
      attemptPlay();
    };

    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('loadeddata', handleCanPlay);

    // Also try immediately if already loaded
    if (video.readyState >= 3) {
      attemptPlay();
    }

    // Try multiple times
    setTimeout(attemptPlay, 100);
    setTimeout(attemptPlay, 500);
    setTimeout(attemptPlay, 1000);

    return () => {
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('loadeddata', handleCanPlay);
    };
  }, []);

  const handlePlayClick = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.play()
      .then(() => {
        setIsPlaying(true);
        setShowPlayButton(false);
      })
      .catch((error) => {
        console.error('Failed to play:', error);
      });
  };

  return (
    <div className="relative rounded-lg overflow-hidden shadow-2xl w-full bg-primary" style={{ height: '65vh', minHeight: '500px' }}>
      {/* Video Element */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
        style={{
          objectFit: 'cover',
          objectPosition: 'center center'
        }}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        onPlay={() => {
          setIsPlaying(true);
          setShowPlayButton(false);
        }}
        onPause={() => {
          setIsPlaying(false);
          // Auto-resume
          setTimeout(() => {
            videoRef.current?.play().catch(() => {});
          }, 100);
        }}
      >
        <source src={videoUrl} />
      </video>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/60 to-primary/30"></div>

      {/* Play Button (if autoplay fails) */}
      {showPlayButton && !isPlaying && (
        <button
          onClick={handlePlayClick}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 bg-secondary hover:bg-secondary/90 text-white rounded-full p-6 shadow-2xl transition-all group"
          aria-label="Play video"
        >
          <svg className="w-12 h-12 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20">
            <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
          </svg>
        </button>
      )}

      {/* Text Overlay */}
      <div className="absolute inset-0 flex items-center justify-center text-center px-6 z-20">
        {children}
      </div>
    </div>
  );
}
