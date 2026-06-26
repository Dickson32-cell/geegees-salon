"use client";

import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

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
              <Link href="/booking" className="text-on-primary-container hover:text-secondary-fixed transition-colors">
                Book Appointment
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h5 className="font-label-caps text-label-caps text-white uppercase tracking-widest mb-6">Contact</h5>
          <ul className="space-y-4">
            <li className="text-on-primary-container">123 Editorial Way,<br/>Fashion District, NY</li>
            <li className="text-on-primary-container">+1 (555) 987-6543</li>
            <li className="text-on-primary-container">concierge@geegees.com</li>
          </ul>
        </div>

        <div>
          <h5 className="font-label-caps text-label-caps text-white uppercase tracking-widest mb-6">Follow Us</h5>
          <div className="flex gap-4">
            <a
              href="#"
              className="w-10 h-10 border border-secondary/40 flex items-center justify-center text-white hover:bg-secondary transition-all rounded"
              aria-label="Instagram"
            >
              <span className="text-sm font-bold">IG</span>
            </a>
            <a
              href="#"
              className="w-10 h-10 border border-secondary/40 flex items-center justify-center text-white hover:bg-secondary transition-all rounded"
              aria-label="Facebook"
            >
              <span className="text-sm font-bold">FB</span>
            </a>
            <a
              href="#"
              className="w-10 h-10 border border-secondary/40 flex items-center justify-center text-white hover:bg-secondary transition-all rounded"
              aria-label="YouTube"
            >
              <span className="text-sm font-bold">YT</span>
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-on-primary-container/60 text-xs font-label-caps uppercase tracking-widest">
          © {currentYear} GeeGees Luxury Salon. All Rights Reserved.
        </p>
        <div className="flex gap-8">
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
