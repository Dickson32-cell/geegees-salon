import type { Metadata, Viewport } from "next";
import { Playfair_Display, Nunito_Sans } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "600", "700"],
  style: ["normal", "italic"]
});

const nunito = Nunito_Sans({
  subsets: ["latin"],
  variable: "--font-nunito",
  weight: ["300", "400", "600", "700"]
});

const siteUrl = "https://geegeessalon.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "GeeGees Luxury Salon - Opulence & Grace | Koforidua, Ghana",
    template: "%s | GeeGees Luxury Salon",
  },
  description:
    "GeeGees Luxury Salon — premium unisex salon in Koforidua, Ghana since 2009. Expert hair styling, color treatments, nails, lashes, braids, locs, facials, spa, makeup, teeth whitening & braces. Book your appointment today.",
  keywords: [
    "salon Koforidua",
    "luxury salon Ghana",
    "unisex salon Koforidua",
    "hair salon Ghana",
    "nail salon Koforidua",
    "lashes Ghana",
    "braids Koforidua",
    "spa Ghana",
    "makeup artist Koforidua",
    "GeeGees salon",
  ],
  authors: [{ name: "GeeGees Luxury Salon" }],
  creator: "GeeGees Luxury Salon",
  publisher: "GeeGees Luxury Salon",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: "website",
    locale: "en_GH",
    url: siteUrl,
    siteName: "GeeGees Luxury Salon",
    title: "GeeGees Luxury Salon - Opulence & Grace | Koforidua, Ghana",
    description:
      "Premium unisex salon in Koforidua since 2009. Hair, nails, lashes, braids, locs, spa, makeup & more. Book your appointment today.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "GeeGees Luxury Salon - Koforidua, Ghana",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GeeGees Luxury Salon - Koforidua, Ghana",
    description:
      "Premium unisex salon in Koforidua since 2009. Hair, nails, lashes, braids, spa, makeup & more. Book your appointment today.",
    images: ["/og-image.jpg"],
  },
  category: "Beauty Salon",
  other: {
    "geo.region": "GH-EP",
    "geo.placename": "Koforidua, Eastern Region, Ghana",
    "geo.position": "6.0833;-0.2667",
    "ICBM": "6.0833, -0.2667",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#1a1a2e",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`scroll-smooth ${playfair.variable} ${nunito.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "HairSalon",
              name: "GeeGees Luxury Salon",
              description:
                "Premium unisex salon in Koforidua, Ghana since 2009. Expert hair styling, color treatments, nails, lashes, braids, locs, facials, spa, makeup, teeth whitening & braces.",
              url: siteUrl,
              telephone: "+233-53-964-9949",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Koforidua",
                addressRegion: "Eastern Region",
                addressCountry: "GH",
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: 6.0833,
                longitude: -0.2667,
              },
              openingHours: [
                {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                  opens: "08:00",
                  closes: "19:00",
                },
                {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: "Sunday",
                  opens: "10:00",
                  closes: "17:00",
                },
              ],
              priceRange: "GH₵ 20 - GH₵ 1000",
              foundingDate: "2009",
              sameAs: [
                "https://www.tiktok.com/@geegeessalon",
              ],
            }),
          }}
        />
      </head>
      <body className="bg-surface text-on-surface font-body-md overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}