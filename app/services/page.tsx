"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { ServiceGridSkeleton } from "@/components/LoadingSkeleton";

interface Service {
  id: number;
  name: string;
  category: string;
  price: string;
  duration: string;
  description?: string;
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
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
      setServices(data);
      setError("");
    } catch (error) {
      console.error('Error fetching services:', error);
      setError("We're having trouble loading our services. Please refresh the page or try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Group services by category
  const groupedServices: Record<string, Service[]> = {};
  services.forEach((service) => {
    if (!groupedServices[service.category]) {
      groupedServices[service.category] = [];
    }
    groupedServices[service.category].push(service);
  });

  return (
    <main className="pt-16 md:pt-24 pb-section-gap">
      {/* Hero Section */}
      <section className="max-w-container-max mx-auto px-4 md:px-margin-desktop mb-8 md:mb-stack-lg">
        <div className="relative overflow-hidden h-[300px] md:h-[400px] flex items-center justify-center text-center rounded-lg">
          <div className="absolute inset-0 bg-primary/40 z-10"></div>
          <div
            className="absolute inset-0 w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=2669')",
            }}
          />
          <div className="relative z-20 max-w-3xl px-4">
            <span className="font-label-caps text-xs md:text-label-caps text-secondary-fixed uppercase tracking-[0.2em] mb-3 md:mb-4 block">
              The Art of Refinement
            </span>
            <h2 className="font-display-lg text-3xl md:text-display-lg text-white mb-4 md:mb-6">Menu of Excellence</h2>
            <div className="w-10 h-px bg-secondary-fixed mx-auto mb-4 md:mb-6"></div>
            <p className="font-body-lg text-sm md:text-body-lg text-white/90 leading-relaxed px-4 md:px-6">
              Explore our curated selection of bespoke grooming and beauty experiences, where precision meets artistry in every detail.
            </p>
          </div>
        </div>
      </section>

      {/* Services Catalog Section - DYNAMIC FROM ADMIN */}
      <section className="max-w-container-max mx-auto px-4 md:px-margin-desktop mt-8 md:mt-section-gap">
        {error && (
          <div className="mb-8 p-6 bg-red-50 border border-red-200 rounded-lg flex items-start gap-4">
            <svg className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div className="flex-1">
              <h4 className="font-semibold text-red-800 mb-1">Unable to Load Services</h4>
              <p className="text-red-700">{error}</p>
              <button
                onClick={fetchServices}
                className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm font-semibold"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <div>
            <div className="text-center mb-12">
              <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4 animate-pulse"></div>
              <div className="w-10 h-[1px] bg-gray-300 mx-auto mt-2"></div>
            </div>
            <ServiceGridSkeleton count={6} />
          </div>
        ) : !error && services.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-on-surface-variant text-lg">No services available yet. Please check back later!</p>
          </div>
        ) : !error ? (
          <div className="space-y-12 md:space-y-section-gap">
            {Object.entries(groupedServices).map(([category, categoryServices]) => (
              <div key={category} className="scroll-mt-24" id={category.toLowerCase()}>
                <div className="text-center mb-8 md:mb-12">
                  <h3 className="font-headline-md text-2xl md:text-headline-md text-primary">{category}</h3>
                  <div className="w-10 h-[1px] bg-secondary mx-auto mt-2"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-gutter">
                  {categoryServices.map((service) => (
                    <div key={service.id} className="bg-white p-6 md:p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow border-t-2 border-secondary">
                      <div className="mb-4">
                        <h4 className="font-headline-sm text-xl md:text-headline-sm text-primary mb-2">{service.name}</h4>
                        <span className="inline-block px-3 py-1 bg-secondary/20 text-secondary rounded-full text-xs font-bold uppercase tracking-wider">
                          {service.category}
                        </span>
                      </div>

                      {service.description && (
                        <p className="font-body-md text-on-surface-variant mb-4">{service.description}</p>
                      )}

                      <div className="flex justify-between items-center pt-4 border-t border-secondary/10">
                        <div>
                          <p className="text-xs text-on-surface-variant uppercase tracking-wide">Price</p>
                          <p className="font-headline-sm text-primary">{service.price}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-on-surface-variant uppercase tracking-wide">Duration</p>
                          <p className="font-body-md text-on-surface">{service.duration}</p>
                        </div>
                      </div>

                      <Link href="/booking" className="block mt-6">
                        <button className="w-full bg-primary text-white py-3 rounded-lg font-label-caps text-label-caps hover:bg-secondary transition-colors">
                          Book Now
                        </button>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : null}

        {/* Call to Action */}
        <div className="mt-12 md:mt-section-gap text-center bg-secondary-container/10 py-12 md:py-16 rounded-lg px-4">
          <h3 className="font-display-lg text-2xl md:text-headline-md text-primary mb-4 md:mb-6">Ready for your transformation?</h3>
          <p className="max-w-xl mx-auto font-body-lg text-sm md:text-base text-on-surface-variant mb-8 md:mb-10">
            Appointments are limited. Secure your editorial experience with GeeGees today and indulge in the luxury you deserve.
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-4 md:gap-stack-md">
            <Link href="/booking">
              <button className="bg-primary text-white px-10 py-4 rounded-lg font-label-caps text-label-caps hover:bg-primary/90 transition-all active:scale-95 shadow-lg">
                Schedule Appointment
              </button>
            </Link>
            <button className="border border-secondary text-secondary px-10 py-4 rounded-lg font-label-caps text-label-caps hover:bg-secondary hover:text-white transition-all active:scale-95">
              Gift a Signature Session
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
