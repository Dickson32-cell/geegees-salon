"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Review {
    id: number;
    stylist_name: string;
    client_name: string;
    rating: number;
    comment: string;
    created_at: string;
}

export default function ReviewsPage() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            const response = await fetch('/api/reviews', { cache: 'no-store' });
            if (response.ok) {
                const data = await response.json();
                setReviews(data);
            }
        } catch (error) {
            console.error('Error fetching reviews:', error);
        } finally {
            setLoading(false);
        }
    };

    const deleteReview = async (id: number) => {
        if (!window.confirm("Are you sure you want to delete this review?")) return;

        try {
            const response = await fetch(`/api/reviews?id=${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setReviews(reviews.filter(review => review.id !== id));
            } else {
                alert("Failed to delete review");
            }
        } catch (error) {
            console.error("Error deleting review:", error);
            alert("An error occurred while deleting the review");
        }
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center print:hidden">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Stylist Reviews</h1>
                    <p className="text-gray-600 mt-2">View and print client reviews for your team members.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handlePrint}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                        </svg>
                        Print to PDF
                    </button>
                    <Link
                        href="/admin"
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                        Back to Admin
                    </Link>
                </div>
            </div>

            {/* Print Header (Only visible when printing) */}
            <div className="hidden print:block mb-8 text-center">
                <h1 className="text-3xl font-bold text-gray-900">GeeGees Unisex Salon</h1>
                <h2 className="text-xl text-gray-600 mt-2">Stylist Reviews Report</h2>
                <p className="text-sm text-gray-500 mt-1">Generated on {new Date().toLocaleDateString()}</p>
            </div>

            {loading ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center print:hidden">
                    <p className="text-gray-500">Loading reviews...</p>
                </div>
            ) : reviews.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center print:hidden">
                    <p className="text-gray-500">No reviews found</p>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden print:shadow-none print:border-none">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200 print:bg-transparent print:border-b-2 print:border-gray-800">
                                <th className="py-4 px-6 font-semibold text-gray-700">Date</th>
                                <th className="py-4 px-6 font-semibold text-gray-700">Stylist</th>
                                <th className="py-4 px-6 font-semibold text-gray-700">Client</th>
                                <th className="py-4 px-6 font-semibold text-gray-700">Rating</th>
                                <th className="py-4 px-6 font-semibold text-gray-700">Comment</th>
                                <th className="py-4 px-6 font-semibold text-gray-700 print:hidden">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 print:divide-gray-400">
                            {reviews.map((review) => (
                                <tr key={review.id} className="hover:bg-gray-50 print:hover:bg-transparent">
                                    <td className="py-4 px-6 text-sm text-gray-600 whitespace-nowrap">
                                        {new Date(review.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="py-4 px-6 font-medium text-gray-900">
                                        {review.stylist_name}
                                    </td>
                                    <td className="py-4 px-6 text-gray-700">
                                        {review.client_name}
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center text-yellow-400">
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                <svg
                                                    key={i}
                                                    className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-gray-300 fill-current'}`}
                                                    viewBox="0 0 20 20"
                                                >
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 text-sm text-gray-600 max-w-md">
                                        {review.comment || <span className="text-gray-400 italic">No comment provided</span>}
                                    </td>
                                    <td className="py-4 px-6 print:hidden">
                                        <button
                                            onClick={() => deleteReview(review.id)}
                                            className="text-red-600 hover:text-red-800 transition-colors p-2 rounded-full hover:bg-red-50"
                                            title="Delete Review"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
