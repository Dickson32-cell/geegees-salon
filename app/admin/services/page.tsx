"use client";

import { useState, useEffect } from "react";

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
      const response = await fetch('/api/services');
      const data = await response.json();
      setServices(data);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const handleAdd = async () => {
    if (formData.name && formData.price && formData.duration) {
      try {
        const response = await fetch('/api/services', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        const newService = await response.json();
        setServices([...services, newService]);
        resetForm();
      } catch (error) {
        console.error('Error adding service:', error);
      }
    }
  };

  const handleUpdate = async () => {
    if (editingService) {
      try {
        const response = await fetch('/api/services', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingService.id, ...formData }),
        });
        const updatedService = await response.json();
        setServices(services.map(s => s.id === updatedService.id ? updatedService : s));
        resetForm();
      } catch (error) {
        console.error('Error updating service:', error);
      }
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this service?")) {
      try {
        await fetch(`/api/services?id=${id}`, { method: 'DELETE' });
        setServices(services.filter((s) => s.id !== id));
      } catch (error) {
        console.error('Error deleting service:', error);
      }
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
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Services Management</h1>
          <p className="text-gray-600">Manage your salon services and pricing (synced with main website)</p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Add Service</span>
        </button>
      </div>

      {/* Add/Edit Service Form */}
      {isAdding && (
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
              className="btn-primary"
            >
              {editingService ? 'Update Service' : 'Add Service'}
            </button>
            <button
              onClick={resetForm}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <div key={service.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{service.name}</h3>
                <span className="inline-block px-3 py-1 bg-secondary/20 text-secondary rounded-full text-xs font-semibold uppercase">
                  {service.category}
                </span>
              </div>
            </div>

            {service.description && (
              <p className="text-gray-600 text-sm mb-3">{service.description}</p>
            )}

            <div className="space-y-2 mb-4">
              <div className="flex items-center text-gray-600">
                <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-semibold">{service.price}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{service.duration}</span>
              </div>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => startEdit(service)}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(service.id)}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {services.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No services yet. Add your first service!</p>
        </div>
      )}
    </div>
  );
}
