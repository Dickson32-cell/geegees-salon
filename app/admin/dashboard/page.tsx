"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Appointment {
  id: number;
  service: string;
  stylist: string;
  appointmentDate: string;
  appointmentTime: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  status: string;
  revenue?: number;
  createdAt: string;
}

interface Analytics {
  todayAppointments: number;
  pendingBookings: number;
  monthlyRevenue: number;
  totalRevenue: number;
  totalCustomers: number;
  completedBookings: number;
  revenueByMonth: { month: string; revenue: number }[];
  topServices: { name: string; count: number }[];
}

export default function DashboardPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [analytics, setAnalytics] = useState<Analytics>({
    todayAppointments: 0,
    pendingBookings: 0,
    monthlyRevenue: 0,
    totalRevenue: 0,
    totalCustomers: 0,
    completedBookings: 0,
    revenueByMonth: [],
    topServices: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('/api/appointments');
      if (response.ok) {
        const data: Appointment[] = await response.json();
        setAppointments(data);
        calculateAnalytics(data);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateAnalytics = (data: Appointment[]) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);

    // Today's appointments
    const todayAppointments = data.filter(apt => {
      const aptDate = new Date(apt.appointmentDate);
      aptDate.setHours(0, 0, 0, 0);
      return aptDate.getTime() === today.getTime();
    }).length;

    // Pending bookings
    const pendingBookings = data.filter(apt => apt.status === 'pending').length;

    // Completed bookings
    const completedBookings = data.filter(apt => apt.status === 'completed').length;

    // Monthly revenue (current month)
    const monthlyRevenue = data.filter(apt => {
      const aptDate = new Date(apt.appointmentDate);
      return apt.status === 'completed' &&
             apt.revenue &&
             aptDate >= thisMonth;
    }).reduce((sum, apt) => sum + (Number(apt.revenue) || 0), 0);

    // Total revenue (all time)
    const totalRevenue = data.filter(apt => apt.status === 'completed' && apt.revenue)
      .reduce((sum, apt) => sum + (Number(apt.revenue) || 0), 0);

    // Total unique customers
    const uniqueCustomers = new Set(data.map(apt => apt.customerPhone));
    const totalCustomers = uniqueCustomers.size;

    // Revenue by month (last 6 months)
    const revenueByMonth = calculateRevenueByMonth(data);

    // Top services (by booking count)
    const topServices = calculateTopServices(data);

    setAnalytics({
      todayAppointments,
      pendingBookings,
      monthlyRevenue,
      totalRevenue,
      totalCustomers,
      completedBookings,
      revenueByMonth,
      topServices
    });
  };

  const calculateRevenueByMonth = (data: Appointment[]) => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentDate = new Date();
    const monthlyData: { [key: string]: number } = {};

    // Initialize last 6 months
    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthKey = `${monthNames[date.getMonth()]}`;
      monthlyData[monthKey] = 0;
    }

    // Calculate revenue for each month
    data.filter(apt => apt.status === 'completed' && apt.revenue).forEach(apt => {
      const aptDate = new Date(apt.appointmentDate);
      const monthKey = `${monthNames[aptDate.getMonth()]}`;
      if (monthKey in monthlyData) {
        monthlyData[monthKey] += Number(apt.revenue);
      }
    });

    return Object.entries(monthlyData).map(([month, revenue]) => ({
      month,
      revenue
    }));
  };

  const calculateTopServices = (data: Appointment[]) => {
    const serviceCounts: { [key: string]: number } = {};

    data.forEach(apt => {
      serviceCounts[apt.service] = (serviceCounts[apt.service] || 0) + 1;
    });

    return Object.entries(serviceCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  };

  const recentAppointments = appointments.slice(0, 5);

  const stats = [
    {
      name: "Today's Appointments",
      value: analytics.todayAppointments,
      icon: "📅",
      color: "from-blue-500 to-blue-600",
    },
    {
      name: "Pending Bookings",
      value: analytics.pendingBookings,
      icon: "⏳",
      color: "from-yellow-500 to-orange-500",
    },
    {
      name: "Monthly Revenue",
      value: `GH₵${analytics.monthlyRevenue.toFixed(2)}`,
      icon: "💰",
      color: "from-green-500 to-emerald-600",
    },
    {
      name: "Total Customers",
      value: analytics.totalCustomers,
      icon: "👥",
      color: "from-purple-500 to-pink-500",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back! Here's what's happening today.</p>
        </div>
        <Link
          href="/admin"
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          Back to Admin
        </Link>
      </div>

      {loading ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <p className="text-gray-500">Loading dashboard...</p>
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
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

          {/* Additional Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-sm text-gray-600 mb-1">Total Revenue (All Time)</h3>
              <p className="text-3xl font-bold text-green-600">GH₵{analytics.totalRevenue.toFixed(2)}</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-sm text-gray-600 mb-1">Completed Bookings</h3>
              <p className="text-3xl font-bold text-blue-600">{analytics.completedBookings}</p>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Chart */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Revenue Last 6 Months</h2>
              {analytics.revenueByMonth.length > 0 ? (
                <div className="space-y-3">
                  {analytics.revenueByMonth.map((item, idx) => (
                    <div key={idx} className="flex items-center">
                      <span className="w-12 text-sm text-gray-600 font-medium">{item.month}</span>
                      <div className="flex-1 mx-4">
                        <div className="bg-gray-200 rounded-full h-8 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-green-500 to-emerald-600 h-full rounded-full flex items-center justify-end pr-3 text-white text-sm font-semibold"
                            style={{ width: `${Math.max(5, (item.revenue / Math.max(...analytics.revenueByMonth.map(m => m.revenue), 1)) * 100)}%` }}
                          >
                            {item.revenue > 0 && `GH₵${item.revenue.toFixed(0)}`}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No revenue data yet</p>
              )}
            </div>

            {/* Top Services */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Top Services</h2>
              {analytics.topServices.length > 0 ? (
                <div className="space-y-4">
                  {analytics.topServices.map((service, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-bold">
                          {idx + 1}
                        </div>
                        <span className="font-medium text-gray-900">{service.name}</span>
                      </div>
                      <span className="text-2xl font-bold text-blue-600">{service.count}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No bookings yet</p>
              )}
            </div>
          </div>

          {/* Recent Appointments */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Recent Appointments</h2>
              <Link href="/admin/appointments" className="text-blue-600 hover:text-blue-700 font-medium">
                View All →
              </Link>
            </div>

            {recentAppointments.length > 0 ? (
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
                            <p className="text-sm text-gray-500">{appointment.customerEmail}</p>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-gray-700">{appointment.service}</td>
                        <td className="py-4 px-4">
                          <div>
                            <p className="text-gray-900">{new Date(appointment.appointmentDate).toLocaleDateString()}</p>
                            <p className="text-sm text-gray-500">{appointment.appointmentTime}</p>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            appointment.status === "completed"
                              ? "bg-green-100 text-green-700"
                              : appointment.status === "confirmed"
                              ? "bg-purple-100 text-purple-700"
                              : appointment.status === "accepted"
                              ? "bg-blue-100 text-blue-700"
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
            ) : (
              <p className="text-gray-500 text-center py-8">No appointments yet</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
