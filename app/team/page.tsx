"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface TeamMember {
  id: number;
  name: string;
  title: string;
  bio: string | null;
  specialties: string[];
  active: boolean;
  photo_url?: string;
}

export default function TeamPage() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeam();
    // Auto-refresh every 30 seconds so admin updates appear without manual reload
    const interval = setInterval(fetchTeam, 30_000);
    return () => clearInterval(interval);
  }, []);

  const fetchTeam = async () => {
    try {
      const response = await fetch('/api/team');
      if (response.ok) {
        const data = await response.json();
        setTeam(data.filter((member: TeamMember) => member.active));
      }
    } catch (error) {
      console.error('Error fetching team:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="pt-24 pb-section-gap">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary-container text-white py-16 md:py-20 px-4">
        <div className="max-w-container-max mx-auto text-center">
          <span className="font-label-caps text-xs md:text-label-caps text-secondary-fixed-dim uppercase tracking-widest mb-4 block">
            The Visionaries Behind Your Beauty
          </span>
          <h1 className="font-display-lg text-4xl md:text-display-lg mb-6">Meet Our Team</h1>
          <div className="w-10 h-px bg-secondary-fixed mx-auto mb-6"></div>
          <p className="text-lg md:text-xl max-w-2xl mx-auto text-white/90">
            Our talented team of professionals is dedicated to making you look and feel amazing
          </p>
        </div>
      </section>

      {/* Team Grid */}
      <section className="py-12 md:py-20 px-4 md:px-margin-desktop max-w-container-max mx-auto">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="bg-gray-200 animate-pulse rounded-lg h-96" />
            ))}
          </div>
        ) : team.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="font-headline-md text-2xl md:text-headline-md text-primary mb-4">Our Team is Growing</h3>
            <p className="text-on-surface-variant text-lg mb-8">We're building an exceptional team of professionals.</p>
            <Link href="/booking">
              <button className="bg-primary text-white px-8 py-3 rounded-lg font-label-caps text-label-caps hover:bg-secondary transition-colors">
                Book an Appointment
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member) => (
              <div
                key={member.id}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group border-t-2 border-secondary"
              >
                {/* Photo / Initials */}
                <div className="relative h-72 bg-gradient-to-br from-primary to-secondary overflow-hidden">
                  {member.photo_url ? (
                    <img
                      src={member.photo_url}
                      alt={member.name}
                      className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-white text-6xl font-bold">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                  )}
                  {/* Gradient overlay at bottom */}
                  <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <p className="text-white font-bold text-lg leading-tight">{member.name}</p>
                    <p className="text-white/80 text-xs uppercase tracking-widest">{member.title}</p>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {member.specialties && member.specialties.length > 0 && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        {member.specialties.map((specialty, idx) => (
                          <span
                            key={idx}
                            className="inline-block px-3 py-1 bg-secondary/10 text-secondary rounded-full text-xs font-semibold"
                          >
                            {specialty}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {member.bio && (
                    <p className="text-on-surface-variant text-sm leading-relaxed line-clamp-3">{member.bio}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="py-12 md:py-16 bg-primary-container/10">
        <div className="max-w-container-max mx-auto px-4 text-center">
          <h2 className="font-display-lg text-3xl md:text-4xl text-primary mb-4">Ready to Experience Our Expertise?</h2>
          <p className="text-lg text-on-surface-variant mb-8">Book your appointment with one of our talented professionals</p>
          <Link href="/booking">
            <button className="bg-primary text-white px-10 py-4 rounded-lg font-label-caps text-label-caps hover:bg-secondary transition-all shadow-lg">
              Book an Appointment
            </button>
          </Link>
        </div>
      </section>
    </main>
  );
}
