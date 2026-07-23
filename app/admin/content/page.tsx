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
  social?: any;
}

export default function ContentManagement() {
  const [selectedPage, setSelectedPage] = useState('home');
  const [content, setContent] = useState<Record<string, any>>({});
  const [saving, setSaving] = useState(false);

  // Hero videos state
  const [heroVideos, setHeroVideos] = useState<string[]>([]);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'ok' | 'error'>('idle');
  const [deletingUrl, setDeletingUrl] = useState<string | null>(null);
  const videoFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchContent();
    fetchHeroVideos();
  }, []);

  const fetchContent = async () => {
    try {
      const res = await fetch('/api/content', { cache: 'no-store' });
      const data = await res.json();
      setContent(data);
    } catch (e) { console.error(e); }
  };

  const fetchHeroVideos = async () => {
    try {
      const res = await fetch('/api/hero-video', { cache: 'no-store' });
      if (res.ok) {
        const { heroVideos: vids } = await res.json();
        setHeroVideos(Array.isArray(vids) ? vids : []);
      }
    } catch (e) { console.error(e); }
  };

  const handleVideoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('video/')) {
      alert('Please select a video file (mp4, mov, etc.)');
      return;
    }
    setUploadingVideo(true);
    setUploadStatus('idle');
    setUploadProgress('Uploading to Supabase storage...');
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'hero-home');
      const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData });
      if (!uploadRes.ok) {
        const err = await uploadRes.json();
        throw new Error(err.details || err.error || 'Upload failed');
      }
      const { url } = await uploadRes.json();
      setUploadProgress('Saving to database...');
      const saveRes = await fetch('/api/hero-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ heroVideoUrl: url }),
      });
      if (!saveRes.ok) throw new Error('Failed to save URL');
      const { heroVideos: updated } = await saveRes.json();
      setHeroVideos(updated || []);
      setUploadStatus('ok');
      setUploadProgress('');
      if (videoFileInputRef.current) videoFileInputRef.current.value = '';
    } catch (err: any) {
      setUploadStatus('error');
      setUploadProgress('');
      alert('Upload error: ' + err.message);
    } finally {
      setUploadingVideo(false);
    }
  };

  const handleDeleteVideo = async (url: string) => {
    if (!confirm('Remove this video from the hero slideshow?')) return;
    setDeletingUrl(url);
    try {
      const res = await fetch('/api/hero-video', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ heroVideoUrl: url }),
      });
      if (res.ok) {
        const { heroVideos: updated } = await res.json();
        setHeroVideos(updated || []);
      } else {
        alert('Failed to delete video.');
      }
    } catch (e) { alert('Network error.'); }
    finally { setDeletingUrl(null); }
  };

  const handleSave = async (section: string) => {
    setSaving(true);
    try {
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          page: selectedPage,
          section,
          data: content[selectedPage]?.[section] || {},
        }),
      });
      if (!res.ok) {
        const r = await res.json();
        alert('Error: ' + (r.details || r.error));
        return;
      }
      await fetchContent();
      alert('Content updated!');
    } catch { alert('Network error.'); }
    finally { setSaving(false); }
  };

  const updateSection = (section: string, field: string, value: string) => {
    setContent({
      ...content,
      [selectedPage]: {
        ...content[selectedPage],
        [section]: { ...(content[selectedPage]?.[section] || {}), [field]: value },
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

      {/* Page selector */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <h3 className="text-lg font-bold mb-4">Select Page to Edit</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {pages.map((page) => (
            <button
              key={page}
              onClick={() => setSelectedPage(page)}
              className={`px-6 py-3 rounded-lg font-semibold uppercase transition-colors ${selectedPage === page ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >{page}</button>
          ))}
        </div>
      </div>

      {/* Hero Video Manager — only on Home */}
      {selectedPage === 'home' && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border-2 border-indigo-300">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="text-xl font-bold text-indigo-900">🎬 Hero Background Videos</h3>
              <p className="text-sm text-indigo-600 mt-1">
                Videos cycle in the background behind <strong>"The Editorial Experience"</strong> text.
                {heroVideos.length > 0 && (
                  <span className="ml-2 bg-indigo-100 text-indigo-800 text-xs font-bold px-2 py-0.5 rounded-full">
                    {heroVideos.length} video{heroVideos.length !== 1 ? 's' : ''} in rotation
                  </span>
                )}
              </p>
            </div>
            {/* Upload button */}
            <button
              onClick={() => { setUploadStatus('idle'); videoFileInputRef.current?.click(); }}
              disabled={uploadingVideo}
              className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-60 transition-colors text-sm whitespace-nowrap"
            >
              {uploadingVideo ? (
                <>
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Uploading...
                </>
              ) : (
                <>
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  + Upload Video
                </>
              )}
            </button>
            <input ref={videoFileInputRef} type="file" accept="video/*" className="hidden" onChange={handleVideoFileChange} disabled={uploadingVideo} />
          </div>

          {uploadProgress && <p className="text-sm text-indigo-600 font-medium mb-3">{uploadProgress}</p>}
          {uploadStatus === 'ok' && <p className="text-green-600 font-semibold text-sm mb-3">✅ Video added to the slideshow!</p>}
          {uploadStatus === 'error' && <p className="text-red-600 font-semibold text-sm mb-3">❌ Upload failed. Please try again.</p>}

          {/* Video grid */}
          {heroVideos.length === 0 ? (
            <div className="border-2 border-dashed border-indigo-200 rounded-lg p-8 text-center text-indigo-400">
              <svg className="h-10 w-10 mx-auto mb-2 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M4 8a2 2 0 00-2 2v4a2 2 0 002 2h8a2 2 0 002-2v-4a2 2 0 00-2-2H4z" />
              </svg>
              <p className="font-medium">No videos yet. Click <strong>+ Upload Video</strong> to add one.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {heroVideos.map((url, i) => (
                <div key={url} className="relative group rounded-lg overflow-hidden border border-indigo-100 bg-gray-50">
                  <video
                    src={url}
                    className="w-full h-32 object-cover"
                    muted
                    playsInline
                    onMouseEnter={e => (e.currentTarget as HTMLVideoElement).play()}
                    onMouseLeave={e => { const v = e.currentTarget as HTMLVideoElement; v.pause(); v.currentTime = 0; }}
                  />
                  <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                    #{i + 1}
                  </div>
                  <button
                    onClick={() => handleDeleteVideo(url)}
                    disabled={deletingUrl === url}
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                    title="Remove this video"
                  >
                    {deletingUrl === url ? '…' : '×'}
                  </button>
                  <p className="text-xs text-gray-400 p-2 truncate">{url.split('/').pop()}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Other content sections */}
      {pageContent && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Hero Section (Text)</h3>
              <button onClick={() => handleSave('hero')} disabled={saving} className="btn-primary">
                {saving ? 'Saving...' : 'Save Hero Text'}
              </button>
            </div>
            <div className="space-y-4">
              {['title', 'subtitle', 'description'].map((field) => (
                <div key={field} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 capitalize">{field}</label>
                  {field === 'description' ? (
                    <textarea
                      value={(pageContent.hero as any)?.[field] || ''}
                      onChange={(e) => updateSection('hero', field, e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                      rows={3}
                    />
                  ) : (
                    <input
                      type="text"
                      value={(pageContent.hero as any)?.[field] || ''}
                      onChange={(e) => updateSection('hero', field, e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {selectedPage === 'home' && pageContent.about && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">About Section</h3>
                <button onClick={() => handleSave('about')} disabled={saving} className="btn-primary">
                  {saving ? 'Saving...' : 'Save About'}
                </button>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <input type="text" value={pageContent.about.title || ''} onChange={(e) => updateSection('about', 'title', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary" />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea value={pageContent.about.description || ''} onChange={(e) => updateSection('about', 'description', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary" rows={4} />
                </div>
              </div>
            </div>
          )}

          {selectedPage === 'footer' && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Social Links</h3>
                <button onClick={() => handleSave('social')} disabled={saving} className="btn-primary">
                  {saving ? 'Saving...' : 'Save Social Links'}
                </button>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Visible Social Handle</label>
                  <select
                    value={(pageContent.social as any)?.activeSocialHandle || 'all'}
                    onChange={(e) => updateSection('social', 'activeSocialHandle', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                  >
                    <option value="all">Show All</option>
                    <option value="instagram">Instagram</option>
                    <option value="snapchat">Snapchat</option>
                    <option value="youtube">YouTube</option>
                    <option value="tiktok">TikTok</option>
                    <option value="whatsapp">WhatsApp</option>
                  </select>
                  <p className="text-xs text-gray-500">Choose which social handle to show on the main web page footer.</p>
                </div>
                {['instagramUrl', 'snapchatUrl', 'youtubeUrl', 'tiktokUrl', 'whatsappUrl'].map((field) => (
                  <div key={field} className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 capitalize">{field.replace('Url', '')}</label>
                    <input
                      type="text"
                      value={(pageContent.social as any)?.[field] || ''}
                      onChange={(e) => updateSection('social', field, e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                      placeholder="https://..."
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
