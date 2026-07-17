"use client";

import Link from "next/link";

export default function PrivacyPolicyPage() {
  const currentYear = new Date().getFullYear();

  return (
    <main className="pt-24 pb-section-gap">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary-container text-white py-16 md:py-20 px-4">
        <div className="max-w-container-max mx-auto text-center">
          <span className="font-label-caps text-xs md:text-label-caps text-secondary-fixed-dim uppercase tracking-widest mb-4 block">
            Your Privacy Matters
          </span>
          <h1 className="font-display-lg text-4xl md:text-display-lg mb-6">Privacy Policy</h1>
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
            <h2 className="font-headline-md text-2xl md:text-headline-md text-primary mb-4">Introduction</h2>
            <p className="text-on-surface-variant leading-relaxed mb-4">
              At GeeGees Unisex Salon, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our salon or use our services.
            </p>
            <p className="text-on-surface-variant leading-relaxed">
              By using our services, you consent to the data practices described in this policy. If you do not agree with the terms of this Privacy Policy, please do not access our services.
            </p>
          </div>

          {/* Information We Collect */}
          <div className="mb-12">
            <h2 className="font-headline-md text-2xl md:text-headline-md text-primary mb-4">Information We Collect</h2>

            <h3 className="font-headline-sm text-xl text-primary mb-3 mt-6">Personal Information</h3>
            <p className="text-on-surface-variant leading-relaxed mb-3">
              We may collect personal information that you voluntarily provide to us when you:
            </p>
            <ul className="list-disc pl-6 text-on-surface-variant space-y-2 mb-4">
              <li>Book an appointment online or by phone</li>
              <li>Register for an account on our website</li>
              <li>Subscribe to our newsletter or promotional communications</li>
              <li>Participate in surveys or promotional activities</li>
              <li>Contact us with inquiries or feedback</li>
            </ul>
            <p className="text-on-surface-variant leading-relaxed mb-4">
              This information may include: name, email address, phone number, date of birth, payment information, service preferences, and any other information you choose to provide.
            </p>

            <h3 className="font-headline-sm text-xl text-primary mb-3 mt-6">Automatic Information Collection</h3>
            <p className="text-on-surface-variant leading-relaxed mb-3">
              When you visit our website, we may automatically collect certain information about your device, including:
            </p>
            <ul className="list-disc pl-6 text-on-surface-variant space-y-2">
              <li>IP address and browser type</li>
              <li>Operating system and device information</li>
              <li>Pages visited and time spent on our site</li>
              <li>Referring website addresses</li>
            </ul>
          </div>

          {/* How We Use Your Information */}
          <div className="mb-12">
            <h2 className="font-headline-md text-2xl md:text-headline-md text-primary mb-4">How We Use Your Information</h2>
            <p className="text-on-surface-variant leading-relaxed mb-3">
              We use the information we collect to:
            </p>
            <ul className="list-disc pl-6 text-on-surface-variant space-y-2">
              <li>Schedule and confirm appointments</li>
              <li>Process payments for services rendered</li>
              <li>Send appointment reminders and follow-up communications</li>
              <li>Provide personalized service recommendations</li>
              <li>Improve our services and customer experience</li>
              <li>Send promotional offers and newsletters (with your consent)</li>
              <li>Respond to your inquiries and provide customer support</li>
              <li>Comply with legal obligations and prevent fraud</li>
            </ul>
          </div>

          {/* Information Sharing */}
          <div className="mb-12">
            <h2 className="font-headline-md text-2xl md:text-headline-md text-primary mb-4">Information Sharing and Disclosure</h2>
            <p className="text-on-surface-variant leading-relaxed mb-3">
              We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
            </p>
            <ul className="list-disc pl-6 text-on-surface-variant space-y-2">
              <li><strong>Service Providers:</strong> With trusted third-party service providers who assist us in operating our business (payment processors, appointment scheduling systems, email marketing services)</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our rights, safety, or property</li>
              <li><strong>Business Transfers:</strong> In connection with any merger, sale of company assets, or acquisition</li>
              <li><strong>With Your Consent:</strong> When you explicitly authorize us to share your information</li>
            </ul>
          </div>

          {/* Data Security */}
          <div className="mb-12">
            <h2 className="font-headline-md text-2xl md:text-headline-md text-primary mb-4">Data Security</h2>
            <p className="text-on-surface-variant leading-relaxed mb-4">
              We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:
            </p>
            <ul className="list-disc pl-6 text-on-surface-variant space-y-2 mb-4">
              <li>Secure SSL encryption for data transmission</li>
              <li>Regular security assessments and updates</li>
              <li>Restricted access to personal information</li>
              <li>Staff training on data protection practices</li>
            </ul>
            <p className="text-on-surface-variant leading-relaxed">
              However, no method of transmission over the internet or electronic storage is 100% secure. While we strive to protect your personal information, we cannot guarantee its absolute security.
            </p>
          </div>

          {/* Your Rights */}
          <div className="mb-12">
            <h2 className="font-headline-md text-2xl md:text-headline-md text-primary mb-4">Your Privacy Rights</h2>
            <p className="text-on-surface-variant leading-relaxed mb-3">
              You have the right to:
            </p>
            <ul className="list-disc pl-6 text-on-surface-variant space-y-2 mb-4">
              <li><strong>Access:</strong> Request access to the personal information we hold about you</li>
              <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
              <li><strong>Deletion:</strong> Request deletion of your personal information</li>
              <li><strong>Opt-Out:</strong> Unsubscribe from marketing communications at any time</li>
              <li><strong>Data Portability:</strong> Request a copy of your data in a structured format</li>
            </ul>
            <p className="text-on-surface-variant leading-relaxed">
              To exercise any of these rights, please contact us using the information provided below.
            </p>
          </div>

          {/* Cookies */}
          <div className="mb-12">
            <h2 className="font-headline-md text-2xl md:text-headline-md text-primary mb-4">Cookies and Tracking Technologies</h2>
            <p className="text-on-surface-variant leading-relaxed mb-4">
              We use cookies and similar tracking technologies to enhance your browsing experience, analyze site traffic, and understand where our visitors are coming from. You can control cookie preferences through your browser settings.
            </p>
          </div>

          {/* Children's Privacy */}
          <div className="mb-12">
            <h2 className="font-headline-md text-2xl md:text-headline-md text-primary mb-4">Children's Privacy</h2>
            <p className="text-on-surface-variant leading-relaxed">
              Our services are not directed to individuals under the age of 18. We do not knowingly collect personal information from children. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately.
            </p>
          </div>

          {/* Changes to Policy */}
          <div className="mb-12">
            <h2 className="font-headline-md text-2xl md:text-headline-md text-primary mb-4">Changes to This Privacy Policy</h2>
            <p className="text-on-surface-variant leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. We encourage you to review this Privacy Policy periodically for any changes.
            </p>
          </div>

          {/* Contact */}
          <div className="mb-12">
            <h2 className="font-headline-md text-2xl md:text-headline-md text-primary mb-4">Contact Us</h2>
            <p className="text-on-surface-variant leading-relaxed mb-4">
              If you have any questions about this Privacy Policy or our data practices, please contact us:
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
          <h2 className="font-display-lg text-3xl md:text-4xl text-primary mb-4">Ready to Experience Luxury?</h2>
          <p className="text-lg text-on-surface-variant mb-8">Book your appointment today and let us take care of you</p>
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
