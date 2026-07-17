"use client";

import Link from "next/link";
import { useState } from "react";

export default function CareersPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    position: "",
    experience: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, you would send this to your API
    console.log("Career inquiry submitted:", formData);
    setSubmitted(true);

    // Reset form after 3 seconds
    setTimeout(() => {
      setFormData({
        name: "",
        email: "",
        phone: "",
        position: "",
        experience: "",
        message: "",
      });
      setSubmitted(false);
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <main className="pt-24 pb-section-gap">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary-container text-white py-16 md:py-20 px-4">
        <div className="max-w-container-max mx-auto text-center">
          <span className="font-label-caps text-xs md:text-label-caps text-secondary-fixed-dim uppercase tracking-widest mb-4 block">
            Join Our Team
          </span>
          <h1 className="font-display-lg text-4xl md:text-display-lg mb-6">Careers at GeeGees</h1>
          <div className="w-10 h-px bg-secondary-fixed mx-auto mb-6"></div>
          <p className="text-lg md:text-xl max-w-2xl mx-auto text-white/90">
            Be part of a team that's redefining luxury grooming and creating exceptional experiences
          </p>
        </div>
      </section>

      {/* Why Work With Us */}
      <section className="py-12 md:py-20 px-4 md:px-margin-desktop max-w-container-max mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-headline-md text-2xl md:text-headline-md text-primary mb-4">Why Choose GeeGees?</h2>
          <p className="text-on-surface-variant text-lg max-w-3xl mx-auto">
            At GeeGees Unisex Salon, we believe that our team is our greatest asset. We're committed to creating an environment where creativity thrives, skills are nurtured, and excellence is celebrated.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Benefit 1 */}
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow border-t-2 border-secondary">
            <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-headline-sm text-xl text-primary mb-3">Competitive Compensation</h3>
            <p className="text-on-surface-variant">
              We offer competitive salaries, commission-based incentives, and performance bonuses to reward your hard work and dedication.
            </p>
          </div>

          {/* Benefit 2 */}
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow border-t-2 border-secondary">
            <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="font-headline-sm text-xl text-primary mb-3">Ongoing Education</h3>
            <p className="text-on-surface-variant">
              Access to advanced training programs, workshops, and industry conferences to keep your skills sharp and stay ahead of trends.
            </p>
          </div>

          {/* Benefit 3 */}
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow border-t-2 border-secondary">
            <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="font-headline-sm text-xl text-primary mb-3">Supportive Culture</h3>
            <p className="text-on-surface-variant">
              Join a team that values collaboration, creativity, and mutual respect. We celebrate each other's successes and support growth.
            </p>
          </div>

          {/* Benefit 4 */}
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow border-t-2 border-secondary">
            <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-headline-sm text-xl text-primary mb-3">Work-Life Balance</h3>
            <p className="text-on-surface-variant">
              Flexible scheduling options, paid time off, and reasonable hours to ensure you maintain a healthy work-life balance.
            </p>
          </div>

          {/* Benefit 5 */}
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow border-t-2 border-secondary">
            <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <h3 className="font-headline-sm text-xl text-primary mb-3">Premium Products</h3>
            <p className="text-on-surface-variant">
              Work with the finest professional-grade products and state-of-the-art equipment to deliver exceptional results.
            </p>
          </div>

          {/* Benefit 6 */}
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow border-t-2 border-secondary">
            <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="font-headline-sm text-xl text-primary mb-3">Career Growth</h3>
            <p className="text-on-surface-variant">
              Clear pathways for advancement from junior stylist to senior positions, with opportunities for leadership roles.
            </p>
          </div>
        </div>
      </section>

      {/* Current Openings */}
      <section className="py-12 md:py-20 px-4 md:px-margin-desktop max-w-container-max mx-auto bg-primary/5">
        <div className="text-center mb-12">
          <h2 className="font-headline-md text-2xl md:text-headline-md text-primary mb-4">Current Opportunities</h2>
          <p className="text-on-surface-variant text-lg max-w-3xl mx-auto">
            We're always looking for talented, passionate individuals to join our team
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Position 1 */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="font-headline-sm text-xl text-primary mb-2">Senior Hair Stylist</h3>
            <p className="text-secondary font-semibold mb-4">Full-time • Experienced</p>
            <p className="text-on-surface-variant mb-4">
              We're seeking an experienced hair stylist with a passion for creative cutting, coloring, and styling. Minimum 5 years of salon experience required.
            </p>
            <ul className="text-on-surface-variant text-sm space-y-1 mb-4">
              <li>• Advanced cutting and coloring skills</li>
              <li>• Strong client communication</li>
              <li>• Up-to-date with current trends</li>
            </ul>
          </div>

          {/* Position 2 */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="font-headline-sm text-xl text-primary mb-2">Nail Technician</h3>
            <p className="text-secondary font-semibold mb-4">Full-time/Part-time • All Levels</p>
            <p className="text-on-surface-variant mb-4">
              Join our team as a nail technician specializing in manicures, pedicures, and nail art. State certification required.
            </p>
            <ul className="text-on-surface-variant text-sm space-y-1 mb-4">
              <li>• Certified nail technician</li>
              <li>• Attention to detail</li>
              <li>• Creative nail art skills</li>
            </ul>
          </div>

          {/* Position 3 */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="font-headline-sm text-xl text-primary mb-2">Makeup Artist</h3>
            <p className="text-secondary font-semibold mb-4">Part-time • Experienced</p>
            <p className="text-on-surface-variant mb-4">
              Talented makeup artist needed for bridal, special events, and everyday beauty. Portfolio required.
            </p>
            <ul className="text-on-surface-variant text-sm space-y-1 mb-4">
              <li>• Professional makeup certification</li>
              <li>• 3+ years of experience</li>
              <li>• Strong portfolio</li>
            </ul>
          </div>

          {/* Position 4 */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="font-headline-sm text-xl text-primary mb-2">Salon Receptionist</h3>
            <p className="text-secondary font-semibold mb-4">Full-time • Entry Level</p>
            <p className="text-on-surface-variant mb-4">
              Front desk receptionist to manage appointments, greet clients, and provide exceptional customer service.
            </p>
            <ul className="text-on-surface-variant text-sm space-y-1 mb-4">
              <li>• Excellent communication skills</li>
              <li>• Computer proficiency</li>
              <li>• Customer service experience</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-12 md:py-20 px-4 md:px-margin-desktop max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-headline-md text-2xl md:text-headline-md text-primary mb-4">Apply Now</h2>
          <p className="text-on-surface-variant text-lg">
            Interested in joining our team? Fill out the form below and we'll be in touch
          </p>
        </div>

        {submitted ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
            <svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="font-headline-sm text-2xl text-green-700 mb-2">Application Submitted!</h3>
            <p className="text-green-600">Thank you for your interest. We'll review your application and get back to you soon.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md">
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-primary mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-secondary"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-primary mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-secondary"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-primary mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-secondary"
                />
              </div>

              <div>
                <label htmlFor="position" className="block text-sm font-semibold text-primary mb-2">
                  Position of Interest *
                </label>
                <select
                  id="position"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-secondary"
                >
                  <option value="">Select a position</option>
                  <option value="Senior Hair Stylist">Senior Hair Stylist</option>
                  <option value="Nail Technician">Nail Technician</option>
                  <option value="Makeup Artist">Makeup Artist</option>
                  <option value="Salon Receptionist">Salon Receptionist</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="experience" className="block text-sm font-semibold text-primary mb-2">
                Years of Experience *
              </label>
              <input
                type="text"
                id="experience"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                required
                placeholder="e.g., 5 years"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-secondary"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="message" className="block text-sm font-semibold text-primary mb-2">
                Tell Us About Yourself *
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={6}
                placeholder="Tell us about your experience, skills, and why you want to join GeeGees..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-secondary resize-none"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-primary text-white px-8 py-4 rounded-lg font-label-caps text-label-caps hover:bg-secondary transition-all shadow-lg"
            >
              Submit Application
            </button>

            <p className="text-sm text-on-surface-variant text-center mt-4">
              You can also email your resume and portfolio to <a href="mailto:careers@geegees.com" className="text-secondary hover:underline">careers@geegees.com</a>
            </p>
          </form>
        )}
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 bg-primary-container/10">
        <div className="max-w-container-max mx-auto px-4 text-center">
          <h2 className="font-display-lg text-3xl md:text-4xl text-primary mb-4">Questions About Careers?</h2>
          <p className="text-lg text-on-surface-variant mb-8">Get in touch with us to learn more about opportunities at GeeGees</p>
          <Link href="/contact">
            <button className="bg-primary text-white px-10 py-4 rounded-lg font-label-caps text-label-caps hover:bg-secondary transition-all shadow-lg">
              Contact Us
            </button>
          </Link>
        </div>
      </section>
    </main>
  );
}
