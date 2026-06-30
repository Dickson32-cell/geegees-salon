"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { isVideoUrl } from "@/lib/media";

interface GalleryImage {
  id: number;
  title: string | null;
  image_url: string;
  category: string | null;
  description: string | null;
  display_order: number | null;
}

export default function AdminGallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [isAdding, setIsAdding] = useState(false);
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    category: "hero-home",
    description: "",
    displayOrder: 0,
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/gallery');
      if (!response.ok) throw new Error('Failed to fetch images');
      const data = await response.json();
      setImages(data);
    } catch (error) {
      console.error('Error fetching images:', error);
      setError('Failed to load images');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    const uploadFormData = new FormData();
    uploadFormData.append('file', file);
    uploadFormData.append('folder', formData.category);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: uploadFormData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Upload failed');
    }

    const data = await response.json();
    return data.url;
  };

  const handleAdd = async () => {
    if (!selectedFile) {
      setError("Please select an image or video to upload");
      return;
    }

    try {
      setUploading(true);
      setError("");
      setSuccessMessage("");

      // Upload image to storage
      const imageUrl = await uploadImage(selectedFile);

      // Save to database
      const response = await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title || null,
          imageUrl: imageUrl,
          category: formData.category,
          description: formData.description || null,
          displayOrder: formData.displayOrder || null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API error response:', errorData);
        throw new Error(errorData.details || errorData.error || 'Failed to save media');
      }

      const newImage = await response.json();
      setImages([...images, newImage]);
      setSuccessMessage("Media uploaded successfully!");
      resetForm();
    } catch (error: any) {
      console.error('Error adding image:', error);
      setError(error.message || 'Failed to upload media');
    } finally {
      setUploading(false);
    }
  };

  const handleUpdate = async () => {
    if (!editingImage) return;

    try {
      setUploading(true);
      setError("");
      setSuccessMessage("");

      let imageUrl = editingImage.image_url;

      // If new file selected, upload it
      if (selectedFile) {
        imageUrl = await uploadImage(selectedFile);
      }

      const response = await fetch('/api/gallery', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingImage.id,
          title: formData.title || null,
          imageUrl: imageUrl,
          category: formData.category,
          description: formData.description || null,
          displayOrder: formData.displayOrder || null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API error response:', errorData);
        throw new Error(errorData.details || errorData.error || 'Failed to update media');
      }

      const updatedImage = await response.json();
      setImages(images.map(img => img.id === updatedImage.id ? updatedImage : img));
      setSuccessMessage("Media updated successfully!");
      resetForm();
    } catch (error: any) {
      console.error('Error updating image:', error);
      setError(error.message || 'Failed to update media');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: number, imageUrl: string) => {
    if (!confirm('Are you sure you want to delete this media?')) return;

    try {
      setError("");
      const response = await fetch(`/api/gallery?id=${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete image');

      setImages(images.filter(img => img.id !== id));
      setSuccessMessage("Media deleted successfully!");
    } catch (error: any) {
      console.error('Error deleting image:', error);
      setError('Failed to delete image');
    }
  };

  const startEdit = (image: GalleryImage) => {
    setEditingImage(image);
    setFormData({
      title: image.title || "",
      category: image.category || "hero-home",
      description: image.description || "",
      displayOrder: image.display_order || 0,
    });
    setPreviewUrl(image.image_url);
    setIsAdding(true);
  };

  const resetForm = () => {
    setFormData({ title: "", category: "hero-home", description: "", displayOrder: 0 });
    setIsAdding(false);
    setEditingImage(null);
    setSelectedFile(null);
    setPreviewUrl("");
  };

  // Group images by category
  const groupedImages = images.reduce((acc, img) => {
    const cat = img.category || 'uncategorized';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(img);
    return acc;
  }, {} as Record<string, GalleryImage[]>);

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4 mb-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Gallery & Media Management</h1>
            <p className="text-slate-600">Upload and manage images for hero sections and gallery</p>
          </div>
          <button
            onClick={() => setIsAdding(true)}
            className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm font-medium"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Upload Image</span>
          </button>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <svg className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <div className="flex-1">
            <h4 className="font-semibold text-red-800 mb-1">Error</h4>
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      {successMessage && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
          <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <div className="flex-1">
            <h4 className="font-semibold text-green-800 mb-1">Success</h4>
            <p className="text-green-700">{successMessage}</p>
          </div>
          <button onClick={() => setSuccessMessage("")} className="text-green-600 hover:text-green-800">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      )}

      {/* Upload Form */}
      {isAdding && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h3 className="text-xl font-bold mb-4">{editingImage ? 'Edit Media' : 'Upload New Media (Image/Video)'}</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* File Upload */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Image or Video File</label>
              <input
                type="file"
                accept="image/*,video/*"
                onChange={handleFileSelect}
                className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              <p className="text-xs text-slate-500 mt-1">
                Supported: Images (JPG, PNG, WEBP) and Videos (MP4, WEBM, MOV)
              </p>
              {previewUrl && selectedFile && (
                <div className="mt-4">
                  {selectedFile.type.startsWith('video/') ? (
                    <video src={previewUrl} controls muted className="max-h-64 rounded-lg border">
                      Your browser does not support video preview.
                    </video>
                  ) : (
                    <img src={previewUrl} alt="Preview" className="max-h-64 rounded-lg border" />
                  )}
                </div>
              )}
            </div>

            {/* Category */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
              >
                <option value="hero-home">Hero - Home Page</option>
                <option value="hero-services">Hero - Services Page</option>
                <option value="home-showcase">Home - About Section Videos</option>
                <option value="gallery">Gallery</option>
                <option value="cut">Gallery - Precision Cut</option>
                <option value="color">Gallery - Editorial Color</option>
                <option value="style">Gallery - Styling</option>
                <option value="grooming">Gallery - Grooming</option>
              </select>
              <p className="text-xs text-slate-500 mt-1">
                <strong>Hero media:</strong> Auto-play slideshows as page backgrounds (images fade, videos loop continuously).
                <strong>Home - About Section:</strong> Videos displayed in the about section of the homepage.
                <strong>Gallery:</strong> Appear in the gallery page.
              </p>
            </div>

            <input
              type="text"
              placeholder="Title (optional)"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
            />

            <input
              type="number"
              placeholder="Display Order (0 = default)"
              value={formData.displayOrder}
              onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
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

          <div className="flex space-x-3 mt-6">
            <button
              onClick={editingImage ? handleUpdate : handleAdd}
              disabled={uploading}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm disabled:opacity-50"
            >
              {uploading ? 'Uploading...' : editingImage ? 'Update Media' : 'Upload Media'}
            </button>
            <button
              onClick={resetForm}
              disabled={uploading}
              className="px-6 py-2.5 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors font-medium disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Images by Category */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading images...</p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedImages).map(([category, categoryImages]) => (
            <div key={category} className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-4 capitalize flex items-center gap-2">
                {category === 'hero-home' && '🏠'}
                {category === 'hero-services' && '✨'}
                {!category.startsWith('hero') && '🖼️'}
                {category.replace('-', ' ')}
                <span className="text-sm font-normal text-slate-500">({categoryImages.length})</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {categoryImages.map((image) => {
                  const isVideoFile = isVideoUrl(image.image_url);
                  return (
                    <div key={image.id} className="group relative bg-slate-50 rounded-lg overflow-hidden border border-slate-200">
                      <div className="aspect-video relative">
                        {isVideoFile ? (
                          <>
                            <video
                              src={image.image_url}
                              className="w-full h-full object-cover"
                              autoPlay
                              muted
                              loop
                              playsInline
                            />
                            <div className="absolute top-2 right-2 bg-purple-600 text-white px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                              </svg>
                              VIDEO
                            </div>
                          </>
                        ) : (
                          <img
                            src={image.image_url}
                            alt={image.title || 'Gallery image'}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="p-3">
                        {image.title && <p className="font-semibold text-sm text-slate-900 truncate">{image.title}</p>}
                        {image.description && <p className="text-xs text-slate-600 truncate mt-1">{image.description}</p>}
                        <div className="flex gap-2 mt-3">
                          <button
                            onClick={() => startEdit(image)}
                            className="flex-1 px-3 py-1.5 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(image.id, image.image_url)}
                            className="flex-1 px-3 py-1.5 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && images.length === 0 && (
        <div className="text-center py-16 bg-white rounded-lg border border-slate-200">
          <div className="w-20 h-20 mx-auto bg-slate-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-slate-900 mb-2">No images yet</h3>
          <p className="text-slate-600 mb-6">Upload your first image to get started</p>
          <button
            onClick={() => setIsAdding(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm inline-flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Upload First Image
          </button>
        </div>
      )}
    </div>
  );
}
