"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { BookingProvider, useBooking } from "@/contexts/BookingContext";
import BookingModal from "@/components/BookingModal";

function TemplateContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isBookingModalOpen, closeBookingModal } = useBooking();

  // Don't show Navbar/Footer on admin pages
  const isAdminPage = pathname?.startsWith("/admin");

  if (isAdminPage) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      {children}
      <Footer />
      <BookingModal isOpen={isBookingModalOpen} onClose={closeBookingModal} />
    </>
  );
}

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <BookingProvider>
      <TemplateContent>{children}</TemplateContent>
    </BookingProvider>
  );
}
