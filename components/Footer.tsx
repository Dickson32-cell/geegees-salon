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
      activeSocialHandle: 'all',
      instagramUrl: '#',
      snapchatUrl: '#',
      youtubeUrl: '#',
      tiktokUrl: '#',
      whatsappUrl: '#',
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
              <Link href="/services" className="inline-block">
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
            <li>
              <a
                href="https://www.google.com/maps/search/?api=1&query=VH-0080-9786"
                target="_blank"
                rel="noopener noreferrer"
                className="text-secondary hover:text-secondary-fixed transition-colors flex items-center gap-2 group"
              >
                <svg
                  className="w-4 h-4 fill-current"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
                <span className="group-hover:underline">VH-0080-9786 (View on Map)</span>
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h5 className="font-label-caps text-label-caps text-white uppercase tracking-widest mb-6">Follow Us</h5>
          <div className="flex gap-4">
            {(!footerContent.social.activeSocialHandle || footerContent.social.activeSocialHandle === 'all' || footerContent.social.activeSocialHandle === 'instagram') && (
              <a
                href={footerContent.social.instagramUrl}
                target={footerContent.social.instagramUrl !== '#' ? '_blank' : undefined}
                rel={footerContent.social.instagramUrl !== '#' ? 'noopener noreferrer' : undefined}
                className="w-10 h-10 border border-secondary/40 flex items-center justify-center text-white hover:bg-secondary hover:border-secondary transition-all rounded group"
                aria-label="Instagram"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
            )}
            {(!footerContent.social.activeSocialHandle || footerContent.social.activeSocialHandle === 'all' || footerContent.social.activeSocialHandle === 'snapchat') && (
              <a
                href={footerContent.social.snapchatUrl}
                target={footerContent.social.snapchatUrl !== '#' ? '_blank' : undefined}
                rel={footerContent.social.snapchatUrl !== '#' ? 'noopener noreferrer' : undefined}
                className="w-10 h-10 border border-secondary/40 flex items-center justify-center text-white hover:bg-secondary hover:border-secondary transition-all rounded group"
                aria-label="Snapchat"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.206.793c.99 0 4.347.276 5.93 3.821.529 1.193.403 3.219.299 4.847l-.003.06c-.012.18-.022.345-.03.51.075.045.203.09.401.09.3-.016.659-.12 1.033-.301.165-.088.344-.104.464-.104.182 0 .359.029.509.09.45.149.734.479.734.838.015.449-.39.839-1.213 1.168-.089.029-.209.075-.344.119-.45.135-1.139.36-1.333.81-.09.224-.061.524.12.868l.015.015c.06.136 1.526 3.475 4.791 4.014.255.044.435.27.42.509 0 .075-.015.149-.045.225-.24.569-1.273.988-3.146 1.271-.059.091-.12.375-.164.57-.029.179-.074.36-.134.553-.076.271-.27.405-.555.405h-.03c-.135 0-.313-.031-.538-.074-.36-.075-.765-.135-1.214-.179-.449-.03-.958-.045-1.529-.045-1.049 0-1.964.135-2.576.27-.209.074-.389.135-.584.195-.12.044-.24.074-.346.104-.538.148-1.065.301-1.977.451-.389.074-.659.104-.884.104-.639 0-.958-.27-1.152-.494-.074-.104-.122-.225-.149-.329-.064-.179-.105-.345-.149-.534-.029-.121-.064-.285-.078-.421-.029-.179-.07-.335-.134-.495.015-.015.015-.03.015-.044.015-.045.029-.104.044-.17.12-.99 1.228-1.683 3.003-1.889.45-.045.749-.104.944-.21.06-.074.105-.149.105-.225.029-.104.029-.24-.012-.419-.075-.195-.24-.375-.537-.585a.784.784 0 0 1-.21-.12c-.374-.315-1.168-.838-1.35-1.042a.431.431 0 0 1-.149-.329c0-.165.09-.314.24-.405.164-.12.359-.18.539-.18h.015c.074 0 .209.03.418.12.3.135.659.255.96.3.06 0 .105.015.164.015.225 0 .375-.074.465-.149-.015-.225-.03-.449-.06-.689l-.015-.254c-.075-1.169-.135-2.606.524-3.99C7.366 1.195 11.102.793 12.206.793z" />
                </svg>
              </a>
            )}
            {(!footerContent.social.activeSocialHandle || footerContent.social.activeSocialHandle === 'all' || footerContent.social.activeSocialHandle === 'youtube') && (
              <a
                href={footerContent.social.youtubeUrl}
                target={footerContent.social.youtubeUrl !== '#' ? '_blank' : undefined}
                rel={footerContent.social.youtubeUrl !== '#' ? 'noopener noreferrer' : undefined}
                className="w-10 h-10 border border-secondary/40 flex items-center justify-center text-white hover:bg-secondary hover:border-secondary transition-all rounded group"
                aria-label="YouTube"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            )}
            {(!footerContent.social.activeSocialHandle || footerContent.social.activeSocialHandle === 'all' || footerContent.social.activeSocialHandle === 'tiktok') && (
              <a
                href={footerContent.social.tiktokUrl}
                target={footerContent.social.tiktokUrl !== '#' ? '_blank' : undefined}
                rel={footerContent.social.tiktokUrl !== '#' ? 'noopener noreferrer' : undefined}
                className="w-10 h-10 border border-secondary/40 flex items-center justify-center text-white hover:bg-secondary hover:border-secondary transition-all rounded group"
                aria-label="TikTok"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                </svg>
              </a>
            )}
            {(!footerContent.social.activeSocialHandle || footerContent.social.activeSocialHandle === 'all' || footerContent.social.activeSocialHandle === 'whatsapp') && (
              <a
                href={footerContent.social.whatsappUrl}
                target={footerContent.social.whatsappUrl !== '#' ? '_blank' : undefined}
                rel={footerContent.social.whatsappUrl !== '#' ? 'noopener noreferrer' : undefined}
                className="w-10 h-10 border border-secondary/40 flex items-center justify-center text-white hover:bg-secondary hover:border-secondary transition-all rounded group"
                aria-label="WhatsApp"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </a>
            )}
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
