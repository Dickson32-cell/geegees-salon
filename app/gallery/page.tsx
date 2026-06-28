"use client";

import { useState, useEffect } from "react";

interface GalleryImage {
  id: number;
  title: string | null;
  image_url: string; // Match Supabase snake_case
  category: string | null;
  description: string | null;
  display_order: number | null;
}

export default function GalleryPage() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [galleryItems, setGalleryItems] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  useEffect(() => {
    fetchGallery();
  }, []);

  // Close modal on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedImage) {
        setSelectedImage(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage]);

  const fetchGallery = async () => {
    try {
      const response = await fetch('/api/gallery');
      if (!response.ok) {
        throw new Error('Failed to fetch gallery');
      }
      const data = await response.json();
      setGalleryItems(data);
      setError("");
    } catch (error) {
      console.error('Error fetching gallery:', error);
      setError("Unable to load gallery images.");
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = activeFilter === "all"
    ? galleryItems
    : galleryItems.filter(item => item.category?.toLowerCase() === activeFilter);

  return (
    <main className="pt-32 pb-section-gap px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
      {/* Hero Section */}
      <section className="mb-16 text-center">
        <div className="flex flex-col items-center gap-4">
          <span className="font-label-caps text-secondary tracking-[0.3em] uppercase">Visual Journey</span>
          <h2 className="font-display-lg text-display-lg-mobile md:text-display-lg text-primary">The Editorial Gallery</h2>
          <div className="w-10 h-[1px] bg-secondary"></div>
          <p className="max-w-2xl font-body-lg text-on-surface-variant mt-4">
            Explore our curated collection of high-fashion transformations, meticulous styling, and the art of luxury grooming at GeeGees.
          </p>
        </div>
      </section>

      {/* Filter Bar */}
      <div className="flex flex-wrap justify-center gap-3 md:gap-stack-lg mb-12 border-b border-secondary/10 pb-4">
        <button
          className={`font-label-caps uppercase tracking-widest transition-colors duration-300 px-3 md:px-4 py-2 text-xs md:text-sm ${
            activeFilter === "all" ? "text-secondary border-b-2 border-secondary" : "text-on-surface-variant hover:text-secondary"
          }`}
          onClick={() => setActiveFilter("all")}
        >
          All Works
        </button>
        <button
          className={`font-label-caps uppercase tracking-widest transition-colors duration-300 px-3 md:px-4 py-2 text-xs md:text-sm ${
            activeFilter === "cut" ? "text-secondary border-b-2 border-secondary" : "text-on-surface-variant hover:text-secondary"
          }`}
          onClick={() => setActiveFilter("cut")}
        >
          Precision Cut
        </button>
        <button
          className={`font-label-caps uppercase tracking-widest transition-colors duration-300 px-3 md:px-4 py-2 text-xs md:text-sm ${
            activeFilter === "color" ? "text-secondary border-b-2 border-secondary" : "text-on-surface-variant hover:text-secondary"
          }`}
          onClick={() => setActiveFilter("color")}
        >
          Editorial Color
        </button>
        <button
          className={`font-label-caps uppercase tracking-widest transition-colors duration-300 px-3 md:px-4 py-2 text-xs md:text-sm ${
            activeFilter === "style" ? "text-secondary border-b-2 border-secondary" : "text-on-surface-variant hover:text-secondary"
          }`}
          onClick={() => setActiveFilter("style")}
        >
          Styling
        </button>
        <button
          className={`font-label-caps uppercase tracking-widest transition-colors duration-300 px-3 md:px-4 py-2 text-xs md:text-sm ${
            activeFilter === "grooming" ? "text-secondary border-b-2 border-secondary" : "text-on-surface-variant hover:text-secondary"
          }`}
          onClick={() => setActiveFilter("grooming")}
        >
          Grooming
        </button>
      </div>

      {/* Gallery Grid */}
      {error && (
        <div className="mb-8 p-6 bg-red-50 border border-red-200 rounded-lg text-center">
          <p className="text-red-700">{error}</p>
          <button
            onClick={fetchGallery}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm font-semibold"
          >
            Try Again
          </button>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx} className="bg-gray-200 animate-pulse rounded-lg" style={{ minHeight: '400px' }} />
          ))}
        </div>
      ) : !error && galleryItems.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-on-surface-variant text-lg mb-4">No gallery images yet.</p>
          <p className="text-on-surface-variant text-sm">Images will appear here once added through the admin panel.</p>
        </div>
      ) : !error && filteredItems.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-on-surface-variant text-lg">No images found in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => {
            const isVideo = /\.(mp4|webm|mov|avi|ogg|m4v)$/i.test(item.image_url);

            return (
              <div
                key={item.id}
                className="relative group overflow-hidden cursor-pointer rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 bg-gray-100"
                style={{ minHeight: '400px' }}
                onClick={() => setSelectedImage(item)}
              >
                {isVideo ? (
                  <video
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    style={{ minHeight: '400px' }}
                    controls
                    playsInline
                    preload="metadata"
                    onClick={(e) => e.stopPropagation()}
                    onError={(e) => {
                      console.error('Video load error:', item.image_url);
                      e.currentTarget.style.display = 'none';
                    }}
                  >
                    <source src={item.image_url} type="video/mp4" />
                    Your browser does not support video.
                  </video>
                ) : (
                  <img
                    src={item.image_url}
                    alt={item.title || 'Gallery image'}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    style={{ minHeight: '400px' }}
                    loading="lazy"
                    onError={(e) => {
                      console.error('Image load error:', item.image_url);
                      e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23ddd" width="400" height="400"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle"%3EImage unavailable%3C/text%3E%3C/svg%3E';
                    }}
                  />
                )}

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
                  {item.category && (
                    <span className="font-label-caps text-secondary-fixed mb-2 uppercase tracking-widest text-xs">
                      {item.category}
                    </span>
                  )}
                  {item.title && <h3 className="font-headline-sm text-white">{item.title}</h3>}
                  {item.description && (
                    <p className="text-white/80 text-sm mt-2">{item.description}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-4 right-4 text-white/80 hover:text-white text-4xl font-light leading-none z-10"
            onClick={() => setSelectedImage(null)}
            aria-label="Close lightbox"
          >
            ×
          </button>

          <div
            className="relative max-w-7xl max-h-[90vh] w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/\.(mp4|webm|mov|avi|ogg|m4v)$/i.test(selectedImage.image_url) ? (
              <video
                className="w-full h-full max-h-[90vh] object-contain"
                controls
                autoPlay
                playsInline
              >
                <source src={selectedImage.image_url} type="video/mp4" />
                Your browser does not support video.
              </video>
            ) : (
              <img
                src={selectedImage.image_url}
                alt={selectedImage.title || 'Gallery image'}
                className="w-full h-full max-h-[90vh] object-contain"
              />
            )}

            {/* Image Info Overlay */}
            {(selectedImage.title || selectedImage.category || selectedImage.description) && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
                {selectedImage.category && (
                  <span className="font-label-caps text-secondary-fixed uppercase tracking-widest text-xs block mb-2">
                    {selectedImage.category}
                  </span>
                )}
                {selectedImage.title && (
                  <h3 className="font-headline-sm text-2xl mb-2">{selectedImage.title}</h3>
                )}
                {selectedImage.description && (
                  <p className="text-white/90 text-sm">{selectedImage.description}</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
