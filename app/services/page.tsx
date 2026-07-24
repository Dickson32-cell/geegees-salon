"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { ServiceGridSkeleton } from "@/components/LoadingSkeleton";
import { useBooking } from "@/contexts/BookingContext";
import GiftModal from "@/components/GiftModal";
import MediaLightbox from "@/components/MediaLightbox";
import { isVideoUrl } from "@/lib/media";
import { getCategoryDisplayName } from "@/lib/serviceCategories";

interface Service {
  id: number;
  name: string;
  category: string;
  subcategory?: string;
  price: string;
  duration: string;
  description?: string;
  image_url?: string; // Optional service image from Supabase
}

interface GalleryVideo {
  id: number;
  image_url: string;
  title: string | null;
}

// Gallery Video Background Component
function GalleryVideoBackground() {
  const [videos, setVideos] = useState<GalleryVideo[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const response = await fetch('/api/gallery');
      if (!response.ok) return;

      const data = await response.json();
      // Filter for ALL videos (no category filter)
      const allVideos = data.filter((item: GalleryVideo) =>
        isVideoUrl(item.image_url)
      );

      if (allVideos.length > 0) {
        setVideos(allVideos);
      }
    } catch (error) {
      console.error('Error fetching videos:', error);
    }
  };

  // Auto-advance to next video every 8 seconds
  useEffect(() => {
    if (videos.length === 0) return;

    const timer = setInterval(() => {
      setIsTransitioning(true);

      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % videos.length);
        setIsTransitioning(false);
      }, 500); // Fade duration
    }, 8000); // 8 seconds per video

    return () => clearInterval(timer);
  }, [videos.length]);

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
    // Fallback gradient if no videos
    return (
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-container to-primary"></div>
    );
  }

  return (
    <>
      {videos.map((video, index) => (
        <video
          key={video.id}
          ref={(el) => { videoRefs.current[index] = el; }}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${index === currentIndex && !isTransitioning ? 'opacity-100' : 'opacity-0'
            }`}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
        >
          <source src={video.image_url} />
        </video>
      ))}

      {/* Video counter indicator */}
      {videos.length > 1 && (
        <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-xs font-bold z-10">
          {currentIndex + 1} / {videos.length}
        </div>
      )}
    </>
  );
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [isGiftModalOpen, setIsGiftModalOpen] = useState(false);
  const [lightbox, setLightbox] = useState<{ url: string; alt: string } | null>(null);
  const { openBookingModal } = useBooking();

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      // Only fetch published services for the public website
      const response = await fetch('/api/services?status=published');
      if (!response.ok) {
        throw new Error('Failed to fetch services');
      }
      const data = await response.json();
      setServices(data);
      setError("");
    } catch (error) {
      console.error('Error fetching services:', error);
      setError("We're having trouble loading our services. Please refresh the page or try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Group services by category and subcategory
  const groupedServices: Record<string, Record<string, Service[]>> = {};
  services.forEach((service) => {
    if (!groupedServices[service.category]) {
      groupedServices[service.category] = {};
    }
    const subcategory = service.subcategory || 'General';
    if (!groupedServices[service.category][subcategory]) {
      groupedServices[service.category][subcategory] = [];
    }
    groupedServices[service.category][subcategory].push(service);
  });

  return (
    <main className="pt-16 md:pt-24 pb-section-gap">
      {/* Hero Section */}
      <section className="max-w-container-max mx-auto px-4 md:px-margin-desktop mb-8 md:mb-stack-lg">
        <div className="bg-primary h-[300px] md:h-[400px] flex items-center justify-center text-center rounded-lg relative overflow-hidden">
          {/* Gallery Video Slideshow Background */}
          <GalleryVideoBackground />

          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-black/50"></div>

          {/* Content */}
          <div className="relative z-10 max-w-3xl px-4">
            <span className="font-label-caps text-xs md:text-label-caps text-secondary-fixed uppercase tracking-[0.2em] mb-3 md:mb-4 block">
              The Art of Refinement
            </span>
            <h2 className="font-display-lg text-3xl md:text-display-lg text-white mb-4 md:mb-6">Menu of Excellence</h2>
            <div className="w-10 h-px bg-secondary-fixed mx-auto mb-4 md:mb-6"></div>
            <p className="font-body-lg text-sm md:text-body-lg text-white/90 leading-relaxed px-4 md:px-6">
              Explore our curated selection of bespoke grooming and beauty experiences, where precision meets artistry in every detail.
            </p>
          </div>
        </div>
      </section>

      {/* Services Catalog Section - DYNAMIC FROM ADMIN */}
      <section className="max-w-container-max mx-auto px-4 md:px-margin-desktop mt-8 md:mt-section-gap">
        {error && (
          <div className="mb-8 p-6 bg-red-50 border border-red-200 rounded-lg flex items-start gap-4">
            <svg className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div className="flex-1">
              <h4 className="font-semibold text-red-800 mb-1">Unable to Load Services</h4>
              <p className="text-red-700">{error}</p>
              <button
                onClick={fetchServices}
                className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm font-semibold"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <div>
            <div className="text-center mb-12">
              <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4 animate-pulse"></div>
              <div className="w-10 h-[1px] bg-gray-300 mx-auto mt-2"></div>
            </div>
            <ServiceGridSkeleton count={6} />
          </div>
        ) : !error && services.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-on-surface-variant text-lg">No services available yet. Please check back later!</p>
          </div>
        ) : !error ? (
          <div className="space-y-12 md:space-y-section-gap">
            {Object.entries(groupedServices).map(([category, subcategories]) => (
              <div key={category} className="scroll-mt-24" id={category.toLowerCase()}>
                <div className="text-center mb-8 md:mb-12">
                  <h3 className="font-headline-md text-2xl md:text-headline-md text-primary">{getCategoryDisplayName(category)}</h3>
                  <div className="w-10 h-[1px] bg-secondary mx-auto mt-2"></div>
                </div>

                {/* Render each subcategory */}
                {Object.entries(subcategories).map(([subcategory, categoryServices]) => (
                  <div key={subcategory} className="mb-10">
                    {/* Subcategory Header */}
                    <div className="mb-6">
                      <h4 className="font-headline-sm text-xl text-secondary-container inline-block px-4 py-2 bg-secondary/10 rounded-full">
                        {subcategory}
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-gutter">
                      {categoryServices.map((service) => (
                        <div key={service.id} className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow border-t-2 border-secondary overflow-hidden flex flex-col">
                          {/* Service Media */}
                          <div
                            className={`relative w-full h-52 bg-gradient-to-br from-primary to-primary-container overflow-hidden ${service.image_url ? 'cursor-pointer group' : ''}`}
                            onClick={() => service.image_url && setLightbox({ url: service.image_url, alt: service.name })}
                            title={service.image_url ? 'Click to view' : undefined}
                          >
                            {service.image_url ? (
                              isVideoUrl(service.image_url) ? (
                                <video
                                  src={service.image_url}
                                  className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                                  autoPlay
                                  loop
                                  muted
                                  playsInline
                                />
                              ) : (
                                <img
                                  src={service.image_url}
                                  alt={service.name}
                                  className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                  }}
                                />
                              )
                            ) : (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-white/40 text-4xl md:text-5xl font-light italic">GG</span>
                              </div>
                            )}
                            {/* Click-to-expand icon overlay */}
                            {service.image_url && (
                              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                                <div className="bg-white/90 rounded-full p-2">
                                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                                  </svg>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Service Details */}
                          <div className="p-6 md:p-8">
                            <div className="mb-4">
                              <h4 className="font-headline-sm text-xl md:text-headline-sm text-primary mb-2">{service.name}</h4>
                              <div className="flex flex-wrap gap-2">
                                <span className="inline-block px-3 py-1 bg-secondary/20 text-secondary rounded-full text-xs font-bold uppercase tracking-wider">
                                  {getCategoryDisplayName(service.category)}
                                </span>
                                {service.subcategory && (
                                  <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
                                    {service.subcategory}
                                  </span>
                                )}
                              </div>
                            </div>

                            {service.description && (
                              <p className="font-body-md text-on-surface-variant mb-4 line-clamp-3">{service.description}</p>
                            )}

                            <div className="flex justify-between items-center pt-4 border-t border-secondary/10">
                              <div>
                                <p className="text-xs text-on-surface-variant uppercase tracking-wide">Price</p>
                                <p className="font-headline-sm text-primary">{service.price}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-xs text-on-surface-variant uppercase tracking-wide">Duration</p>
                                <p className="font-body-md text-on-surface">{service.duration}</p>
                              </div>
                            </div>

                            <button
                              onClick={() => openBookingModal(service.id.toString())}
                              className="w-full bg-primary text-white py-3 rounded-lg font-label-caps text-label-caps hover:bg-secondary transition-colors mt-6"
                            >
                              Book This Service
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ) : null}

        {/* Call to Action */}
        <div className="mt-12 md:mt-section-gap text-center bg-secondary-container/10 py-12 md:py-16 rounded-lg px-4">
          <h3 className="font-display-lg text-2xl md:text-headline-md text-primary mb-4 md:mb-6">Ready for your transformation?</h3>
          <p className="max-w-xl mx-auto font-body-lg text-sm md:text-base text-on-surface-variant mb-8 md:mb-10">
            Appointments are limited. Secure your editorial experience with GeeGees today and indulge in the luxury you deserve.
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-4 md:gap-stack-md">
            <button
              onClick={() => openBookingModal()}
              className="bg-primary text-white px-10 py-4 rounded-lg font-label-caps text-label-caps hover:bg-primary/90 transition-all active:scale-95 shadow-lg"
            >
              Schedule Appointment
            </button>
            <button
              onClick={() => setIsGiftModalOpen(true)}
              className="border border-secondary text-secondary px-10 py-4 rounded-lg font-label-caps text-label-caps hover:bg-secondary hover:text-white transition-all active:scale-95"
            >
              Gift a Signature Session
            </button>
          </div>
        </div>
      </section>

      <GiftModal isOpen={isGiftModalOpen} onClose={() => setIsGiftModalOpen(false)} />

      {/* Media Lightbox */}
      {lightbox && (
        <MediaLightbox
          url={lightbox.url}
          alt={lightbox.alt}
          onClose={() => setLightbox(null)}
        />
      )}
    </main>
  );
}
