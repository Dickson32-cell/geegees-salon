"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [footerContent, setFooterContent] = useState({
    contact: {
      address: '123 Editorial Way,\nFashion District, NY',
      phone: '+1 (555) 987-6543',
      email: 'concierge@geegees.com',
    },
    social: {
      instagramUrl: '#',
      facebookUrl: '#',
      youtubeUrl: '#',
      tiktokUrl: '#',
    },
  });

  useEffect(() => {
    fetchFooterContent();
  }, []);

  const fetchFooterContent = async () => {
    try {
      const response = await fetch('/api/content?page=footer');
      if (response.ok) {
        const data = await response.json();
        if (data.contact && data.social) {
          setFooterContent({
            contact: data.contact,
            social: data.social,
          });
        }
      }
    } catch (error) {
      console.error('Error fetching footer content:', error);
    }
  };

  return (
    <footer className="bg-primary pt-20 pb-10 border-t border-secondary/30">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop grid md:grid-cols-4 gap-12 mb-20">
        <div className="md:col-span-1">
          <h1 className="font-display-lg text-headline-sm uppercase tracking-widest text-secondary-fixed mb-6">GeeGees</h1>
          <p className="text-on-primary-container font-body-md">Luxury editorial experience for the modern individual. Established 2009.</p>
        </div>

        <div>
          <h5 className="font-label-caps text-label-caps text-white uppercase tracking-widest mb-6">Navigation</h5>
          <ul className="space-y-4">
            <li>
              <Link href="/services" className="text-on-primary-container hover:text-secondary-fixed transition-colors">
                Our Services
              </Link>
            </li>
            <li>
              <Link href="/gallery" className="text-on-primary-container hover:text-secondary-fixed transition-colors">
                The Gallery
              </Link>
            </li>
            <li>
              <Link href="/team" className="text-on-primary-container hover:text-secondary-fixed transition-colors">
                Our Story
              </Link>
            </li>
            <li>
              <Link href="/booking" className="inline-block">
                <span className="bg-secondary text-primary px-5 py-2.5 rounded-lg font-label-caps text-xs uppercase tracking-widest font-bold shadow-lg shadow-secondary/40 hover:shadow-xl hover:shadow-secondary/60 hover:scale-105 transition-all duration-300">
                  Book Appointment
                </span>
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h5 className="font-label-caps text-label-caps text-white uppercase tracking-widest mb-6">Contact</h5>
          <ul className="space-y-4">
            <li className="text-on-primary-container whitespace-pre-line">{footerContent.contact.address}</li>
            <li className="text-on-primary-container">{footerContent.contact.phone}</li>
            <li className="text-on-primary-container">{footerContent.contact.email}</li>
          </ul>
        </div>

        <div>
          <h5 className="font-label-caps text-label-caps text-white uppercase tracking-widest mb-6">Follow Us</h5>
          <div className="flex gap-4">
            <a
              href={footerContent.social.instagramUrl}
              target={footerContent.social.instagramUrl !== '#' ? '_blank' : undefined}
              rel={footerContent.social.instagramUrl !== '#' ? 'noopener noreferrer' : undefined}
              className="w-10 h-10 border border-secondary/40 flex items-center justify-center text-white hover:bg-secondary hover:border-secondary transition-all rounded group"
              aria-label="Instagram"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            <a
              href={footerContent.social.facebookUrl}
              target={footerContent.social.facebookUrl !== '#' ? '_blank' : undefined}
              rel={footerContent.social.facebookUrl !== '#' ? 'noopener noreferrer' : undefined}
              className="w-10 h-10 border border-secondary/40 flex items-center justify-center text-white hover:bg-secondary hover:border-secondary transition-all rounded group"
              aria-label="Facebook"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a
              href={footerContent.social.youtubeUrl}
              target={footerContent.social.youtubeUrl !== '#' ? '_blank' : undefined}
              rel={footerContent.social.youtubeUrl !== '#' ? 'noopener noreferrer' : undefined}
              className="w-10 h-10 border border-secondary/40 flex items-center justify-center text-white hover:bg-secondary hover:border-secondary transition-all rounded group"
              aria-label="YouTube"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
            <a
              href={footerContent.social.tiktokUrl}
              target={footerContent.social.tiktokUrl !== '#' ? '_blank' : undefined}
              rel={footerContent.social.tiktokUrl !== '#' ? 'noopener noreferrer' : undefined}
              className="w-10 h-10 border border-secondary/40 flex items-center justify-center text-white hover:bg-secondary hover:border-secondary transition-all rounded group"
              aria-label="TikTok"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-on-primary-container/60 text-xs font-label-caps uppercase tracking-widest text-center md:text-left">
          © {currentYear} GeeGees Luxury Salon. All Rights Reserved.
        </p>
        <div className="flex flex-wrap justify-center gap-4 md:gap-8">
          <Link href="/privacy" className="text-on-primary-container/60 hover:text-white text-xs font-label-caps uppercase tracking-widest">
            Privacy Policy
          </Link>
          <Link href="/terms" className="text-on-primary-container/60 hover:text-white text-xs font-label-caps uppercase tracking-widest">
            Terms of Service
          </Link>
          <Link href="/careers" className="text-on-primary-container/60 hover:text-white text-xs font-label-caps uppercase tracking-widest">
            Careers
          </Link>
        </div>
      </div>
    </footer>
  );
}
