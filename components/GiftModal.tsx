"use client";

import { useState, useEffect } from 'react';

interface GiftModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function GiftModal({ isOpen, onClose }: GiftModalProps) {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        senderName: '',
        senderEmail: '',
        senderPhone: '',
        recipientName: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!isOpen) {
            setStep(1);
            setFormData({
                senderName: '',
                senderEmail: '',
                senderPhone: '',
                recipientName: '',
                message: ''
            });
            setError('');
        }
    }, [isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.senderName || !formData.senderPhone || !formData.recipientName) {
            setError('Please fill in all required fields');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await fetch('/api/gifts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setStep(2); // Success step
            } else {
                const data = await response.json();
                setError(data.error || 'Failed to submit request');
            }
        } catch (error) {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="bg-primary text-white p-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold">Gift a Signature Session</h2>
                        <button onClick={onClose} className="text-white/80 hover:text-white text-3xl leading-none">&times;</button>
                    </div>
                    {step === 1 && (
                        <p className="text-white/80 mt-2 text-sm">
                            Treat someone special to a luxurious experience at GeeGees.
                        </p>
                    )}
                </div>

                {/* Content */}
                <div className="p-6">
                    {error && (
                        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                            {error}
                        </div>
                    )}

                    {step === 1 ? (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Your Name *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.senderName}
                                    onChange={(e) => setFormData({ ...formData, senderName: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary"
                                    placeholder="John Doe"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Your Phone Number (WhatsApp) *</label>
                                <input
                                    type="tel"
                                    required
                                    value={formData.senderPhone}
                                    onChange={(e) => setFormData({ ...formData, senderPhone: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary"
                                    placeholder="+233 XX XXX XXXX"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Your Email (Optional)</label>
                                <input
                                    type="email"
                                    value={formData.senderEmail}
                                    onChange={(e) => setFormData({ ...formData, senderEmail: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary"
                                    placeholder="john@example.com"
                                />
                            </div>

                            <hr className="my-4" />

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Recipient's Name *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.recipientName}
                                    onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary"
                                    placeholder="Jane Doe"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Personalized Message (Optional)</label>
                                <textarea
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary"
                                    rows={3}
                                    placeholder="Happy Birthday! Enjoy this pampering session..."
                                />
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-secondary text-black py-3 rounded-lg font-bold hover:bg-secondary/90 transition-colors disabled:opacity-50"
                                >
                                    {loading ? 'Submitting...' : 'Request Gift Session'}
                                </button>
                                <p className="text-xs text-gray-500 text-center mt-3">
                                    Our team will contact you via WhatsApp to arrange payment and delivery of the gift voucher.
                                </p>
                            </div>
                        </form>
                    ) : (
                        <div className="text-center py-8">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Request Received!</h3>
                            <p className="text-gray-600 mb-6">
                                Thank you for choosing to gift a GeeGees experience. Our team will contact you shortly on WhatsApp to finalize the details.
                            </p>
                            <button
                                onClick={onClose}
                                className="bg-primary text-white px-8 py-3 rounded-lg font-bold hover:bg-primary/90 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
