"use client";

import { mockAnalytics, mockAppointments } from "@/lib/data/mockData";
import Link from "next/link";

export default function Dashboard() {
  const stats = [
    {
      name: "Today's Appointments",
      value: mockAnalytics.todayAppointments,
      icon: "📅",
      color: "from-blue-500 to-blue-600",
    },
    {
      name: "Pending Bookings",
      value: mockAnalytics.pendingBookings,
      icon: "⏳",
      color: "from-yellow-500 to-orange-500",
    },
    {
      name: "Monthly Revenue",
      value: `₵${mockAnalytics.monthlyRevenue.toLocaleString()}`,
      icon: "💰",
      color: "from-green-500 to-emerald-600",
    },
    {
      name: "Total Customers",
      value: mockAnalytics.totalCustomers,
      icon: "👥",
      color: "from-purple-500 to-pink-500",
    },
  ];

  const recentAppointments = mockAppointments.slice(0, 5);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.name}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`text-4xl bg-gradient-to-br ${stat.color} w-16 h-16 rounded-xl flex items-center justify-center shadow-lg`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Monthly Revenue</h2>
          <div className="space-y-3">
            {mockAnalytics.revenueByMonth.map((item, idx) => (
              <div key={idx} className="flex items-center">
                <span className="w-12 text-sm text-gray-600">{item.month}</span>
                <div className="flex-1 mx-4">
                  <div className="bg-gray-200 rounded-full h-8 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-primary-500 to-pink-500 h-full rounded-full flex items-center justify-end pr-3 text-white text-sm font-semibold"
                      style={{ width: `${(item.revenue / 20000) * 100}%` }}
                    >
                      ₵{item.revenue.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Services */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Top Services</h2>
          <div className="space-y-4">
            {mockAnalytics.topServices.map((service, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600 font-bold">
                    {idx + 1}
                  </div>
                  <span className="font-medium text-gray-900">{service.name}</span>
                </div>
                <span className="text-2xl font-bold text-primary-600">{service.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Appointments */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Recent Appointments</h2>
          <Link href="/admin/appointments" className="text-primary-600 hover:text-primary-700 font-medium">
            View All →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Customer</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Service</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Date & Time</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentAppointments.map((appointment) => (
                <tr key={appointment.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div>
                      <p className="font-medium text-gray-900">{appointment.customerName}</p>
                      <p className="text-sm text-gray-500">{appointment.email}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-gray-700">{appointment.service}</td>
                  <td className="py-4 px-4">
                    <div>
                      <p className="text-gray-900">{appointment.date}</p>
                      <p className="text-sm text-gray-500">{appointment.time}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      appointment.status === "confirmed"
                        ? "bg-green-100 text-green-700"
                        : appointment.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-100 text-gray-700"
                    }`}>
                      {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
