"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { HomeServiceCardSkeleton } from "@/components/LoadingSkeleton";

interface Service {
  id: number;
  name: string;
  category: string;
  price: string;
  duration: string;
  description?: string;
}

export default function Home() {
  const [services, setServices] = useState<Service[]>([]);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    fetchServices();
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

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full bg-cover bg-center scale-105" style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=2574')",
          }}>
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-primary/40 via-primary/80 to-primary/90"></div>
        </div>

        <div className="relative z-10 text-center px-margin-mobile max-w-4xl">
          <span className="font-label-caps text-label-caps text-secondary-fixed-dim uppercase tracking-[0.3em] mb-4 block animate-fade-in-up">
            The Editorial Experience
          </span>
          <h2 className="font-display-lg text-display-lg text-white mb-8 leading-tight">
            Mastering the Art of <br/>
            <span className="italic font-normal">Opulence & Grace</span>
          </h2>
          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <Link href="/services">
              <button className="w-full md:w-auto bg-primary border border-secondary text-white px-10 py-4 font-label-caps text-label-caps uppercase tracking-widest hover:bg-secondary transition-colors">
                Explore Services
              </button>
            </Link>
            <Link href="/gallery" className="font-label-caps text-label-caps text-white border-b border-secondary/50 pb-1 hover:border-secondary transition-all uppercase tracking-widest">
              View Gallery
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-section-gap px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="relative group">
            <div className="absolute -inset-4 border border-secondary/20 translate-x-4 translate-y-4 group-hover:translate-x-2 group-hover:translate-y-2 transition-transform duration-500"></div>
            <div className="aspect-[4/5] bg-cover bg-center relative z-10" style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1595475207225-428b62bda831?q=80&w=2574')",
            }}>
            </div>
          </div>

          <div>
            <div className="w-10 h-[1px] bg-secondary mb-6"></div>
            <h3 className="font-headline-md text-headline-md mb-6">Redefining Luxury Grooming</h3>
            <p className="font-body-lg text-body-lg text-on-surface-variant mb-8 leading-relaxed">
              GeeGees Unisex Salon is more than a destination; it&apos;s a sanctuary for the discerning. We blend time-honored techniques with contemporary editorial trends to deliver an experience that transcends the traditional salon visit.
            </p>
            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <span className="font-display-lg text-headline-md text-secondary block mb-2">15+</span>
                <span className="font-label-caps text-label-caps uppercase text-on-surface-variant">Years of Mastery</span>
              </div>
              <div>
                <span className="font-display-lg text-headline-md text-secondary block mb-2">24k</span>
                <span className="font-label-caps text-label-caps uppercase text-on-surface-variant">Clients Styled</span>
              </div>
            </div>
            <Link href="/team">
              <button className="border border-secondary text-secondary px-8 py-3 font-label-caps text-label-caps uppercase tracking-widest hover:bg-secondary hover:text-white transition-all">
                Our Story
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Services Teaser Section - DYNAMIC FROM ADMIN */}
      <section className="bg-primary py-section-gap px-margin-mobile md:px-margin-desktop">
        <div className="max-w-container-max mx-auto">
          <div className="text-center mb-16">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, idx) => (
                <HomeServiceCardSkeleton key={idx} />
              ))}
            </div>
          ) : !error && services.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {services.map((service, idx) => (
                <div key={service.id} className="relative group overflow-hidden bg-primary-container rounded-lg">
                  <div className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700 opacity-60" style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-${
                      idx === 0 ? '1562322140-8baeececf3df' :
                      idx === 1 ? '1599351431202-1e0f0137899a' :
                      idx === 2 ? '1621605815971-fbc98d665033' :
                      '1570172619644-dfd03ed5d881'
                    }?q=80&w=2670')`,
                  }}>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-primary via-transparent to-transparent"></div>
                  <div className="absolute bottom-0 p-6 w-full">
                    <span className="font-label-caps text-label-caps text-secondary-fixed uppercase tracking-widest text-xs block mb-2">
                      {service.category}
                    </span>
                    <h4 className="font-headline-sm text-headline-sm text-white mb-2">{service.name}</h4>
                    {service.description && (
                      <p className="text-on-primary-container text-sm mb-3">{service.description}</p>
                    )}
                    <div className="flex justify-between items-center">
                      <span className="text-secondary-fixed font-bold">{service.price}</span>
                      <span className="text-on-primary-container text-sm">{service.duration}</span>
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

      {/* Team Showcase Section */}
      <section className="py-section-gap bg-surface overflow-hidden">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="flex justify-between items-end mb-16">
            <div>
              <div className="w-10 h-[1px] bg-secondary mb-4"></div>
              <h3 className="font-display-lg text-display-lg">The Visionaries</h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Team Member 1 */}
            <div className="group">
              <div className="overflow-hidden mb-6 aspect-[3/4] relative">
                <div className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500" style={{
                  backgroundImage: "url('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2574')",
                }}>
                </div>
              </div>
              <h4 className="font-headline-sm text-headline-sm mb-1">Julian Marc</h4>
              <span className="font-label-caps text-label-caps text-secondary uppercase tracking-widest">Master Stylist</span>
            </div>

            {/* Team Member 2 */}
            <div className="group">
              <div className="overflow-hidden mb-6 aspect-[3/4] relative">
                <div className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500" style={{
                  backgroundImage: "url('https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2574')",
                }}>
                </div>
              </div>
              <h4 className="font-headline-sm text-headline-sm mb-1">Elena Rossi</h4>
              <span className="font-label-caps text-label-caps text-secondary uppercase tracking-widest">Artistic Director</span>
            </div>

            {/* Team Member 3 */}
            <div className="group">
              <div className="overflow-hidden mb-6 aspect-[3/4] relative">
                <div className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500" style={{
                  backgroundImage: "url('https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=2574')",
                }}>
                </div>
              </div>
              <h4 className="font-headline-sm text-headline-sm mb-1">Marcus Thorne</h4>
              <span className="font-label-caps text-label-caps text-secondary uppercase tracking-widest">Lead Barber</span>
            </div>

            {/* Team Member 4 */}
            <div className="group">
              <div className="overflow-hidden mb-6 aspect-[3/4] relative">
                <div className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500" style={{
                  backgroundImage: "url('https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=2564')",
                }}>
                </div>
              </div>
              <h4 className="font-headline-sm text-headline-sm mb-1">Sophia Chen</h4>
              <span className="font-label-caps text-label-caps text-secondary uppercase tracking-widest">Dermal Expert</span>
            </div>
          </div>
        </div>
      </section>

      {/* Booking CTA Section */}
      <section className="relative py-section-gap">
        <div className="absolute inset-0 bg-primary-container -z-10"></div>
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop text-center">
          <h2 className="font-display-lg text-display-lg text-white mb-4">Secure Your Moment</h2>
          <p className="font-body-lg text-on-primary-container max-w-lg mx-auto mb-8">
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
