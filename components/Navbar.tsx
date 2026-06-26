"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 w-full z-50 bg-surface/90 backdrop-blur-md border-b border-secondary/20 transition-shadow duration-300 ${isScrolled ? 'shadow-lg' : ''}`}>
      <div className="flex justify-between items-center px-margin-mobile md:px-margin-desktop h-20 max-w-container-max mx-auto">
        <div className="flex items-center gap-4">
          <button
            className="md:hidden text-secondary cursor-pointer"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <Link href="/">
            <h1 className="font-display-lg text-headline-sm uppercase tracking-widest text-primary">
              GeeGees
            </h1>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/"
            className="font-label-caps text-label-caps text-secondary font-bold uppercase tracking-widest"
          >
            Home
          </Link>
          <Link
            href="/services"
            className="font-label-caps text-label-caps text-on-surface-variant hover:text-secondary transition-colors uppercase tracking-widest"
          >
            Services
          </Link>
          <Link
            href="/gallery"
            className="font-label-caps text-label-caps text-on-surface-variant hover:text-secondary transition-colors uppercase tracking-widest"
          >
            Gallery
          </Link>
          <Link
            href="/team"
            className="font-label-caps text-label-caps text-on-surface-variant hover:text-secondary transition-colors uppercase tracking-widest"
          >
            Our Story
          </Link>
        </nav>

        <Link href="/booking">
          <button className="bg-primary text-on-primary px-6 py-2 rounded-lg font-label-caps text-label-caps uppercase tracking-widest hover:bg-secondary transition-all active:scale-95 duration-200">
            Book Now
          </button>
        </Link>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-[60] md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div
            className="absolute left-0 top-0 h-full w-80 bg-surface shadow-2xl p-8 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-8">
              <h1 className="font-display-lg text-headline-sm uppercase tracking-widest text-primary">
                GeeGees
              </h1>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-secondary"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <nav className="flex flex-col gap-4 divide-y divide-secondary/10">
              <Link
                href="/"
                className="font-body-lg text-primary font-bold py-3"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/services"
                className="font-body-lg text-on-surface-variant hover:text-secondary transition-colors py-3"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Services
              </Link>
              <Link
                href="/gallery"
                className="font-body-lg text-on-surface-variant hover:text-secondary transition-colors py-3"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Gallery
              </Link>
              <Link
                href="/team"
                className="font-body-lg text-on-surface-variant hover:text-secondary transition-colors py-3"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Our Story
              </Link>
              <Link
                href="/booking"
                className="font-body-lg text-on-surface-variant hover:text-secondary transition-colors py-3"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Book Appointment
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
