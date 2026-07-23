"use client";

import React, { useState, useEffect, useRef } from 'react';

interface ContentSection {
  title: string;
  subtitle?: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
}

interface PageContent {
  hero: ContentSection;
  about?: ContentSection;
  cta?: ContentSection;
}

export default function ContentManagement() {
  const [selectedPage, setSelectedPage] = useState('home');
  const [content, setContent] = useState<Record<string, any>>({});
  const [saving, setSaving] = useState(false);

  // Hero video state
  const [currentVideoUrl, setCurrentVideoUrl] = useState('');
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const [videoSaveStatus, setVideoSaveStatus] = useState<'idle' | 'ok' | 'error'>('idle');
  const videoFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchContent();
    fetchHeroVideo();
  }, []);

  const fetchContent = async () => {
    try {
      const response = await fetch('/api/content', { cache: 'no-store' });
      const data = await response.json();
      setContent(data);
    } catch (error) {
      console.error('Error fetching content:', error);
    }
  };

  const fetchHeroVideo = async () => {
    try {
      const res = await fetch('/api/hero-video', { cache: 'no-store' });
      if (res.ok) {
        const { heroVideoUrl } = await res.json();
        setCurrentVideoUrl(heroVideoUrl || '');
      }
    } catch (err) {
      console.error('Error fetching hero video:', err);
    }
  };

  const handleVideoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate it's a video
    if (!file.type.startsWith('video/')) {
      alert('Please select a video file (mp4, mov, etc.)');
      return;
    }

    setUploadingVideo(true);
    setVideoSaveStatus('idle');
    setUploadProgress('Uploading video to Supabase storage...');

    try {
      // Step 1: Upload the video file to Supabase via /api/upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'hero-home');

      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadRes.ok) {
        const err = await uploadRes.json();
        throw new Error(err.details || err.error || 'Upload failed');
      }

      const { url: videoUrl } = await uploadRes.json();
      setUploadProgress('Saving video URL to database...');

      // Step 2: Save the returned public URL via /api/hero-video
      const saveRes = await fetch('/api/hero-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ heroVideoUrl: videoUrl }),
      });

      if (!saveRes.ok) {
        const err = await saveRes.json();
        throw new Error(err.error || 'Failed to save URL');
      }

      setCurrentVideoUrl(videoUrl);
      setVideoSaveStatus('ok');
      setUploadProgress('');
      // Reset file input
      if (videoFileInputRef.current) videoFileInputRef.current.value = '';
    } catch (err: any) {
      console.error('Hero video upload error:', err);
      setVideoSaveStatus('error');
      setUploadProgress('');
      alert('Error uploading video: ' + err.message);
    } finally {
      setUploadingVideo(false);
    }
  };

  const handleSave = async (section: string) => {
    setSaving(true);
    try {
      const response = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          page: selectedPage,
          section: section,
          data: content[selectedPage]?.[section] || {},
        }),
      });

      if (!response.ok) {
        const result = await response.json();
        alert('Error: ' + (result.details || result.error || 'Unknown error'));
        return;
      }

      await fetchContent();
      alert('Content updated successfully!');
    } catch (error) {
      alert('Network error occurred.');
    } finally {
      setSaving(false);
    }
  };

  const updateSection = (section: string, field: string, value: string) => {
    setContent({
      ...content,
      [selectedPage]: {
        ...content[selectedPage],
        [section]: {
          ...(content[selectedPage]?.[section] || {}),
          [field]: value,
        },
      },
    });
  };

  const pageContent: PageContent | undefined = content[selectedPage];
  const pages = ['home', 'services', 'gallery', 'booking', 'footer'];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Website Content Management</h1>
        <p className="text-gray-600">Edit all text, titles, and content on your main website</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <h3 className="text-lg font-bold mb-4">Select Page to Edit</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {pages.map((page) => {
            const isActive = selectedPage === page;
            const btnClass = "px-6 py-3 rounded-lg font-semibold uppercase transition-colors " +
              (isActive ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200');
            return (
              <button key={page} onClick={() => setSelectedPage(page)} className={btnClass}>
                {page}
              </button>
            );
          })}
        </div>
      </div>

      {/* Hero Video Upload — only shown on home page */}
      {selectedPage === 'home' && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border-2 border-indigo-300">
          <h3 className="text-xl font-bold text-indigo-900 mb-1">🎬 Home Page — Hero Background Video</h3>
          <p className="text-sm text-indigo-600 mb-5">
            This is the video playing behind <strong>"The Editorial Experience / Opulence &amp; Grace"</strong> text on the homepage.
          </p>

          {/* Current video preview */}
          {currentVideoUrl && (
            <div className="mb-5">
              <p className="text-sm font-medium text-gray-600 mb-2">Current video:</p>
              <video
                src={currentVideoUrl}
                className="w-full max-w-md rounded-lg border border-indigo-200"
                style={{ maxHeight: '200px', objectFit: 'cover' }}
                controls
                muted
              />
            </div>
          )}

          {/* Upload control */}
          <div className="flex flex-col gap-3">
            <label className="block text-sm font-bold text-indigo-800">
              Upload New Hero Video
              <span className="font-normal text-gray-500 ml-2">(mp4, mov — will replace the current video)</span>
            </label>

            {/* Hidden file input */}
            <input
              ref={videoFileInputRef}
              type="file"
              accept="video/*"
              className="hidden"
              onChange={handleVideoFileChange}
              disabled={uploadingVideo}
            />

            {/* Styled upload button */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => videoFileInputRef.current?.click()}
                disabled={uploadingVideo}
                className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-60 transition-colors"
              >
                {uploadingVideo ? (
                  <>
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                    </svg>
                    Uploading...
                  </>
                ) : (
                  <>
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    Choose Video File
                  </>
                )}
              </button>

              {uploadProgress && (
                <span className="text-sm text-indigo-600 font-medium">{uploadProgress}</span>
              )}
            </div>

            {videoSaveStatus === 'ok' && (
              <p className="text-green-600 font-semibold text-sm mt-1">
                ✅ Video uploaded and saved! The home page now shows the new video.
              </p>
            )}
            {videoSaveStatus === 'error' && (
              <p className="text-red-600 font-semibold text-sm mt-1">
                ❌ Upload failed. Please try again.
              </p>
            )}
          </div>
        </div>
      )}

      {pageContent && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Hero Section (Text)</h3>
              <button
                onClick={() => handleSave('hero')}
                disabled={saving}
                className="btn-primary"
              >
                {saving ? 'Saving...' : 'Save Hero Text'}
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  value={pageContent.hero?.title || ''}
                  onChange={(e) => updateSection('hero', 'title', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Subtitle</label>
                <input
                  type="text"
                  value={pageContent.hero?.subtitle || ''}
                  onChange={(e) => updateSection('hero', 'subtitle', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={pageContent.hero?.description || ''}
                  onChange={(e) => updateSection('hero', 'description', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                  rows={3}
                />
              </div>
            </div>
          </div>

          {selectedPage === 'home' && pageContent.about && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">About Section</h3>
                <button
                  onClick={() => handleSave('about')}
                  disabled={saving}
                  className="btn-primary"
                >
                  {saving ? 'Saving...' : 'Save About'}
                </button>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <input
                    type="text"
                    value={pageContent.about.title || ''}
                    onChange={(e) => updateSection('about', 'title', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    value={pageContent.about.description || ''}
                    onChange={(e) => updateSection('about', 'description', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                    rows={4}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
