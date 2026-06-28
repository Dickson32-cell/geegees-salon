"use client";

import { useState, useEffect } from "react";

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
      await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          page: selectedPage,
          section,
          data: content[selectedPage][section as keyof PageContent],
        }),
      });
      alert('Content updated successfully!');
    } catch (error) {
      console.error('Error saving content:', error);
      alert('Error saving content');
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
          ...(content[selectedPage]?.[section as keyof PageContent] || {}),
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

      {/* Page Selector */}
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

      {/* Content Editor */}
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
              {pageContent.hero?.subtitle !== undefined && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                  <input
                    type="text"
                    value={pageContent.hero.subtitle || ''}
                    onChange={(e) => updateSection('hero', 'subtitle', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                    placeholder="Enter subtitle..."
                  />
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

              {pageContent.hero?.description !== undefined && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={pageContent.hero.description || ''}
                    onChange={(e) => updateSection('hero', 'description', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                    rows={3}
                    placeholder="Enter description..."
                  />
                </div>
              )}

              {pageContent.hero?.buttonText !== undefined && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Button Text</label>
                    <input
                      type="text"
                      value={pageContent.hero.buttonText || ''}
                      onChange={(e) => updateSection('hero', 'buttonText', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                      placeholder="Button text..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Button Link</label>
                    <input
                      type="text"
                      value={pageContent.hero.buttonLink || ''}
                      onChange={(e) => updateSection('hero', 'buttonLink', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                      placeholder="/services"
                    />
                  </div>
                </div>
              )}
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

                <div className="border-t pt-4">
                  <h4 className="text-md font-semibold mb-3 text-gray-800">Statistics</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Stat 1 Value (e.g. 15+)</label>
                      <input
                        type="text"
                        value={(pageContent.about as any).stat1Value || ''}
                        onChange={(e) => updateSection('about', 'stat1Value', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                        placeholder="15+"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Stat 1 Label</label>
                      <input
                        type="text"
                        value={(pageContent.about as any).stat1Label || ''}
                        onChange={(e) => updateSection('about', 'stat1Label', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                        placeholder="Years of Mastery"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Stat 2 Value (e.g. 24k)</label>
                      <input
                        type="text"
                        value={(pageContent.about as any).stat2Value || ''}
                        onChange={(e) => updateSection('about', 'stat2Value', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                        placeholder="24k"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Stat 2 Label</label>
                      <input
                        type="text"
                        value={(pageContent.about as any).stat2Label || ''}
                        onChange={(e) => updateSection('about', 'stat2Label', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                        placeholder="Clients Styled"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t pt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Button Text</label>
                    <input
                      type="text"
                      value={pageContent.about.buttonText || ''}
                      onChange={(e) => updateSection('about', 'buttonText', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Button Link</label>
                    <input
                      type="text"
                      value={pageContent.about.buttonLink || ''}
                      onChange={(e) => updateSection('about', 'buttonLink', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CTA Section (Home page only) */}
          {selectedPage === 'home' && pageContent.cta && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Call-to-Action Section</h3>
                <button
                  onClick={() => handleSave('cta')}
                  disabled={saving}
                  className="btn-primary"
                >
                  {saving ? 'Saving...' : 'Save CTA'}
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={pageContent.cta.title || ''}
                    onChange={(e) => updateSection('cta', 'title', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={pageContent.cta.description || ''}
                    onChange={(e) => updateSection('cta', 'description', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Button Text</label>
                    <input
                      type="text"
                      value={pageContent.cta.buttonText || ''}
                      onChange={(e) => updateSection('cta', 'buttonText', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Button Link</label>
                    <input
                      type="text"
                      value={pageContent.cta.buttonLink || ''}
                      onChange={(e) => updateSection('cta', 'buttonLink', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Footer Content (Footer page only) */}
          {selectedPage === 'footer' && (
            <>
              {/* Contact Information */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold">Contact Information</h3>
                  <button
                    onClick={() => handleSave('contact')}
                    disabled={saving}
                    className="btn-primary"
                  >
                    {saving ? 'Saving...' : 'Save Contact'}
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                    <textarea
                      value={pageContent?.contact?.address || ''}
                      onChange={(e) => updateSection('contact', 'address', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                      rows={2}
                      placeholder="123 Editorial Way,&#10;Fashion District, NY"
                    />
                    <p className="text-xs text-gray-500 mt-1">Use line breaks for multiple lines</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <input
                      type="text"
                      value={pageContent?.contact?.phone || ''}
                      onChange={(e) => updateSection('contact', 'phone', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                      placeholder="+1 (555) 987-6543"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <input
                      type="email"
                      value={pageContent?.contact?.email || ''}
                      onChange={(e) => updateSection('contact', 'email', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                      placeholder="concierge@geegees.com"
                    />
                  </div>
                </div>
              </div>

              {/* Social Media Links */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold">Social Media Links</h3>
                  <button
                    onClick={() => handleSave('social')}
                    disabled={saving}
                    className="btn-primary"
                  >
                    {saving ? 'Saving...' : 'Save Social Links'}
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Instagram URL</label>
                    <input
                      type="url"
                      value={pageContent?.social?.instagramUrl || ''}
                      onChange={(e) => updateSection('social', 'instagramUrl', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                      placeholder="https://instagram.com/geegees"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Facebook URL</label>
                    <input
                      type="url"
                      value={pageContent?.social?.facebookUrl || ''}
                      onChange={(e) => updateSection('social', 'facebookUrl', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                      placeholder="https://facebook.com/geegees"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">YouTube URL</label>
                    <input
                      type="url"
                      value={pageContent?.social?.youtubeUrl || ''}
                      onChange={(e) => updateSection('social', 'youtubeUrl', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                      placeholder="https://youtube.com/@geegees"
                    />
                  </div>

                  <p className="text-xs text-gray-500 mt-2">
                    💡 Use "#" to disable a social link. Leave empty or use full URL to enable.
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      <div className="mt-8 p-6 bg-blue-50 rounded-lg">
        <h4 className="font-bold text-blue-900 mb-2">💡 How it works</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Edit any text field and click "Save" to update the content</li>
          <li>• Changes will appear immediately on the main website</li>
          <li>• Select different pages using the buttons above to edit their content</li>
          <li>• Services are managed separately in the Services page</li>
        </ul>
      </div>
    </div>
  );
}
