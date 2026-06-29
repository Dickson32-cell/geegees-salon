"use client";

import { createContext, useContext, useState, ReactNode } from 'react';

interface BookingContextType {
  isBookingModalOpen: boolean;
  preselectedServiceId: string | null;
  openBookingModal: (serviceId?: string) => void;
  closeBookingModal: () => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [preselectedServiceId, setPreselectedServiceId] = useState<string | null>(null);

  const openBookingModal = (serviceId?: string) => {
    setPreselectedServiceId(serviceId || null);
    setIsBookingModalOpen(true);
  };

  const closeBookingModal = () => {
    setIsBookingModalOpen(false);
    setPreselectedServiceId(null);
  };

  return (
    <BookingContext.Provider value={{ isBookingModalOpen, preselectedServiceId, openBookingModal, closeBookingModal }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within BookingProvider');
  }
  return context;
}
