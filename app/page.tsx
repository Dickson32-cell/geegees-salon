"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { HomeServiceCardSkeleton } from "@/components/LoadingSkeleton";
import HeroVideo from "@/components/HeroVideo";
import VideoSlideshow from "@/components/VideoSlideshow";

interface Service {
  id: number;
  name: string;
  category: string;
  price: string;
  duration: string;
  description?: string;
  image_url?: string; // Optional service image from Supabase
}

interface AboutContent {
  title: string;
  description: string;
  stat1Value: string;
  stat1Label: string;
  stat2Value: string;
  stat2Label: string;
  buttonText: string;
  buttonLink: string;
}

export default function Home() {
  const [services, setServices] = useState<Service[]>([]);
  const [error, setError] = useState<string>("");
  const [aboutContent, setAboutContent] = useState<AboutContent>({
    title: 'Redefining Luxury Grooming',
    description: 'GeeGees Unisex Salon is more than a destination; it\'s a sanctuary for the discerning. We blend time-honored techniques with contemporary editorial trends to deliver an experience that transcends the traditional salon visit.',
    stat1Value: '15+',
    stat1Label: 'Years of Mastery',
    stat2Value: '24k',
    stat2Label: 'Clients Styled',
    buttonText: 'Our Story',
    buttonLink: '/team'
  });

  useEffect(() => {
    fetchServices();
    fetchAboutContent();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/services');
      if (!response.ok) {
        throw new Error('Failed to fetch services');
      }
      const data = await response.json();
      setServices(data.slice(0, 4)); // Get first 4 services for home page
      setError("");
    } catch (error) {
      console.error('Error fetching services:', error);
      setError("Unable to load services at this time.");
    }
  };

  const fetchAboutContent = async () => {
    try {
      const response = await fetch('/api/content?page=home');
      if (response.ok) {
        const data = await response.json();
        if (data.about) {
          setAboutContent(data.about);
        }
      }
    } catch (error) {
      console.error('Error fetching about content:', error);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section with Video Frame */}
      <section className="relative min-h-[70vh] flex items-center justify-center bg-primary px-4 md:px-margin-desktop py-12">
        <div className="max-w-container-max mx-auto w-full">
          <HeroVideo videoUrl="https://jqxpqrjykxmrzgtgfxpi.supabase.co/storage/v1/object/public/salon-images/hero-home/nzyn2iplvum_1782592129209.MP4">
            <div className="max-w-4xl">
              <span className="font-label-caps text-xs md:text-label-caps text-secondary-fixed uppercase tracking-[0.2em] md:tracking-[0.3em] mb-4 block">
                The Editorial Experience
              </span>
              <h2 className="font-display-lg text-3xl md:text-5xl lg:text-6xl text-white mb-8 leading-tight">
                Mastering the Art of <br/>
                <span className="italic font-normal">Opulence & Grace</span>
              </h2>
              <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6">
                <Link href="/services">
                  <button className="w-full md:w-auto bg-secondary border border-secondary text-white px-10 py-4 font-label-caps text-label-caps uppercase tracking-widest hover:bg-secondary/90 transition-colors shadow-lg">
                    Explore Services
                  </button>
                </Link>
                <Link href="/gallery">
                  <button className="w-full md:w-auto border-2 border-white text-white px-10 py-4 font-label-caps text-label-caps uppercase tracking-widest hover:bg-white hover:text-primary transition-all">
                    View Gallery
                  </button>
                </Link>
              </div>
            </div>
          </HeroVideo>
        </div>
      </section>

      {/* About Section */}
      <section className="py-12 md:py-section-gap px-4 md:px-margin-desktop max-w-container-max mx-auto">
        <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-center">
          <div className="relative group">
            <div className="absolute -inset-4 border border-secondary/20 translate-x-4 translate-y-4 group-hover:translate-x-2 group-hover:translate-y-2 transition-transform duration-500"></div>
            <VideoSlideshow category="home-showcase" interval={8000} />
          </div>

          <div>
            <div className="w-10 h-[1px] bg-secondary mb-6"></div>
            <h3 className="font-headline-md text-headline-md mb-6">{aboutContent.title}</h3>
            <p className="font-body-lg text-body-lg text-on-surface-variant mb-8 leading-relaxed">
              {aboutContent.description}
            </p>
            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <span className="font-display-lg text-headline-md text-secondary block mb-2">{aboutContent.stat1Value}</span>
                <span className="font-label-caps text-label-caps uppercase text-on-surface-variant">{aboutContent.stat1Label}</span>
              </div>
              <div>
                <span className="font-display-lg text-headline-md text-secondary block mb-2">{aboutContent.stat2Value}</span>
                <span className="font-label-caps text-label-caps uppercase text-on-surface-variant">{aboutContent.stat2Label}</span>
              </div>
            </div>
            <Link href={aboutContent.buttonLink}>
              <button className="border border-secondary text-secondary px-8 py-3 font-label-caps text-label-caps uppercase tracking-widest hover:bg-secondary hover:text-white transition-all">
                {aboutContent.buttonText}
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Services Teaser Section - DYNAMIC FROM ADMIN */}
      <section className="bg-primary py-12 md:py-section-gap px-4 md:px-margin-desktop">
        <div className="max-w-container-max mx-auto">
          <div className="text-center mb-8 md:mb-16">
            <span className="font-label-caps text-label-caps text-secondary-fixed-dim uppercase tracking-widest">Exquisite Selection</span>
            <h3 className="font-display-lg text-display-lg text-white mt-4">Curated Services</h3>
          </div>

          {error && (
            <div className="mb-8 p-6 bg-red-50/10 border border-red-200/30 rounded-lg flex items-center gap-4 justify-center">
              <p className="text-white/90">{error}</p>
              <button
                onClick={fetchServices}
                className="px-4 py-2 bg-secondary text-white rounded hover:bg-secondary/90 transition-colors text-sm font-semibold"
              >
                Retry
              </button>
            </div>
          )}

          {!error && services.length === 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {Array.from({ length: 4 }).map((_, idx) => (
                <HomeServiceCardSkeleton key={idx} />
              ))}
            </div>
          ) : !error && services.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {services.map((service) => (
                <div key={service.id} className="relative group overflow-hidden rounded-lg min-h-[280px] flex items-end">
                  {/* Background Image or Gradient */}
                  {service.image_url ? (
                    <>
                      <img
                        src={service.image_url}
                        alt={service.name}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                        onError={(e) => {
                          console.error('Service image load error:', service.image_url);
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/70 to-primary/20"></div>
                    </>
                  ) : (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary-container"></div>
                      <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/50 to-transparent"></div>
                    </>
                  )}

                  {/* Service Details Overlay */}
                  <div className="relative p-6 w-full z-10">
                    <span className="font-label-caps text-label-caps text-secondary-fixed uppercase tracking-widest text-xs block mb-2">
                      {service.category}
                    </span>
                    <h4 className="font-headline-sm text-headline-sm text-white mb-2">{service.name}</h4>
                    {service.description && (
                      <p className="text-white/90 text-sm mb-3 line-clamp-2">{service.description}</p>
                    )}
                    <div className="flex justify-between items-center">
                      <span className="text-secondary-fixed font-bold">{service.price}</span>
                      <span className="text-white/90 text-sm">{service.duration}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : null}

          <div className="text-center mt-12">
            <Link href="/services">
              <button className="border border-secondary-fixed text-secondary-fixed px-10 py-4 font-label-caps text-label-caps uppercase tracking-widest hover:bg-secondary-fixed hover:text-primary transition-all">
                View All Services
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Team Showcase Section - Will be managed through admin */}
      {/* Team members will be added through the admin panel */}

      {/* Booking CTA Section */}
      <section className="relative py-12 md:py-section-gap">
        <div className="absolute inset-0 bg-primary-container -z-10"></div>
        <div className="max-w-container-max mx-auto px-4 md:px-margin-desktop text-center">
          <h2 className="font-display-lg text-3xl md:text-display-lg text-white mb-4">Secure Your Moment</h2>
          <p className="font-body-lg text-sm md:text-base text-on-primary-container max-w-lg mx-auto mb-6 md:mb-8">
            Experience the pinnacle of editorial grooming. Our schedule fills quickly—reserve your appointment today.
          </p>
          <Link href="/booking">
            <button className="bg-primary border border-secondary text-white px-12 py-5 font-label-caps text-label-caps uppercase tracking-widest hover:bg-secondary transition-colors shadow-lg">
              Book Your Appointment
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}
