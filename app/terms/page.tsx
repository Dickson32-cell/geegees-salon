"use client";

import Link from "next/link";

export default function TermsOfServicePage() {
  const currentYear = new Date().getFullYear();

  return (
    <main className="pt-24 pb-section-gap">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary-container text-white py-16 md:py-20 px-4">
        <div className="max-w-container-max mx-auto text-center">
          <span className="font-label-caps text-xs md:text-label-caps text-secondary-fixed-dim uppercase tracking-widest mb-4 block">
            Our Agreement with You
          </span>
          <h1 className="font-display-lg text-4xl md:text-display-lg mb-6">Terms of Service</h1>
          <div className="w-10 h-px bg-secondary-fixed mx-auto mb-6"></div>
          <p className="text-lg md:text-xl max-w-2xl mx-auto text-white/90">
            Last Updated: {currentYear}
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12 md:py-20 px-4 md:px-margin-desktop max-w-4xl mx-auto">
        <div className="prose prose-lg max-w-none">

          {/* Introduction */}
          <div className="mb-12">
            <h2 className="font-headline-md text-2xl md:text-headline-md text-primary mb-4">Agreement to Terms</h2>
            <p className="text-on-surface-variant leading-relaxed mb-4">
              Welcome to GeeGees Unisex Salon. These Terms of Service ("Terms") govern your use of our services, including salon services, website, and booking system. By using our services, you agree to comply with and be bound by these Terms.
            </p>
            <p className="text-on-surface-variant leading-relaxed">
              Please read these Terms carefully before using our services. If you do not agree to these Terms, please do not use our services.
            </p>
          </div>

          {/* Services */}
          <div className="mb-12">
            <h2 className="font-headline-md text-2xl md:text-headline-md text-primary mb-4">Our Services</h2>
            <p className="text-on-surface-variant leading-relaxed mb-3">
              GeeGees Unisex Salon provides professional beauty and grooming services, including but not limited to:
            </p>
            <ul className="list-disc pl-6 text-on-surface-variant space-y-2">
              <li>Hair styling, cutting, and coloring</li>
              <li>Nail care and manicure services</li>
              <li>Makeup application and consultations</li>
              <li>Spa treatments and skincare services</li>
              <li>Other beauty and wellness services as advertised</li>
            </ul>
          </div>

          {/* Appointments and Bookings */}
          <div className="mb-12">
            <h2 className="font-headline-md text-2xl md:text-headline-md text-primary mb-4">Appointments and Bookings</h2>

            <h3 className="font-headline-sm text-xl text-primary mb-3 mt-6">Booking Appointments</h3>
            <ul className="list-disc pl-6 text-on-surface-variant space-y-2 mb-4">
              <li>Appointments can be booked online through our website, by phone, or in person</li>
              <li>All appointments are subject to availability</li>
              <li>We recommend booking in advance to secure your preferred date and time</li>
              <li>You will receive a confirmation of your appointment via email or SMS</li>
            </ul>

            <h3 className="font-headline-sm text-xl text-primary mb-3 mt-6">Cancellation Policy</h3>
            <ul className="list-disc pl-6 text-on-surface-variant space-y-2 mb-4">
              <li>Cancellations must be made at least <strong>24 hours in advance</strong></li>
              <li>Late cancellations (less than 24 hours) may incur a cancellation fee of up to 50% of the service cost</li>
              <li>No-shows will be charged the full service amount</li>
              <li>Repeated cancellations or no-shows may result in a requirement to prepay for future appointments</li>
            </ul>

            <h3 className="font-headline-sm text-xl text-primary mb-3 mt-6">Late Arrivals</h3>
            <p className="text-on-surface-variant leading-relaxed">
              We understand that delays happen. However, arriving more than 15 minutes late may result in a shortened service time or rescheduling of your appointment. You will still be charged the full service amount if we are unable to accommodate the full service.
            </p>
          </div>

          {/* Pricing and Payment */}
          <div className="mb-12">
            <h2 className="font-headline-md text-2xl md:text-headline-md text-primary mb-4">Pricing and Payment</h2>
            <ul className="list-disc pl-6 text-on-surface-variant space-y-2">
              <li>All prices are listed in local currency and are subject to change without notice</li>
              <li>Payment is due at the time of service unless otherwise arranged</li>
              <li>We accept cash, credit cards, debit cards, and digital payment methods</li>
              <li>Prices may vary based on the stylist's experience level and service complexity</li>
              <li>Additional charges may apply for specialized treatments or premium products</li>
              <li>Gratuities are appreciated but not mandatory; suggested gratuity is 15-20%</li>
            </ul>
          </div>

          {/* Client Responsibilities */}
          <div className="mb-12">
            <h2 className="font-headline-md text-2xl md:text-headline-md text-primary mb-4">Client Responsibilities</h2>
            <p className="text-on-surface-variant leading-relaxed mb-3">
              As a client of GeeGees Unisex Salon, you agree to:
            </p>
            <ul className="list-disc pl-6 text-on-surface-variant space-y-2">
              <li>Provide accurate information during booking and consultations</li>
              <li>Disclose any allergies, sensitivities, or medical conditions that may affect services</li>
              <li>Arrive on time for your scheduled appointments</li>
              <li>Treat our staff and other clients with respect and courtesy</li>
              <li>Follow aftercare instructions provided by your stylist</li>
              <li>Communicate any concerns or dissatisfaction during or immediately after your service</li>
            </ul>
          </div>

          {/* Service Results */}
          <div className="mb-12">
            <h2 className="font-headline-md text-2xl md:text-headline-md text-primary mb-4">Service Results and Satisfaction</h2>
            <p className="text-on-surface-variant leading-relaxed mb-4">
              While we strive for excellence in every service, results may vary based on individual factors such as hair type, skin condition, and personal care routines.
            </p>
            <ul className="list-disc pl-6 text-on-surface-variant space-y-2 mb-4">
              <li>We encourage open communication during your service to ensure satisfaction</li>
              <li>If you are not satisfied with your service, please inform us within 7 days</li>
              <li>We offer complimentary corrections or adjustments for services performed by our salon</li>
              <li>Refunds are evaluated on a case-by-case basis and are at our discretion</li>
              <li>We are not responsible for correcting work performed by other salons</li>
            </ul>
          </div>

          {/* Health and Safety */}
          <div className="mb-12">
            <h2 className="font-headline-md text-2xl md:text-headline-md text-primary mb-4">Health and Safety</h2>
            <p className="text-on-surface-variant leading-relaxed mb-4">
              Your safety is our priority. We maintain the highest standards of hygiene and sanitation:
            </p>
            <ul className="list-disc pl-6 text-on-surface-variant space-y-2 mb-4">
              <li>All tools and equipment are sanitized between clients</li>
              <li>We use professional-grade products from reputable suppliers</li>
              <li>Our stylists are licensed and trained in safety protocols</li>
              <li>Patch tests are available for color services and chemical treatments</li>
            </ul>
            <p className="text-on-surface-variant leading-relaxed">
              Clients with known allergies or sensitivities should request a consultation or patch test before receiving services.
            </p>
          </div>

          {/* Liability */}
          <div className="mb-12">
            <h2 className="font-headline-md text-2xl md:text-headline-md text-primary mb-4">Limitation of Liability</h2>
            <p className="text-on-surface-variant leading-relaxed mb-4">
              To the fullest extent permitted by law, GeeGees Unisex Salon shall not be liable for:
            </p>
            <ul className="list-disc pl-6 text-on-surface-variant space-y-2 mb-4">
              <li>Allergic reactions or adverse effects not disclosed by the client</li>
              <li>Damage to personal belongings left unattended in the salon</li>
              <li>Results affected by client's failure to follow aftercare instructions</li>
              <li>Indirect, incidental, or consequential damages</li>
            </ul>
            <p className="text-on-surface-variant leading-relaxed">
              Our total liability for any claim arising from our services shall not exceed the amount paid for the specific service in question.
            </p>
          </div>

          {/* Property and Conduct */}
          <div className="mb-12">
            <h2 className="font-headline-md text-2xl md:text-headline-md text-primary mb-4">Salon Property and Conduct</h2>
            <ul className="list-disc pl-6 text-on-surface-variant space-y-2">
              <li>We are not responsible for lost, stolen, or damaged personal items</li>
              <li>Children must be supervised at all times</li>
              <li>We reserve the right to refuse service to anyone who is disruptive or disrespectful</li>
              <li>Photography and recording are permitted only with staff consent</li>
              <li>Smoking, vaping, and consumption of alcohol are prohibited on premises</li>
            </ul>
          </div>

          {/* Intellectual Property */}
          <div className="mb-12">
            <h2 className="font-headline-md text-2xl md:text-headline-md text-primary mb-4">Intellectual Property</h2>
            <p className="text-on-surface-variant leading-relaxed mb-4">
              All content on our website and marketing materials, including images, logos, text, and design elements, are the property of GeeGees Unisex Salon and are protected by copyright and trademark laws.
            </p>
            <p className="text-on-surface-variant leading-relaxed">
              You may not use, reproduce, or distribute any content without our express written permission.
            </p>
          </div>

          {/* Gift Cards and Promotions */}
          <div className="mb-12">
            <h2 className="font-headline-md text-2xl md:text-headline-md text-primary mb-4">Gift Cards and Promotions</h2>
            <ul className="list-disc pl-6 text-on-surface-variant space-y-2">
              <li>Gift cards do not expire and can be used for any service</li>
              <li>Gift cards are non-refundable and cannot be redeemed for cash</li>
              <li>Lost or stolen gift cards will not be replaced</li>
              <li>Promotional offers cannot be combined unless explicitly stated</li>
              <li>We reserve the right to modify or cancel promotions at any time</li>
            </ul>
          </div>

          {/* Changes to Terms */}
          <div className="mb-12">
            <h2 className="font-headline-md text-2xl md:text-headline-md text-primary mb-4">Changes to These Terms</h2>
            <p className="text-on-surface-variant leading-relaxed">
              We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting to our website. Your continued use of our services after changes are posted constitutes your acceptance of the revised Terms.
            </p>
          </div>

          {/* Governing Law */}
          <div className="mb-12">
            <h2 className="font-headline-md text-2xl md:text-headline-md text-primary mb-4">Governing Law</h2>
            <p className="text-on-surface-variant leading-relaxed">
              These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which GeeGees Unisex Salon operates, without regard to its conflict of law provisions.
            </p>
          </div>

          {/* Contact */}
          <div className="mb-12">
            <h2 className="font-headline-md text-2xl md:text-headline-md text-primary mb-4">Contact Us</h2>
            <p className="text-on-surface-variant leading-relaxed mb-4">
              If you have any questions about these Terms of Service, please contact us:
            </p>
            <div className="bg-primary/5 p-6 rounded-lg border-l-4 border-secondary">
              <p className="text-on-surface-variant mb-2"><strong>GeeGees Unisex Salon</strong></p>
              <p className="text-on-surface-variant mb-2">Email: concierge@geegees.com</p>
              <p className="text-on-surface-variant mb-2">Phone: +1 (555) 987-6543</p>
              <p className="text-on-surface-variant">
                Location: <a
                  href="https://www.google.com/maps/search/?api=1&query=VH-0080-9786"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-secondary hover:underline"
                >
                  VH-0080-9786 (View on Map)
                </a>
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 bg-primary-container/10">
        <div className="max-w-container-max mx-auto px-4 text-center">
          <h2 className="font-display-lg text-3xl md:text-4xl text-primary mb-4">Ready to Get Started?</h2>
          <p className="text-lg text-on-surface-variant mb-8">Book your appointment and experience the GeeGees difference</p>
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
