import type { Metadata } from "next";
import { Playfair_Display, Nunito_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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

export const metadata: Metadata = {
  title: "GeeGees Luxury Salon - Opulence & Grace",
  description: "Experience luxury hair and beauty services with our expert stylists. Premium unisex salon offering editorial styling, color, grooming and more.",
  keywords: "luxury salon, hair salon, beauty salon, unisex salon, editorial styling, balayage, spa, grooming",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`scroll-smooth ${playfair.variable} ${nunito.variable}`}>
      <body className="bg-surface text-on-surface font-body-md overflow-x-hidden">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
