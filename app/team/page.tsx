export default function Team() {
  const teamMembers = [
    {
      name: "Sarah Johnson",
      role: "Master Hair Stylist",
      specialty: "Hair Coloring & Balayage",
      experience: "12 years",
      bio: "Sarah specializes in creating stunning color transformations and precision cuts. Her expertise in balayage techniques has earned her recognition as one of the top colorists in the region.",
      initials: "SJ",
      color: "from-pink-500 to-rose-500",
    },
    {
      name: "Michael Chen",
      role: "Senior Stylist",
      specialty: "Men's Grooming & Cuts",
      experience: "10 years",
      bio: "Michael brings modern techniques to classic men's grooming. His attention to detail and understanding of face shapes ensures every client leaves looking their absolute best.",
      initials: "MC",
      color: "from-blue-500 to-cyan-500",
    },
    {
      name: "Elena Rodriguez",
      role: "Spa & Wellness Director",
      specialty: "Facial Treatments & Massage",
      experience: "15 years",
      bio: "Elena's holistic approach to beauty combines traditional spa techniques with modern skincare science. She's passionate about helping clients achieve healthy, glowing skin.",
      initials: "ER",
      color: "from-purple-500 to-pink-500",
    },
    {
      name: "James Wilson",
      role: "Creative Director",
      specialty: "Editorial & Bridal Styling",
      experience: "14 years",
      bio: "James has styled for fashion shows and editorial shoots worldwide. His creative vision and technical expertise make him the go-to stylist for special occasions and bridal events.",
      initials: "JW",
      color: "from-amber-500 to-orange-500",
    },
    {
      name: "Priya Patel",
      role: "Makeup Artist",
      specialty: "Bridal & Special Event Makeup",
      experience: "8 years",
      bio: "Priya's artistry brings out natural beauty while creating stunning transformations. She's known for her flawless bridal makeup and ability to create looks that last all day.",
      initials: "PP",
      color: "from-emerald-500 to-teal-500",
    },
    {
      name: "David Lee",
      role: "Hair Color Specialist",
      specialty: "Color Correction & Highlights",
      experience: "11 years",
      bio: "David is a master at fixing color mishaps and creating beautiful, natural-looking highlights. His clients trust him with even the most challenging color transformations.",
      initials: "DL",
      color: "from-indigo-500 to-purple-500",
    },
  ];

  return (
    <div className="min-h-screen pt-24">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-pink-500 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold font-serif mb-6">Meet Our Team</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Our talented team of professionals is dedicated to making you look and feel amazing
          </p>
        </div>
      </section>

      {/* Team Grid */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group"
              >
                {/* Avatar */}
                <div className="relative h-64 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden">
                  <div className={`w-40 h-40 bg-gradient-to-br ${member.color} rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-xl group-hover:scale-110 transition-transform duration-300`}>
                    {member.initials}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-primary-600 font-semibold mb-2">{member.role}</p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-2 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {member.specialty}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-2 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {member.experience} experience
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm leading-relaxed">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Our Team Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="section-title">Why Our Team Stands Out</h2>
          <p className="section-subtitle">
            We invest in our team so they can invest in you
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="font-bold text-lg mb-2">Continuous Education</h3>
              <p className="text-gray-600 text-sm">Our stylists attend regular training to stay updated with latest trends and techniques</p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h3 className="font-bold text-lg mb-2">Certified Professionals</h3>
              <p className="text-gray-600 text-sm">Every team member holds professional certifications in their specialty areas</p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-lg mb-2">Passionate Artists</h3>
              <p className="text-gray-600 text-sm">We love what we do and it shows in every service we provide</p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-lg mb-2">Client-Focused</h3>
              <p className="text-gray-600 text-sm">Your satisfaction and comfort are our top priorities</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-pink-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Experience Our Expertise?</h2>
          <p className="text-lg mb-8">Book your appointment with one of our talented professionals</p>
          <a href="/booking" className="btn-secondary border-white text-white hover:bg-white hover:text-primary-600">
            Book an Appointment
          </a>
        </div>
      </section>
    </div>
  );
}
