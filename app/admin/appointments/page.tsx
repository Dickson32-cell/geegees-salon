"use client";

import { useState } from "react";
import { mockAppointments } from "@/lib/data/mockData";

export default function Appointments() {
  const [appointments, setAppointments] = useState(mockAppointments);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredAppointments = appointments.filter((apt) => {
    const matchesFilter = filter === "all" || apt.status === filter;
    const matchesSearch =
      apt.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.service.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const updateStatus = (id: number, newStatus: string) => {
    setAppointments(
      appointments.map((apt) =>
        apt.id === id ? { ...apt, status: newStatus } : apt
      )
    );
  };

  const deleteAppointment = (id: number) => {
    if (confirm("Are you sure you want to delete this appointment?")) {
      setAppointments(appointments.filter((apt) => apt.id !== id));
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Appointments Management</h1>
        <p className="text-gray-600">Manage all customer appointments</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <input
              type="text"
              placeholder="Search by customer, email, or service..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Appointments</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Appointments Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Customer</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Service</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Stylist</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Date & Time</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Status</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.map((appointment) => (
                <tr key={appointment.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div>
                      <p className="font-medium text-gray-900">{appointment.customerName}</p>
                      <p className="text-sm text-gray-500">{appointment.email}</p>
                      <p className="text-sm text-gray-500">{appointment.phone}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-gray-900">{appointment.service}</p>
                    {appointment.notes && (
                      <p className="text-sm text-gray-500 mt-1">Note: {appointment.notes}</p>
                    )}
                  </td>
                  <td className="py-4 px-6 text-gray-700">{appointment.stylist}</td>
                  <td className="py-4 px-6">
                    <div>
                      <p className="text-gray-900">{appointment.date}</p>
                      <p className="text-sm text-gray-500">{appointment.time}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <select
                      value={appointment.status}
                      onChange={(e) => updateStatus(appointment.id, e.target.value)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold border-0 cursor-pointer ${
                        appointment.status === "confirmed"
                          ? "bg-green-100 text-green-700"
                          : appointment.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="completed">Completed</option>
                    </select>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => alert(`View details for ${appointment.customerName}`)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => deleteAppointment(appointment.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredAppointments.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No appointments found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
