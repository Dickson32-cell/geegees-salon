"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Appointment {
  id: number;
  service: string;
  serviceId?: number;
  stylist: string;
  appointmentDate: string;
  appointmentTime: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  notes?: string;
  status: string;
  finalPrice?: string;
  revenue?: number;
  createdAt: string;
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showRevenueModal, setShowRevenueModal] = useState(false);
  const [revenueAmount, setRevenueAmount] = useState("");
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    fetchAppointments();
    fetchSettings();

    // Auto-refresh appointments every 30 seconds
    const interval = setInterval(() => {
      fetchAppointments();
    }, 30000); // 30 seconds

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await fetch('/api/appointments');
      if (response.ok) {
        const data = await response.json();
        setAppointments(data);
        setLastUpdated(new Date());
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings');
      if (response.ok) {
        const data = await response.json();
        setWhatsappNumber(data.whatsappNumber || '');
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const updateStatus = async (id: number, newStatus: string, revenue?: number) => {
    try {
      const updateData: any = { status: newStatus };
      if (revenue !== undefined) {
        updateData.revenue = revenue;
      }

      const response = await fetch(`/api/appointments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      });

      if (response.ok) {
        fetchAppointments(); // Refresh the list
      } else {
        alert('Failed to update appointment status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('An error occurred while updating status');
    }
  };

  const handleCompleteBooking = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setRevenueAmount(appointment.finalPrice || '');
    setShowRevenueModal(true);
  };

  const confirmComplete = () => {
    if (!selectedAppointment) return;

    const revenue = parseFloat(revenueAmount);
    if (isNaN(revenue) || revenue <= 0) {
      alert('Please enter a valid revenue amount');
      return;
    }

    updateStatus(selectedAppointment.id, 'completed', revenue);
    setShowRevenueModal(false);
    setSelectedAppointment(null);
    setRevenueAmount('');
  };

  const generateWhatsAppLink = (appointment: Appointment) => {
    if (!whatsappNumber) {
      alert('WhatsApp number not configured. Please go to Settings to add it.');
      return '';
    }

    const message = `New Booking Alert!\n\nCustomer: ${appointment.customerName}\nPhone: ${appointment.customerPhone}\nService: ${appointment.service}\nStylist: ${appointment.stylist}\nDate: ${new Date(appointment.appointmentDate).toLocaleDateString()}\nTime: ${appointment.appointmentTime}\n${appointment.notes ? `Notes: ${appointment.notes}` : ''}`;

    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
  };

  const openWhatsApp = (appointment: Appointment) => {
    const link = generateWhatsAppLink(appointment);
    if (link) {
      window.open(link, '_blank');
    }
  };

  const deleteAppointment = async (id: number, customerName: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete the appointment for ${customerName}?\n\nThis action cannot be undone and will also update the dashboard revenue.`
    );

    if (!confirmed) return;

    try {
      const response = await fetch(`/api/appointments/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Appointment deleted successfully');
        fetchAppointments(); // Refresh the list
      } else {
        alert('Failed to delete appointment');
      }
    } catch (error) {
      console.error('Error deleting appointment:', error);
      alert('An error occurred while deleting the appointment');
    }
  };

  const filteredAppointments = appointments.filter((apt) => {
    const matchesFilter = filter === "all" || apt.status === filter;
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      (apt.customerName || '').toLowerCase().includes(searchLower) ||
      (apt.customerEmail || '').toLowerCase().includes(searchLower) ||
      (apt.service || '').toLowerCase().includes(searchLower) ||
      (apt.customerPhone || '').toLowerCase().includes(searchLower);
    return matchesFilter && matchesSearch;
  });

  const pendingCount = appointments.filter(a => a.status === 'pending').length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'accepted': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'confirmed': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'completed': return 'bg-green-100 text-green-700 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-700 border-red-200';
      case 'cancelled': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            Appointments Management
            {pendingCount > 0 && (
              <span className="bg-red-500 text-white text-sm px-3 py-1 rounded-full">
                {pendingCount} new
              </span>
            )}
          </h1>
          <div className="flex items-center gap-4 mt-2">
            <p className="text-gray-600">Manage all customer bookings and appointments</p>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Auto-refreshing • Last updated: {lastUpdated.toLocaleTimeString()}</span>
            </div>
          </div>
        </div>
        <Link
          href="/admin"
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          Back to Admin
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <input
              type="text"
              placeholder="Search by customer, email, or service..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Appointments</option>
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="rejected">Rejected</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Appointments List */}
      {loading ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <p className="text-gray-500">Loading appointments...</p>
        </div>
      ) : filteredAppointments.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <p className="text-gray-500">No appointments found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAppointments.map((appointment) => (
            <div key={appointment.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{appointment.customerName}</h3>
                  <p className="text-sm text-gray-500">{appointment.customerEmail}</p>
                  <p className="text-sm text-gray-500">{appointment.customerPhone}</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(appointment.status)}`}>
                  {appointment.status.toUpperCase()}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Service</p>
                  <p className="font-medium text-gray-900">{appointment.service}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Stylist</p>
                  <p className="font-medium text-gray-900">{appointment.stylist}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Date & Time</p>
                  <p className="font-medium text-gray-900">
                    {new Date(appointment.appointmentDate).toLocaleDateString()} at {appointment.appointmentTime}
                  </p>
                </div>
              </div>

              {appointment.notes && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Notes</p>
                  <p className="text-sm text-gray-700">{appointment.notes}</p>
                </div>
              )}

              {appointment.revenue && (
                <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-xs text-green-700 uppercase tracking-wide mb-1">Revenue</p>
                  <p className="text-lg font-bold text-green-800">GH₵{appointment.revenue.toFixed(2)}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2">
                {appointment.status === 'pending' && (
                  <>
                    <button
                      onClick={() => updateStatus(appointment.id, 'accepted')}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => updateStatus(appointment.id, 'rejected')}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                    >
                      Reject
                    </button>
                  </>
                )}

                {appointment.status === 'accepted' && (
                  <button
                    onClick={() => updateStatus(appointment.id, 'confirmed')}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                  >
                    Confirm (Send WhatsApp)
                  </button>
                )}

                {appointment.status === 'confirmed' && (
                  <button
                    onClick={() => handleCompleteBooking(appointment)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                  >
                    Mark as Completed
                  </button>
                )}

                {(appointment.status === 'pending' || appointment.status === 'accepted' || appointment.status === 'confirmed') && (
                  <button
                    onClick={() => updateStatus(appointment.id, 'cancelled')}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
                  >
                    Cancel
                  </button>
                )}

                <button
                  onClick={() => openWhatsApp(appointment)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  WhatsApp
                </button>

                <button
                  onClick={() => deleteAppointment(appointment.id, appointment.customerName)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Revenue Modal */}
      {showRevenueModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Complete Booking</h3>
            <p className="text-gray-600 mb-4">
              Enter the final revenue amount for this booking to mark it as completed.
            </p>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Revenue Amount (GH₵)
              </label>
              <input
                type="number"
                step="0.01"
                value={revenueAmount}
                onChange={(e) => setRevenueAmount(e.target.value)}
                placeholder="0.00"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                autoFocus
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={confirmComplete}
                className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
              >
                Confirm Complete
              </button>
              <button
                onClick={() => {
                  setShowRevenueModal(false);
                  setSelectedAppointment(null);
                  setRevenueAmount('');
                }}
                className="flex-1 px-4 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
