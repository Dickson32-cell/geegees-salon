"use client";

import { useState, useEffect } from "react";

interface GalleryImage {
  id: number;
  title: string | null;
  imageUrl: string;
  category: string | null;
  description: string | null;
  displayOrder: number | null;
}

export default function GalleryPage() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [galleryItems, setGalleryItems] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    fetchGallery();
  }, []);

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
      <div className="flex flex-wrap justify-center gap-stack-lg mb-12 border-b border-secondary/10 pb-4">
        <button
          className={`font-label-caps uppercase tracking-widest transition-colors duration-300 px-4 py-2 ${
            activeFilter === "all" ? "text-secondary border-b-2 border-secondary" : "text-on-surface-variant hover:text-secondary"
          }`}
          onClick={() => setActiveFilter("all")}
        >
          All Works
        </button>
        <button
          className={`font-label-caps uppercase tracking-widest transition-colors duration-300 px-4 py-2 ${
            activeFilter === "cut" ? "text-secondary border-b-2 border-secondary" : "text-on-surface-variant hover:text-secondary"
          }`}
          onClick={() => setActiveFilter("cut")}
        >
          Precision Cut
        </button>
        <button
          className={`font-label-caps uppercase tracking-widest transition-colors duration-300 px-4 py-2 ${
            activeFilter === "color" ? "text-secondary border-b-2 border-secondary" : "text-on-surface-variant hover:text-secondary"
          }`}
          onClick={() => setActiveFilter("color")}
        >
          Editorial Color
        </button>
        <button
          className={`font-label-caps uppercase tracking-widest transition-colors duration-300 px-4 py-2 ${
            activeFilter === "style" ? "text-secondary border-b-2 border-secondary" : "text-on-surface-variant hover:text-secondary"
          }`}
          onClick={() => setActiveFilter("style")}
        >
          Styling
        </button>
        <button
          className={`font-label-caps uppercase tracking-widest transition-colors duration-300 px-4 py-2 ${
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="relative group overflow-hidden cursor-pointer rounded-lg shadow-sm"
            >
              <div
                className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{
                  backgroundImage: `url('${item.imageUrl}')`,
                  minHeight: '400px',
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
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
          ))}
        </div>
      )}
    </main>
  );
}
