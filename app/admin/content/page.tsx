"use client";

import React, { useState, useEffect } from 'react';

interface ContentSection {
  title: string;
  subtitle?: string;
  description?: string;
  stat1Value?: string;
  stat1Label?: string;
  stat2Value?: string;
  stat2Label?: string;
  buttonText?: string;
  buttonLink?: string;
  heroVideoUrl?: string;
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

  // Dedicated state + save for the hero video URL
  const [heroVideoInput, setHeroVideoInput] = useState('');
  const [savingVideo, setSavingVideo] = useState(false);
  const [videoSaveStatus, setVideoSaveStatus] = useState<'idle' | 'ok' | 'error'>('idle');

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

  // Fetch the current hero video URL directly from dedicated endpoint
  const fetchHeroVideo = async () => {
    try {
      const res = await fetch('/api/hero-video', { cache: 'no-store' });
      if (res.ok) {
        const { heroVideoUrl } = await res.json();
        setHeroVideoInput(heroVideoUrl || '');
      }
    } catch (err) {
      console.error('Error fetching hero video:', err);
    }
  };

  // Save the hero video URL via dedicated endpoint
  const handleSaveHeroVideo = async () => {
    if (!heroVideoInput.trim()) {
      alert('Please enter a video URL first.');
      return;
    }
    setSavingVideo(true);
    setVideoSaveStatus('idle');
    try {
      const res = await fetch('/api/hero-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ heroVideoUrl: heroVideoInput.trim() }),
      });
      if (res.ok) {
        setVideoSaveStatus('ok');
        alert('Hero video updated successfully! The home page will now show the new video.');
      } else {
        const result = await res.json();
        setVideoSaveStatus('error');
        alert('Error saving video: ' + (result.error || 'Unknown error'));
      }
    } catch (err) {
      setVideoSaveStatus('error');
      alert('Network error saving video.');
    } finally {
      setSavingVideo(false);
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
            const className = "px-6 py-3 rounded-lg font-semibold uppercase transition-colors " +
              (isActive ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200');
            return (
              <button
                key={page}
                onClick={() => setSelectedPage(page)}
                className={className}
              >
                {page}
              </button>
            );
          })}
        </div>
      </div>

      {/* Dedicated Hero Video card — always visible on home page */}
      {selectedPage === 'home' && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border-2 border-indigo-300">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-xl font-bold text-indigo-900">🎬 Home Page — Hero Background Video</h3>
              <p className="text-sm text-indigo-600 mt-1">
                This controls the video playing behind &quot;The Editorial Experience / Opulence &amp; Grace&quot; text on the homepage.
              </p>
            </div>
            <button
              onClick={handleSaveHeroVideo}
              disabled={savingVideo}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-60 transition-colors"
            >
              {savingVideo ? 'Saving...' : '💾 Save Video'}
            </button>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-indigo-800">Video URL <span className="font-normal text-gray-500">(paste the direct Supabase video link)</span></label>
            <input
              type="text"
              value={heroVideoInput}
              onChange={(e) => setHeroVideoInput(e.target.value)}
              className="w-full px-4 py-3 border-2 border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 text-black text-sm"
              placeholder="https://...supabase.co/storage/v1/object/public/salon-images/...video.mp4"
            />
            {videoSaveStatus === 'ok' && (
              <p className="text-green-600 font-semibold text-sm">✅ Video URL saved! Home page will use the new video.</p>
            )}
            {videoSaveStatus === 'error' && (
              <p className="text-red-600 font-semibold text-sm">❌ Failed to save. Please try again.</p>
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
