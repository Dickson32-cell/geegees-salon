"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [logoUrl, setLogoUrl] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    fetchLogo();
  }, []);

  const fetchLogo = async () => {
    try {
      const response = await fetch('/api/settings');
      if (response.ok) {
        const data = await response.json();
        setLogoUrl(data.logoUrl || '');
      }
    } catch (error) {
      console.error('Error fetching logo:', error);
    }
  };

  return (
    <>
    <header className={`fixed top-0 w-full z-50 bg-surface/95 backdrop-blur-md border-b border-secondary/20 transition-shadow duration-300 ${isScrolled ? 'shadow-lg' : ''}`}>
      <div className="flex justify-between items-center px-4 md:px-margin-desktop h-16 md:h-20 max-w-container-max mx-auto">
        <div className="flex items-center gap-3">
          <button
            className="md:hidden text-secondary cursor-pointer relative z-[60] p-2 hover:bg-secondary/10 rounded-lg transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
          <Link href="/" className="flex items-center gap-2 md:gap-3">
            {logoUrl && (
              <img
                src={logoUrl}
                alt="GeeGees Logo"
                className="h-8 md:h-10 w-auto object-contain"
              />
            )}
            <h1 className="font-display-lg text-lg md:text-2xl uppercase tracking-widest text-primary">
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
          <Link
            href="/services"
            className="font-label-caps text-label-caps text-on-surface-variant hover:text-secondary transition-colors uppercase tracking-widest"
          >
            Book Now
          </Link>
        </nav>
      </div>

    </header>

      {/* Mobile Menu Drawer */}
      <div
        className={`fixed inset-0 bg-black/60 z-[55] md:hidden transition-opacity duration-300 ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <div
          className={`absolute left-0 top-0 h-full w-4/5 max-w-sm bg-surface shadow-2xl p-6 overflow-y-auto transition-transform duration-300 ${
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-2">
                {logoUrl && (
                  <img
                    src={logoUrl}
                    alt="GeeGees Logo"
                    className="h-8 w-auto object-contain"
                  />
                )}
                <h1 className="font-display-lg text-headline-sm uppercase tracking-widest text-primary">
                  GeeGees
                </h1>
              </div>
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
            </nav>
          </div>
        </div>
    </>
  );
}
