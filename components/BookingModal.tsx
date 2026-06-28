"use client";

import { useState, useEffect, useRef } from 'react';

interface Service {
  id: number;
  name: string;
  category: string;
  price: string;
  duration: string;
}

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BookingModal({ isOpen, onClose }: BookingModalProps) {
  const [step, setStep] = useState(1);
  const [services, setServices] = useState<Service[]>([]);
  const [formData, setFormData] = useState({
    service: '',
    stylist: '',
    appointmentDate: '',
    appointmentTime: '',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [bookingId, setBookingId] = useState<number | null>(null);
  const receiptRef = useRef<HTMLDivElement>(null);

  const stylists = ['Any Available', 'Sarah Johnson', 'Michael Chen', 'Emma Williams', 'David Martinez'];

  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM',
    '05:00 PM', '06:00 PM', '07:00 PM'
  ];

  useEffect(() => {
    if (isOpen) {
      fetchServices();
    }
  }, [isOpen]);

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/services?status=published');
      if (response.ok) {
        const data = await response.json();
        setServices(data);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const handleNext = () => {
    // Validation for each step
    if (step === 1 && !formData.service) {
      setError('Please select a service');
      return;
    }
    if (step === 2 && !formData.stylist) {
      setError('Please select a stylist');
      return;
    }
    if (step === 3 && (!formData.appointmentDate || !formData.appointmentTime)) {
      setError('Please select date and time');
      return;
    }
    if (step === 4 && (!formData.customerName || !formData.customerPhone)) {
      setError('Please provide your name and phone number');
      return;
    }

    setError('');
    setStep(step + 1);
  };

  const handleBack = () => {
    setError('');
    setStep(step - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          status: 'pending'
        })
      });

      if (response.ok) {
        const data = await response.json();
        setBookingId(data.id);
        setStep(6); // Move to receipt step
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to submit booking');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep(1);
    setFormData({
      service: '',
      stylist: '',
      appointmentDate: '',
      appointmentTime: '',
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      notes: ''
    });
    setError('');
    setBookingId(null);
    onClose();
  };

  const downloadPDF = async () => {
    if (!receiptRef.current) return;

    try {
      // Dynamic imports to avoid SSR issues
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');

      // Capture the receipt as canvas
      const canvas = await html2canvas(receiptRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      // Calculate dimensions
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Create PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgData = canvas.toDataURL('image/png');

      // Add image to PDF
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

      // Download the PDF
      const filename = `GeeGees-Booking-${bookingId?.toString().padStart(6, '0')}.pdf`;
      pdf.save(filename);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Unable to generate PDF. Please try printing instead or contact support.');
    }
  };

  if (!isOpen) return null;

  const selectedService = services.find(s => s.id === parseInt(formData.service));

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-xl sm:rounded-2xl max-w-2xl w-full my-4 sm:my-8 shadow-2xl">
        {/* Header */}
        <div className="bg-primary text-white p-4 sm:p-6 rounded-t-xl sm:rounded-t-2xl">
          <div className="flex justify-between items-center">
            <h2 className="text-xl sm:text-2xl font-bold">Book Your Appointment</h2>
            <button onClick={handleClose} className="text-white/80 hover:text-white text-3xl leading-none">×</button>
          </div>

          {/* Progress Bar */}
          <div className="mt-6 flex items-center justify-between">
            {[1, 2, 3, 4, 5].map((num) => (
              <div key={num} className="flex items-center flex-1">
                <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold ${
                  step >= num ? 'bg-secondary text-black' : 'bg-white/20 text-white/60'
                }`}>
                  {step === 6 && num === 5 ? '✓' : num}
                </div>
                {num < 5 && (
                  <div className={`flex-1 h-1 mx-1 sm:mx-2 ${
                    step > num ? 'bg-secondary' : 'bg-white/20'
                  }`} />
                )}
              </div>
            ))}
          </div>

          <div className="mt-3 text-xs sm:text-sm text-white/80 text-center">
            {step === 1 && 'Select Service'}
            {step === 2 && 'Choose Stylist'}
            {step === 3 && 'Pick Date & Time'}
            {step === 4 && 'Your Information'}
            {step === 5 && 'Review & Confirm'}
            {step === 6 && 'Booking Confirmed'}
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 min-h-[300px] sm:min-h-[400px]">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          {/* Step 1: Select Service */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold mb-4">Select a Service</h3>
              <div className="grid gap-3 max-h-[400px] overflow-y-auto">
                {services.map((service) => (
                  <label
                    key={service.id}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      formData.service === service.id.toString()
                        ? 'border-secondary bg-secondary/5'
                        : 'border-gray-200 hover:border-secondary/50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="service"
                      value={service.id}
                      checked={formData.service === service.id.toString()}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                      className="sr-only"
                    />
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-semibold text-gray-900">{service.name}</div>
                        <div className="text-sm text-gray-500">{service.category}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-secondary">{service.price}</div>
                        <div className="text-sm text-gray-500">{service.duration}</div>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Choose Stylist */}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold mb-4">Choose Your Stylist</h3>
              <div className="grid gap-3">
                {stylists.map((stylist) => (
                  <label
                    key={stylist}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      formData.stylist === stylist
                        ? 'border-secondary bg-secondary/5'
                        : 'border-gray-200 hover:border-secondary/50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="stylist"
                      value={stylist}
                      checked={formData.stylist === stylist}
                      onChange={(e) => setFormData({ ...formData, stylist: e.target.value })}
                      className="sr-only"
                    />
                    <div className="font-medium text-gray-900">{stylist}</div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Date & Time */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
                <input
                  type="date"
                  value={formData.appointmentDate}
                  onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Time</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[280px] overflow-y-auto">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => setFormData({ ...formData, appointmentTime: time })}
                      className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                        formData.appointmentTime === time
                          ? 'bg-secondary text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Contact Information */}
          {step === 4 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold mb-4">Your Information</h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                <input
                  type="text"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number (WhatsApp) *</label>
                <input
                  type="tel"
                  value={formData.customerPhone}
                  onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary"
                  placeholder="+233 XX XXX XXXX"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email (Optional)</label>
                <input
                  type="email"
                  value={formData.customerEmail}
                  onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Special Requests (Optional)</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary"
                  rows={3}
                  placeholder="Any special requests or notes..."
                />
              </div>
            </div>
          )}

          {/* Step 5: Review & Confirm */}
          {step === 5 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold mb-4">Review Your Booking</h3>

              <div className="bg-gray-50 rounded-lg p-6 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Service:</span>
                  <span className="font-semibold">{selectedService?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Price:</span>
                  <span className="font-semibold text-secondary">{selectedService?.price}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-semibold">{selectedService?.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Stylist:</span>
                  <span className="font-semibold">{formData.stylist}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-semibold">{new Date(formData.appointmentDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Time:</span>
                  <span className="font-semibold">{formData.appointmentTime}</span>
                </div>
                <hr className="my-3" />
                <div className="flex justify-between">
                  <span className="text-gray-600">Name:</span>
                  <span className="font-semibold">{formData.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Phone:</span>
                  <span className="font-semibold">{formData.customerPhone}</span>
                </div>
                {formData.customerEmail && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-semibold">{formData.customerEmail}</span>
                  </div>
                )}
                {formData.notes && (
                  <div>
                    <span className="text-gray-600 block mb-1">Notes:</span>
                    <p className="text-sm bg-white p-3 rounded">{formData.notes}</p>
                  </div>
                )}
              </div>

              <p className="text-sm text-gray-600 text-center">
                We'll send you a WhatsApp confirmation shortly
              </p>
            </div>
          )}

          {/* Step 6: Booking Receipt/Confirmation */}
          {step === 6 && (
            <div className="space-y-6" ref={receiptRef}>
              {/* Success Icon */}
              <div className="text-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 sm:w-12 sm:h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h3>
                <p className="text-gray-600 text-sm sm:text-base">Your appointment has been successfully booked</p>
              </div>

              {/* Receipt Card */}
              <div className="bg-gradient-to-br from-gray-50 to-white border-2 border-secondary/20 rounded-lg p-4 sm:p-6">
                <div className="flex justify-between items-start mb-4 pb-4 border-b border-gray-200">
                  <div>
                    <h4 className="text-lg font-bold text-gray-900">GeeGees Unisex Salon</h4>
                    <p className="text-xs text-gray-500">Booking Receipt</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Booking ID</p>
                    <p className="text-sm font-bold text-secondary">#{bookingId?.toString().padStart(6, '0')}</p>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Service:</span>
                    <span className="font-semibold text-gray-900">{selectedService?.name}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Stylist:</span>
                    <span className="font-semibold text-gray-900">{formData.stylist}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-semibold text-gray-900">{new Date(formData.appointmentDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Time:</span>
                    <span className="font-semibold text-gray-900">{formData.appointmentTime}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-semibold text-gray-900">{selectedService?.duration}</span>
                  </div>
                </div>

                <div className="pt-4 border-t-2 border-secondary/30">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">Estimated Price:</span>
                    <span className="text-2xl font-bold text-secondary">{selectedService?.price}</span>
                  </div>
                </div>
              </div>

              {/* Client Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h5 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  What's Next?
                </h5>
                <ul className="text-sm text-blue-800 space-y-1 ml-7">
                  <li>• A confirmation message will be sent to: <strong>{formData.customerPhone}</strong></li>
                  <li>• Please save your Booking ID for reference</li>
                  <li>• Our team will confirm your appointment via WhatsApp</li>
                  <li>• Arrive 10 minutes early for your appointment</li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={downloadPDF}
                  className="flex-1 px-4 py-3 bg-white border-2 border-secondary text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download PDF Receipt
                </button>
                <button
                  onClick={handleClose}
                  className="flex-1 px-4 py-3 bg-secondary text-black rounded-lg font-medium hover:bg-secondary/90 transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {step !== 6 && (
          <div className="p-4 sm:p-6 bg-gray-50 rounded-b-xl sm:rounded-b-2xl flex justify-between gap-3">
            {step > 1 && (
              <button
                onClick={handleBack}
                className="px-4 sm:px-6 py-2.5 sm:py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium text-sm sm:text-base hover:bg-gray-100 transition-colors"
              >
                Back
              </button>
            )}

            {step < 5 ? (
              <button
                onClick={handleNext}
                className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-secondary text-black rounded-lg font-medium text-sm sm:text-base hover:bg-secondary/90 transition-colors ml-auto"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-secondary text-black rounded-lg font-medium text-sm sm:text-base hover:bg-secondary/90 transition-colors disabled:opacity-50 ml-auto"
              >
                {loading ? 'Submitting...' : 'Confirm Booking'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
