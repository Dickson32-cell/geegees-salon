"use client";

import { useState, useEffect } from "react";
import { mockInquiries } from "@/lib/data/mockData";

export default function Inquiries() {
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [filter, setFilter] = useState("all");
  const [selectedInquiry, setSelectedInquiry] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      const res = await fetch('/api/inquiries');
      if (res.ok) {
        const data = await res.json();
        setInquiries(data);
      }
    } catch (error) {
      console.error("Error fetching inquiries:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredInquiries = inquiries.filter((inq) =>
    filter === "all" || inq.status === filter
  );

  const markAsRead = async (id: number) => {
    try {
      const res = await fetch('/api/inquiries', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: 'read' }),
      });
      if (res.ok) {
        setInquiries(inquiries.map((inq) => inq.id === id ? { ...inq, status: "read" } : inq));
      }
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  const deleteInquiry = async (id: number) => {
    if (confirm("Are you sure you want to delete this inquiry?")) {
      try {
        const res = await fetch(`/api/inquiries?id=${id}`, { method: 'DELETE' });
        if (res.ok) {
          setInquiries(inquiries.filter((inq) => inq.id !== id));
          setSelectedInquiry(null);
        }
      } catch (error) {
        console.error("Error deleting inquiry:", error);
      }
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Customer Inquiries</h1>
        <p className="text-gray-600">Manage customer messages and inquiries</p>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex space-x-4">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === "all"
              ? "bg-primary-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
          >
            All ({inquiries.length})
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === "unread"
              ? "bg-primary-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
          >
            Unread ({inquiries.filter(i => i.status === "unread").length})
          </button>
          <button
            onClick={() => setFilter("read")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === "read"
              ? "bg-primary-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
          >
            Read ({inquiries.filter(i => i.status === "read").length})
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Inquiries List */}
        <div className="lg:col-span-1 space-y-4">
          {filteredInquiries.map((inquiry) => (
            <div
              key={inquiry.id}
              onClick={() => {
                setSelectedInquiry(inquiry);
                if (inquiry.status === "unread") {
                  markAsRead(inquiry.id);
                }
              }}
              className={`bg-white rounded-xl shadow-lg p-4 cursor-pointer hover:shadow-xl transition-all ${selectedInquiry?.id === inquiry.id ? "ring-2 ring-primary-500" : ""
                }`}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-gray-900">{inquiry.name}</h3>
                {inquiry.status === "unread" && (
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                )}
              </div>
              <p className="text-sm text-gray-600 mb-1">{inquiry.subject}</p>
              <p className="text-xs text-gray-500">{inquiry.date}</p>
            </div>
          ))}

          {filteredInquiries.length === 0 && (
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <p className="text-gray-500">No inquiries found</p>
            </div>
          )}
        </div>

        {/* Inquiry Detail */}
        <div className="lg:col-span-2">
          {selectedInquiry ? (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {selectedInquiry.subject}
                  </h2>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span className="font-medium">{selectedInquiry.name}</span>
                    <span>•</span>
                    <span>{selectedInquiry.email}</span>
                    <span>•</span>
                    <span>{selectedInquiry.date}</span>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${selectedInquiry.status === "unread"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-gray-100 text-gray-700"
                  }`}>
                  {selectedInquiry.status.charAt(0).toUpperCase() + selectedInquiry.status.slice(1)}
                </span>
              </div>

              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-700 leading-relaxed">{selectedInquiry.message}</p>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => window.location.href = `mailto:${selectedInquiry.email}`}
                  className="btn-primary flex items-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>Reply via Email</span>
                </button>
                <button
                  onClick={() => deleteInquiry(selectedInquiry.id)}
                  className="px-6 py-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors flex items-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <p className="text-gray-500">Select an inquiry to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
