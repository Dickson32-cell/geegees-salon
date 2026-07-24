"use client";

import { useEffect, useRef } from "react";
import { isVideoUrl } from "@/lib/media";

interface MediaLightboxProps {
    url: string;
    alt: string;
    onClose: () => void;
}

export default function MediaLightbox({ url, alt, onClose }: MediaLightboxProps) {
    const overlayRef = useRef<HTMLDivElement>(null);

    // Close on Escape key
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", handleKey);
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", handleKey);
            document.body.style.overflow = "";
        };
    }, [onClose]);

    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === overlayRef.current) onClose();
    };

    return (
        <div
            ref={overlayRef}
            onClick={handleOverlayClick}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
        >
            {/* Close button */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/40 text-white rounded-full flex items-center justify-center transition-colors z-10"
                aria-label="Close"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>

            {/* Media */}
            <div className="max-w-4xl max-h-[90vh] w-full flex items-center justify-center">
                {isVideoUrl(url) ? (
                    <video
                        src={url}
                        className="max-w-full max-h-[85vh] rounded-lg shadow-2xl object-contain"
                        controls
                        autoPlay
                        playsInline
                    />
                ) : (
                    <img
                        src={url}
                        alt={alt}
                        className="max-w-full max-h-[85vh] rounded-lg shadow-2xl object-contain"
                    />
                )}
            </div>

            {/* Caption */}
            {alt && (
                <div className="absolute bottom-4 left-0 right-0 text-center text-white/80 text-sm px-4">
                    {alt}
                </div>
            )}
        </div>
    );
}
