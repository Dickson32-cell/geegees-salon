"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface GiftRequest {
    id: number;
    created_at: string;
    sender_name: string;
    sender_email: string;
    sender_phone: string;
    recipient_name: string;
    message: string;
    status: string;
}

export default function GiftsPage() {
    const [gifts, setGifts] = useState<GiftRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");

    useEffect(() => {
        fetchGifts();
    }, []);

    const fetchGifts = async () => {
        try {
            const response = await fetch('/api/gifts');
            if (response.ok) {
                const data = await response.json();
                setGifts(data);
            }
        } catch (error) {
            console.error('Error fetching gifts:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id: number, newStatus: string) => {
        try {
            const response = await fetch(`/api/gifts/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });

            if (response.ok) {
                fetchGifts();
            } else {
                alert('Failed to update status');
            }
        } catch (error) {
            console.error('Error updating status:', error);
            alert('An error occurred while updating status');
        }
    };

    const deleteGift = async (id: number, senderName: string) => {
        const confirmed = window.confirm(
            `Are you sure you want to delete the gift request from ${senderName}?`
        );

        if (!confirmed) return;

        try {
            const response = await fetch(`/api/gifts/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                fetchGifts();
            } else {
                alert('Failed to delete gift request');
            }
        } catch (error) {
            console.error('Error deleting gift request:', error);
            alert('An error occurred while deleting');
        }
    };

    const generateWhatsAppLink = (gift: GiftRequest) => {
        const message = `Hello ${gift.sender_name}! We received your request to gift a Signature Session to ${gift.recipient_name}.\n\nLet's finalize the details and payment.`;
        const encodedMessage = encodeURIComponent(message);
        const cleanPhone = gift.sender_phone.replace(/[^0-9+]/g, '');
        return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
    };

    const filteredGifts = gifts.filter((gift) => {
        if (filter === "all") return true;
        return gift.status === filter;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'contacted': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'completed': return 'bg-green-100 text-green-800 border-green-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Gift Requests</h1>
                    <p className="text-gray-600 mt-2">Manage "Gift a Signature Session" requests from customers.</p>
                </div>
                <Link
                    href="/admin"
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                    Back to Admin
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="max-w-xs">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="all">All Requests</option>
                        <option value="pending">Pending</option>
                        <option value="contacted">Contacted</option>
                        <option value="completed">Completed</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                    <p className="text-gray-500">Loading gift requests...</p>
                </div>
            ) : filteredGifts.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                    <p className="text-gray-500 font-medium">No gift requests found</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredGifts.map((gift) => (
                        <div key={gift.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">From: {gift.sender_name}</h3>
                                    <p className="text-sm text-gray-500">{gift.sender_email}</p>
                                    <p className="text-sm text-gray-500">{gift.sender_phone}</p>
                                    <p className="text-xs text-gray-400 mt-1">Requested on: {new Date(gift.created_at).toLocaleDateString()}</p>
                                </div>
                                <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(gift.status)}`}>
                                    {gift.status.toUpperCase()}
                                </div>
                            </div>

                            <div className="bg-pink-50 border border-pink-100 rounded-lg p-4 mb-4">
                                <p className="text-xs text-pink-700 uppercase tracking-wide font-bold mb-1">Gift For</p>
                                <p className="font-medium text-gray-900 text-lg">{gift.recipient_name}</p>

                                {gift.message && (
                                    <div className="mt-3 pt-3 border-t border-pink-200">
                                        <p className="text-xs text-pink-700 uppercase tracking-wide font-bold mb-1">Personal Message</p>
                                        <p className="text-sm text-gray-700 italic">"{gift.message}"</p>
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-wrap gap-2">
                                <a
                                    href={generateWhatsAppLink(gift)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center gap-2"
                                >
                                    Contact Sender
                                </a>

                                {gift.status === 'pending' && (
                                    <button
                                        onClick={() => updateStatus(gift.id, 'contacted')}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                                    >
                                        Mark as Contacted
                                    </button>
                                )}

                                {gift.status === 'contacted' && (
                                    <button
                                        onClick={() => updateStatus(gift.id, 'completed')}
                                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                                    >
                                        Mark as Completed
                                    </button>
                                )}

                                <button
                                    onClick={() => deleteGift(gift.id, gift.sender_name)}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium flex items-center gap-2 ml-auto"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
