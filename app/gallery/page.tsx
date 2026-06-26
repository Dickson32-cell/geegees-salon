"use client";

import { useState } from "react";

export default function GalleryPage() {
  const [activeFilter, setActiveFilter] = useState("all");

  const galleryItems = [
    { category: "color", height: "tall", image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=2574", title: "Midnight Platinum", type: "Editorial Color" },
    { category: "cut", height: "medium", image: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?q=80&w=2666", title: "The Modern Executive", type: "Precision Cut" },
    { category: "grooming", height: "standard", image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=2670", title: "Artisan Ritual", type: "Grooming" },
    { category: "style", height: "tall", image: "https://images.unsplash.com/photo-1595475207225-428b62bda831?q=80&w=2574", title: "Gilded Waves", type: "Styling" },
    { category: "color", height: "medium", image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=2669", title: "Sunkissed Balayage", type: "Editorial Color" },
    { category: "cut", height: "tall", image: "https://images.unsplash.com/photo-1605497788044-5a32c7078486?q=80&w=2574", title: "Architectural Bob", type: "Precision Cut" },
  ];

  const filteredItems = activeFilter === "all"
    ? galleryItems
    : galleryItems.filter(item => item.category === activeFilter);

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

      {/* Masonry Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
        {filteredItems.map((item, index) => (
          <div
            key={index}
            className={`relative group overflow-hidden cursor-pointer rounded-lg shadow-sm ${
              item.height === "tall" ? "row-span-2" : item.height === "medium" ? "row-span-1" : ""
            }`}
          >
            <div
              className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
              style={{
                backgroundImage: `url('${item.image}')`,
                minHeight: item.height === "tall" ? "600px" : item.height === "medium" ? "400px" : "300px",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
              <span className="font-label-caps text-secondary-fixed mb-2">{item.type}</span>
              <h3 className="font-headline-sm text-white">{item.title}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Load More Button */}
      <div className="mt-20 flex flex-col items-center gap-6">
        <button className="px-10 py-4 border border-secondary text-secondary font-label-caps uppercase tracking-widest hover:bg-secondary hover:text-white transition-all duration-300">
          Reveal More Creations
        </button>
      </div>
    </main>
  );
}
