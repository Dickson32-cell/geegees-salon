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
  heroVideoUrl?: string; // New field for the home page hero video
}

interface PageContent {
  hero: ContentSection;
  about?: ContentSection;
  cta?: ContentSection;
}

export default function ContentManagement() {
  const [selectedPage, setSelectedPage] = useState<'home' | 'services' | 'gallery' | 'booking' | 'footer'>('home');
  const [content, setContent] = useState<Record<string, any>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const response = await fetch('/api/content');
      const data = await response.json();
      setContent(data);
    } catch (error) {
      console.error('Error fetching content:', error);
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
          section,
          data: content[selectedPage][section as keyof PageContent],
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error('Save failed:', result);
        alert('❌ Failed to save content: ' + (result.details || result.error || 'Unknown error'));
        return;
      }

      await fetchContent();
      alert('✅ Content updated successfully! Refresh your main website to see the changes.');
    } catch (error) {
      console.error('Error saving content:', error);
      alert('❌ Network error: Unable to save content.');
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

  const pageContent = content[selectedPage];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Website Content Management</h1>
        <p className="text-gray-600">Edit all text, titles, and content on your main website</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <h3 className="text-lg font-bold mb-4">Select Page to Edit</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {['home', 'services', 'gallery', 'booking', 'footer'].map((page) => (
            <button
              key={page}
              onClick={() => setSelectedPage(page as any)}
              className={`px-6 py-3 rounded-lg font-semibold uppercase transition-colors ${
                selectedPage === page
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      </div>

      {pageContent && (
        <div className="space-y-6">
          {/* Hero Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Hero Section</h3>
              <button
                onClick={() => handleSave('hero')}
                disabled={saving}
                className="btn-primary"
              >
                {saving ? 'Saving...' : 'Save Hero'}
              </button>
            </div>

            <div className="space-y-4">
              {/* NEW VIDEO URL FIELD */}
              {selectedPage === 'home' && (
                <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-100 space-y-2">
                  <label className="block text-sm font-bold text-indigo-800 mb-2">Hero Video URL</label>
                  <input
                    type="text"
                    value={pageContent.hero?.heroVideoUrl || ''}
                    onChange={(e) => updateSection('hero', 'heroVideoUrl', e.target.value)}
                    className="w-full px-4 py-2 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 text-black"
                    placeholder="https://supabase...video.mp4"
                  />
                  <p className="text-xs text-indigo-600 italic">This controls the main background video on the home page.</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={pageContent.hero?.title || ''}
                  onChange={(e) => updateSection('hero', 'title', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                  placeholder="Enter title..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                <input
                  type="text"
                  value={pageContent.hero?.subtitle || ''}
                  onChange={(e) => updateSection('hero', 'subtitle', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                  placeholder="Enter subtitle..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={pageContent.hero?.description || ''}
                  onChange={(e) => updateSection('hero', 'description', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                  rows={3}
                  placeholder="Enter description..."
                />
              </div>
            </div>
          </div>

          {/* About Section (Home page only) */}
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={pageContent.about.title || ''}
                    onChange={(e) => updateSection('about', 'title', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
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
      </div>
    </div>
  );
}
