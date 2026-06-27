"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Service {
  id: number;
  name: string;
  category: string;
  price: string;
  duration: string;
  description?: string;
}

export default function ServicesManagement() {
  const [services, setServices] = useState<Service[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [formData, setFormData] = useState({
    name: "",
    category: "Hair",
    price: "",
    duration: "",
    description: "",
  });

  // Fetch services on mount
  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch('/api/services');

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setServices(Array.isArray(data) ? data : []);
    } catch (error: any) {
      console.error('Error fetching services:', error);
      setError(`Failed to load services: ${error.message}`);
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!formData.name || !formData.price || !formData.duration) {
      setError("Please fill in all required fields (Name, Price, Duration)");
      return;
    }

    try {
      setError("");
      setSuccessMessage("");

      const response = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || 'Failed to add service');
      }

      const newService = await response.json();
      setServices([...services, newService]);
      setSuccessMessage(`Service "${formData.name}" added successfully!`);
      resetForm();
    } catch (error: any) {
      console.error('Error adding service:', error);
      setError(`Failed to add service: ${error.message}`);
    }
  };

  const handleUpdate = async () => {
    if (!editingService) return;

    if (!formData.name || !formData.price || !formData.duration) {
      setError("Please fill in all required fields (Name, Price, Duration)");
      return;
    }

    try {
      setError("");
      setSuccessMessage("");

      const response = await fetch('/api/services', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editingService.id, ...formData }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || 'Failed to update service');
      }

      const updatedService = await response.json();
      setServices(services.map(s => s.id === updatedService.id ? updatedService : s));
      setSuccessMessage(`Service "${formData.name}" updated successfully!`);
      resetForm();
    } catch (error: any) {
      console.error('Error updating service:', error);
      setError(`Failed to update service: ${error.message}`);
    }
  };

  const handleDelete = async (id: number) => {
    const serviceToDelete = services.find(s => s.id === id);
    if (!confirm(`Are you sure you want to delete "${serviceToDelete?.name}"?`)) {
      return;
    }

    try {
      setError("");
      setSuccessMessage("");

      const response = await fetch(`/api/services?id=${id}`, { method: 'DELETE' });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || 'Failed to delete service');
      }

      setServices(services.filter((s) => s.id !== id));
      setSuccessMessage(`Service "${serviceToDelete?.name}" deleted successfully!`);
    } catch (error: any) {
      console.error('Error deleting service:', error);
      setError(`Failed to delete service: ${error.message}`);
    }
  };

  const startEdit = (service: Service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      category: service.category,
      price: service.price,
      duration: service.duration,
      description: service.description || "",
    });
    setIsAdding(true);
  };

  const resetForm = () => {
    setFormData({ name: "", category: "Hair", price: "", duration: "", description: "" });
    setIsAdding(false);
    setEditingService(null);
  };

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4 mb-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Services Management</h1>
            <p className="text-slate-600">Manage your salon services and pricing (synced with main website)</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/admin/test">
              <button className="px-4 py-2.5 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors flex items-center gap-2 shadow-sm">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium">Diagnostics</span>
              </button>
            </Link>
            <button
              onClick={() => setIsAdding(true)}
              className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm font-medium"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Add Service</span>
            </button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <svg className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <div className="flex-1">
            <h4 className="font-semibold text-red-800 mb-1">Error</h4>
            <p className="text-red-700">{error}</p>
            <button
              onClick={fetchServices}
              className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm font-semibold"
            >
              Retry Loading Services
            </button>
          </div>
        </div>
      )}

      {/* Success Message */}
      {successMessage && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
          <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <div className="flex-1">
            <h4 className="font-semibold text-green-800 mb-1">Success</h4>
            <p className="text-green-700">{successMessage}</p>
          </div>
          <button
            onClick={() => setSuccessMessage("")}
            className="text-green-600 hover:text-green-800"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading services...</p>
        </div>
      )}

      {/* Add/Edit Service Form */}
      {!loading && isAdding && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h3 className="text-xl font-bold mb-4">{editingService ? 'Edit Service' : 'Add New Service'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Service Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
            />
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
            >
              <option value="Hair">Hair</option>
              <option value="Spa">Spa</option>
              <option value="Makeup">Makeup</option>
              <option value="Skincare">Skincare</option>
              <option value="Nails">Nails</option>
              <option value="Braids">Braids</option>
            </select>
            <input
              type="text"
              placeholder="Price (e.g., ₵50-80 or $85)"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
            />
            <input
              type="text"
              placeholder="Duration (e.g., 60 min)"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
            />
            <textarea
              placeholder="Description (optional)"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary md:col-span-2"
              rows={3}
            />
          </div>
          <div className="flex space-x-3 mt-4">
            <button
              onClick={editingService ? handleUpdate : handleAdd}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
            >
              {editingService ? 'Update Service' : 'Add Service'}
            </button>
            <button
              onClick={resetForm}
              className="px-6 py-2.5 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Services Grid */}
      {!loading && (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {services.map((service) => (
          <div key={service.id} className="bg-white rounded-lg border border-slate-200 shadow-sm p-6 hover:shadow-md transition-all hover:border-blue-300">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-900 mb-2">{service.name}</h3>
                <span className="inline-block px-2.5 py-1 bg-blue-100 text-blue-700 rounded-md text-xs font-semibold uppercase">
                  {service.category}
                </span>
              </div>
            </div>

            {service.description && (
              <p className="text-slate-600 text-sm mb-4 line-clamp-2">{service.description}</p>
            )}

            <div className="space-y-2 mb-5 pb-5 border-b border-slate-100">
              <div className="flex items-center text-slate-700">
                <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-semibold text-sm">{service.price}</span>
              </div>
              <div className="flex items-center text-slate-700">
                <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm">{service.duration}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => startEdit(service)}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(service.id)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      )}

      {!loading && services.length === 0 && !error && (
        <div className="text-center py-16 bg-white rounded-lg border border-slate-200">
          <div className="w-20 h-20 mx-auto bg-slate-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-slate-900 mb-2">No services yet</h3>
          <p className="text-slate-600 mb-6 max-w-md mx-auto">Get started by creating your first service. Your services will appear on the main website automatically.</p>
          <button
            onClick={() => setIsAdding(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm inline-flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Your First Service
          </button>
        </div>
      )}
    </div>
  );
}
