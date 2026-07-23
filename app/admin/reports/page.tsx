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
    status: string;
    revenue?: number;
}

interface TeamMember {
    id: number;
    name: string;
    active: boolean;
}

export default function ReportsPage() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [dateFilter, setDateFilter] = useState("all_time");

    useEffect(() => {
        Promise.all([fetchAppointments(), fetchTeam()]).finally(() => {
            setLoading(false);
        });
    }, []);

    const fetchAppointments = async () => {
        try {
            const response = await fetch('/api/appointments');
            if (response.ok) {
                const data = await response.json();
                const mappedData = data.map((apt: any) => ({
                    ...apt,
                    appointmentDate: apt.appointment_date || apt.appointmentDate,
                    appointmentTime: apt.appointment_time || apt.appointmentTime,
                    customerName: apt.customer_name || apt.customerName,
                }));
                setAppointments(mappedData);
            }
        } catch (error) {
            console.error('Error fetching appointments:', error);
        }
    };

    const fetchTeam = async () => {
        try {
            const response = await fetch('/api/team');
            if (response.ok) {
                const data = await response.json();
                setTeamMembers(data.filter((m: any) => m.active));
            }
        } catch (error) {
            console.error('Error fetching team:', error);
        }
    };

    const filterAppointmentsByDate = (apts: Appointment[]) => {
        if (dateFilter === "all_time") return apts;

        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        return apts.filter(apt => {
            const aptDate = new Date(apt.appointmentDate);

            if (dateFilter === "today") {
                return aptDate.getTime() === today.getTime();
            }

            if (dateFilter === "this_week") {
                const firstDayOfWeek = new Date(today);
                firstDayOfWeek.setDate(today.getDate() - today.getDay());
                return aptDate >= firstDayOfWeek;
            }

            if (dateFilter === "this_month") {
                return aptDate.getMonth() === today.getMonth() && aptDate.getFullYear() === today.getFullYear();
            }

            return true;
        });
    };

    const filteredAppointments = filterAppointmentsByDate(appointments);

    const getStylistStats = (stylistName: string) => {
        const stylistApts = filteredAppointments.filter(apt => apt.stylist === stylistName);
        const completedApts = stylistApts.filter(apt => apt.status === 'completed');

        const totalAssigned = stylistApts.length;
        const totalCompleted = completedApts.length;
        const totalRevenue = completedApts.reduce((sum, apt) => sum + (apt.revenue || 0), 0);

        return { totalAssigned, totalCompleted, totalRevenue };
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Stylist Reports</h1>
                    <p className="text-gray-600 mt-2">Track stylist assignments, completed work, and revenue generated.</p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="max-w-xs">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                    <select
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="today">Today</option>
                        <option value="this_week">This Week</option>
                        <option value="this_month">This Month</option>
                        <option value="all_time">All Time</option>
                    </select>
                </div>
            </div>

            {/* Reports Grid */}
            {loading ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                    <p className="text-gray-500">Loading reports...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {teamMembers.map(member => {
                        const stats = getStylistStats(member.name);
                        return (
                            <div key={member.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-xl">
                                        {member.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900">{member.name}</h3>
                                        <p className="text-sm text-gray-500">Stylist</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                                        <span className="text-gray-600">Assigned Work</span>
                                        <span className="font-semibold text-gray-900">{stats.totalAssigned}</span>
                                    </div>
                                    <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                                        <span className="text-gray-600">Completed Work</span>
                                        <span className="font-semibold text-green-600">{stats.totalCompleted}</span>
                                    </div>
                                    <div className="flex justify-between items-center pt-2">
                                        <span className="text-gray-600 font-medium">Revenue Generated</span>
                                        <span className="font-bold text-xl text-blue-600">GH₵{stats.totalRevenue.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
