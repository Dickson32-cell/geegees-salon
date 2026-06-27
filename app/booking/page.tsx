"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { BookingServiceSkeleton } from "@/components/LoadingSkeleton";

interface Service {
  id: number;
  name: string;
  category: string;
  price: string;
  duration: string;
  description?: string;
}

export default function BookingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [formData, setFormData] = useState({
    service: "",
    stylist: "",
    date: "",
    time: "",
    name: "",
    email: "",
    phone: "",
    notes: "",
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      // Only fetch published services for booking
      const response = await fetch('/api/services?status=published');
      if (!response.ok) {
        throw new Error('Failed to fetch services');
      }
      const data = await response.json();
      setServices(data);
      setError("");
    } catch (error) {
      console.error('Error fetching services:', error);
      setError("Unable to load services. Please refresh the page.");
    } finally {
      setLoading(false);
    }
  };

  const validateStep = () => {
    setError("");

    switch (currentStep) {
      case 1:
        if (!formData.service) {
          setError("Please select a service to continue");
          return false;
        }
        break;
      case 2:
        if (!formData.stylist) {
          setError("Please select a stylist to continue");
          return false;
        }
        break;
      case 3:
        if (!formData.date) {
          setError("Please select a date");
          return false;
        }
        if (!formData.time) {
          setError("Please select a time slot");
          return false;
        }
        break;
      case 4:
        if (!formData.name || !formData.email || !formData.phone) {
          setError("Please fill in all required fields");
          return false;
        }
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
          setError("Please enter a valid email address");
          return false;
        }
        break;
    }
    return true;
  };

  const handleNextStep = () => {
    if (validateStep()) {
      setCurrentStep(Math.min(4, currentStep + 1));
    }
  };

  const stylists = [
    { name: "Julian Marc", title: "Master Stylist" },
    { name: "Elena Rossi", title: "Artistic Director" },
    { name: "Marcus Thorne", title: "Lead Barber" },
    { name: "Sophia Chen", title: "Dermal Expert" },
  ];

  const timeSlots = ["9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM"];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Booking submitted:", formData);
    alert("Your appointment has been successfully booked! We'll send you a confirmation email shortly.");
  };

  return (
    <main className="pt-32 pb-section-gap min-h-screen px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
      {/* Editorial Header Section */}
      <section className="mb-stack-lg text-center">
        <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg mb-4">Reserve Your Experience</h1>
        <div className="w-10 h-[1px] bg-secondary mx-auto mb-6"></div>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">
          Step into a world of curated beauty. Select your desired treatments and let our editorial experts transform your vision into reality.
        </p>
      </section>

      {/* Multi-Step Booking Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
        {/* Step Navigation Sidebar (Desktop) */}
        <aside className="hidden lg:block lg:col-span-3 sticky top-32 space-y-stack-md">
          <div className="p-6 bg-white border border-secondary/10 rounded-lg shadow-sm">
            <h3 className="font-label-caps text-label-caps text-secondary mb-stack-md">YOUR JOURNEY</h3>
            <ul className="space-y-4">
              <li className={`flex items-center gap-3 ${currentStep >= 1 ? "text-secondary font-bold" : "text-on-surface-variant/40"}`}>
                <span className={`w-8 h-8 rounded-full ${currentStep >= 1 ? "border-2 border-secondary bg-secondary/10" : "border border-outline-variant"} flex items-center justify-center text-xs`}>
                  01
                </span>
                <span className="font-label-caps">Service Selection</span>
              </li>
              <li className={`flex items-center gap-3 ${currentStep >= 2 ? "text-secondary font-bold" : "text-on-surface-variant/40"}`}>
                <span className={`w-8 h-8 rounded-full ${currentStep >= 2 ? "border-2 border-secondary bg-secondary/10" : "border border-outline-variant"} flex items-center justify-center text-xs`}>
                  02
                </span>
                <span className="font-label-caps">Expert Stylist</span>
              </li>
              <li className={`flex items-center gap-3 ${currentStep >= 3 ? "text-secondary font-bold" : "text-on-surface-variant/40"}`}>
                <span className={`w-8 h-8 rounded-full ${currentStep >= 3 ? "border-2 border-secondary bg-secondary/10" : "border border-outline-variant"} flex items-center justify-center text-xs`}>
                  03
                </span>
                <span className="font-label-caps">Date & Time</span>
              </li>
              <li className={`flex items-center gap-3 ${currentStep >= 4 ? "text-secondary font-bold" : "text-on-surface-variant/40"}`}>
                <span className={`w-8 h-8 rounded-full ${currentStep >= 4 ? "border-2 border-secondary bg-secondary/10" : "border border-outline-variant"} flex items-center justify-center text-xs`}>
                  04
                </span>
                <span className="font-label-caps">Confirmation</span>
              </li>
            </ul>
          </div>

          <div className="overflow-hidden rounded-lg aspect-[3/4] relative group">
            <div
              className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110 bg-cover bg-center"
              style={{
                backgroundImage: "url('https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=2574')",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent flex flex-col justify-end p-6">
              <p className="text-white font-display-lg text-headline-sm italic">&quot;The Art of Grooming&quot;</p>
            </div>
          </div>
        </aside>

        {/* Main Booking Interface */}
        <div className="lg:col-span-9 bg-white border border-secondary/10 rounded-lg shadow-sm min-h-[600px] flex flex-col">
          {/* Progress Bar (Mobile/Internal) */}
          <div className="w-full h-1 bg-surface-container">
            <div className="h-full bg-secondary-container transition-all duration-500" style={{ width: `${(currentStep / 4) * 100}%` }}></div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mx-8 mt-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div>
                <h4 className="font-semibold text-red-800 text-sm">Validation Error</h4>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Content Area */}
          <form onSubmit={handleSubmit} className="p-stack-lg flex-grow">
            {/* Step 1: Service Selection */}
            {currentStep === 1 && (
              <div className="step-content">
                <div className="flex flex-col md:flex-row justify-between items-baseline mb-stack-lg border-b border-secondary/10 pb-4">
                  <h2 className="font-headline-md text-headline-md text-primary">Service Selection</h2>
                  <span className="font-label-caps text-on-surface-variant italic">1 of 4: What can we do for you?</span>
                </div>

                <div className="space-y-4">
                  <h3 className="font-label-caps text-secondary mb-4">AVAILABLE TREATMENTS</h3>
                  {loading ? (
                    <>
                      {Array.from({ length: 4 }).map((_, idx) => (
                        <BookingServiceSkeleton key={idx} />
                      ))}
                    </>
                  ) : services.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-on-surface-variant">No services available yet. Please check back later!</p>
                    </div>
                  ) : (
                    services.map((service) => (
                      <div
                        key={service.id}
                        onClick={() => setFormData({ ...formData, service: service.name })}
                        className={`flex items-center justify-between p-6 rounded-lg cursor-pointer transition-all ${
                          formData.service === service.name
                            ? "bg-white border-2 border-secondary ring-2 ring-secondary/20"
                            : "bg-surface-container-low border border-transparent hover:border-secondary/30"
                        }`}
                      >
                        <div className="flex items-center gap-stack-md">
                          <div className={`w-12 h-12 rounded flex items-center justify-center ${formData.service === service.name ? "bg-secondary-container/20" : "bg-white"}`}>
                            <svg className="w-6 h-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <div>
                            <p className="font-headline-sm text-body-lg text-primary">{service.name}</p>
                            <div className="flex items-center gap-2">
                              <span className="inline-block px-2 py-0.5 bg-secondary/10 text-secondary rounded text-xs font-bold uppercase">
                                {service.category}
                              </span>
                              <span className="font-body-md text-on-surface-variant">{service.duration}</span>
                            </div>
                            {service.description && (
                              <p className="font-body-md text-on-surface-variant text-sm mt-1">{service.description}</p>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-display-lg text-headline-sm text-primary">{service.price}</p>
                          {formData.service === service.name && (
                            <span className="flex items-center justify-end text-secondary gap-1 font-label-caps font-bold text-xs">
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              SELECTED
                            </span>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Step 2: Stylist Selection */}
            {currentStep === 2 && (
              <div className="step-content">
                <div className="flex flex-col md:flex-row justify-between items-baseline mb-stack-lg border-b border-secondary/10 pb-4">
                  <h2 className="font-headline-md text-headline-md text-primary">Choose Your Expert</h2>
                  <span className="font-label-caps text-on-surface-variant italic">2 of 4: Select your stylist</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {stylists.map((stylist, idx) => (
                    <div
                      key={idx}
                      onClick={() => setFormData({ ...formData, stylist: stylist.name })}
                      className={`cursor-pointer rounded-lg overflow-hidden transition-all ${
                        formData.stylist === stylist.name ? "ring-2 ring-secondary" : ""
                      }`}
                    >
                      <div className="aspect-[3/4] overflow-hidden">
                        <div
                          className="w-full h-full bg-cover bg-center hover:scale-105 transition-transform duration-500"
                          style={{
                            backgroundImage: `url('https://images.unsplash.com/photo-${
                              idx === 0 ? "1507003211169-0a1dd7228f2d" : idx === 1 ? "1494790108377-be9c29b29330" : idx === 2 ? "1500648767791-00dcc994a43e" : "1534528741775-53994a69daeb"
                            }?q=80&w=2574')`,
                          }}
                        />
                      </div>
                      <div className={`p-4 ${formData.stylist === stylist.name ? "bg-secondary-container/20" : "bg-white"}`}>
                        <h4 className="font-headline-sm text-headline-sm mb-1">{stylist.name}</h4>
                        <span className="font-label-caps text-label-caps text-secondary uppercase tracking-widest">{stylist.title}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Date & Time */}
            {currentStep === 3 && (
              <div className="step-content">
                <div className="flex flex-col md:flex-row justify-between items-baseline mb-stack-lg border-b border-secondary/10 pb-4">
                  <h2 className="font-headline-md text-headline-md text-primary">Select Date & Time</h2>
                  <span className="font-label-caps text-on-surface-variant italic">3 of 4: Choose your slot</span>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block font-label-caps text-[10px] uppercase text-secondary mb-2">Preferred Date</label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full border-b-2 border-primary py-3 font-body-md focus:border-secondary focus:outline-none transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-label-caps text-[10px] uppercase text-secondary mb-4">Available Time Slots</label>
                    <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                      {timeSlots.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setFormData({ ...formData, time: slot })}
                          className={`py-3 px-4 rounded-lg font-label-caps text-label-caps transition-all ${
                            formData.time === slot
                              ? "bg-primary text-white"
                              : "bg-surface-container-low hover:bg-surface-container-high"
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Contact Information */}
            {currentStep === 4 && (
              <div className="step-content">
                <div className="flex flex-col md:flex-row justify-between items-baseline mb-stack-lg border-b border-secondary/10 pb-4">
                  <h2 className="font-headline-md text-headline-md text-primary">Your Details</h2>
                  <span className="font-label-caps text-on-surface-variant italic">4 of 4: Almost there!</span>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block font-label-caps text-[10px] uppercase text-secondary mb-2">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className="w-full border-b-2 border-primary py-3 font-body-md focus:border-secondary focus:outline-none transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-label-caps text-[10px] uppercase text-secondary mb-2">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      className="w-full border-b-2 border-primary py-3 font-body-md focus:border-secondary focus:outline-none transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-label-caps text-[10px] uppercase text-secondary mb-2">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="(555) 123-4567"
                      className="w-full border-b-2 border-primary py-3 font-body-md focus:border-secondary focus:outline-none transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-label-caps text-[10px] uppercase text-secondary mb-2">Special Notes (Optional)</label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      rows={3}
                      placeholder="Any special requests or preferences..."
                      className="w-full border-b-2 border-primary py-3 font-body-md focus:border-secondary focus:outline-none transition-colors resize-none"
                    />
                  </div>
                </div>
              </div>
            )}
          </form>

          {/* Action Footer */}
          <div className="p-8 border-t border-secondary/10 bg-surface-container-lowest flex justify-between items-center rounded-b-lg">
            <button
              type="button"
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              className="px-6 py-3 font-label-caps text-secondary hover:underline transition-all"
              disabled={currentStep === 1}
            >
              {currentStep === 1 ? "CANCEL" : "BACK"}
            </button>
            <div className="flex items-center gap-stack-md">
              <div className="hidden md:block text-right mr-4">
                <p className="font-label-caps text-on-surface-variant">STEP {currentStep} OF 4</p>
              </div>
              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="px-10 py-3 bg-primary text-white font-label-caps tracking-widest rounded shadow-lg hover:shadow-secondary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2"
                >
                  CONTINUE
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              ) : (
                <button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="px-10 py-3 bg-primary text-white font-label-caps tracking-widest rounded shadow-lg hover:shadow-secondary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'SUBMITTING...' : 'CONFIRM APPOINTMENT'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Trust / Features Section */}
      <section className="mt-section-gap grid grid-cols-1 md:grid-cols-3 gap-gutter text-center border-t border-secondary/10 pt-section-gap">
        <div className="space-y-2">
          <svg className="w-12 h-12 text-secondary mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
          <h4 className="font-headline-sm text-primary">Master Artists</h4>
          <p className="font-body-md text-on-surface-variant px-8">Every GeeGees expert is trained in high-fashion editorial techniques.</p>
        </div>

        <div className="space-y-2">
          <svg className="w-12 h-12 text-secondary mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h4 className="font-headline-sm text-primary">Organic Luxury</h4>
          <p className="font-body-md text-on-surface-variant px-8">We exclusively use sustainably sourced, premium editorial products.</p>
        </div>

        <div className="space-y-2">
          <svg className="w-12 h-12 text-secondary mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h4 className="font-headline-sm text-primary">Flexible Concierge</h4>
          <p className="font-body-md text-on-surface-variant px-8">Seamlessly reschedule or cancel your journey up to 24 hours prior.</p>
        </div>
      </section>
    </main>
  );
}
