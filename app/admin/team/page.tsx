"use client";

import { useState, useEffect } from "react";

interface TeamMember {
  id: number;
  name: string;
  title: string;
  bio: string | null;
  specialties: string[];
  role?: string;
  active: boolean;
  display_order: number | null;
  photo_url?: string;
}

export default function TeamManagement() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [newMember, setNewMember] = useState({
    name: "",
    title: "",
    bio: "",
    specialties: "",
    role: "stylist",
    active: true,
    photoUrl: "",
  });

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/team');
      if (response.ok) {
        const data = await response.json();
        setTeamMembers(data);
      }
    } catch (error) {
      console.error('Error fetching team members:', error);
    } finally {
      setLoading(false);
    }
  };

  const uploadPhoto = async (file: File): Promise<string> => {
    const uploadFormData = new FormData();
    uploadFormData.append('file', file);
    uploadFormData.append('folder', 'team');

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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleAdd = async () => {
    if (!newMember.name || !newMember.title) {
      setErrorMessage('Please fill in at least Name and Title');
      return;
    }

    try {
      setUploading(true);
      setErrorMessage("");
      setSuccessMessage("");

      let photoUrl = newMember.photoUrl;
      if (selectedFile) {
        photoUrl = await uploadPhoto(selectedFile);
      }

      const specialtiesArray = newMember.specialties
        .split(',')
        .map(s => s.trim())
        .filter(s => s.length > 0);

      const response = await fetch('/api/team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newMember.name,
          title: newMember.title,
          bio: newMember.bio || null,
          specialties: specialtiesArray,
          role: newMember.role,
          active: newMember.active,
          photoUrl,
        }),
      });

      if (response.ok) {
        await fetchTeamMembers();
        cancelEdit();
        setSuccessMessage(`Team member "${newMember.name}" added successfully!`);
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        setErrorMessage(`Failed to add team member: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      setErrorMessage(`Failed to add team member: ${error instanceof Error ? error.message : 'Network error'}`);
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (member: TeamMember) => {
    setEditingId(member.id);
    setNewMember({
      name: member.name,
      title: member.title,
      bio: member.bio || "",
      specialties: member.specialties.join(', '),
      role: member.role || "stylist",
      active: member.active,
      photoUrl: member.photo_url || "",
    });
    setPreviewUrl(member.photo_url || "");
    setSelectedFile(null);
  };

  const handleUpdate = async () => {
    if (!editingId) return;

    try {
      setUploading(true);
      setErrorMessage("");
      setSuccessMessage("");

      let photoUrl = newMember.photoUrl;
      if (selectedFile) {
        photoUrl = await uploadPhoto(selectedFile);
      }

      const specialtiesArray = newMember.specialties
        .split(',')
        .map(s => s.trim())
        .filter(s => s.length > 0);

      const response = await fetch('/api/team', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingId,
          name: newMember.name,
          title: newMember.title,
          bio: newMember.bio || null,
          specialties: specialtiesArray,
          role: newMember.role,
          active: newMember.active,
          photoUrl,
        }),
      });

      if (response.ok) {
        await fetchTeamMembers();
        cancelEdit();
        setSuccessMessage(`Team member updated successfully!`);
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        setErrorMessage(`Failed to update team member: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      setErrorMessage(`Failed to update team member: ${error instanceof Error ? error.message : 'Network error'}`);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to remove this team member?")) return;

    try {
      const response = await fetch(`/api/team?id=${id}`, { method: 'DELETE' });
      if (response.ok) {
        await fetchTeamMembers();
        setSuccessMessage('Team member removed successfully!');
      } else {
        setErrorMessage('Failed to remove team member');
      }
    } catch (error) {
      setErrorMessage('Failed to remove team member');
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setIsAdding(false);
    setSelectedFile(null);
    setPreviewUrl("");
    setNewMember({ name: "", title: "", bio: "", specialties: "", role: "stylist", active: true, photoUrl: "" });
  };

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase();

  return (
    <div>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Team Management</h1>
          <p className="text-gray-600">Manage your salon team members and their photos</p>
        </div>
        <button
          onClick={() => { setIsAdding(true); setEditingId(null); }}
          className="btn-primary flex items-center space-x-2"
          disabled={editingId !== null || isAdding}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Add Member</span>
        </button>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center justify-between">
          <p className="text-green-700 font-medium">{successMessage}</p>
          <button onClick={() => setSuccessMessage("")} className="text-green-400 hover:text-green-600">✕</button>
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center justify-between">
          <p className="text-red-700 font-medium">{errorMessage}</p>
          <button onClick={() => setErrorMessage("")} className="text-red-400 hover:text-red-600">✕</button>
        </div>
      )}

      {/* Add/Edit Member Form */}
      {(isAdding || editingId !== null) && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h3 className="text-xl font-bold mb-4">
            {editingId ? 'Edit Team Member' : 'Add New Team Member'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name *</label>
              <input
                type="text"
                placeholder="Full Name"
                value={newMember.name}
                onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Title *</label>
              <input
                type="text"
                placeholder="e.g., Master Hair Stylist"
                value={newMember.title}
                onChange={(e) => setNewMember({ ...newMember, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Role *</label>
              <select
                value={newMember.role}
                onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="stylist">Stylist</option>
                <option value="receptionist">Receptionist</option>
                <option value="manager">Manager</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Specialties</label>
              <input
                type="text"
                placeholder="e.g., Hair Coloring, Bridal (comma separated)"
                value={newMember.specialties}
                onChange={(e) => setNewMember({ ...newMember, specialties: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Bio</label>
              <textarea
                placeholder="Brief bio about the team member"
                value={newMember.bio}
                onChange={(e) => setNewMember({ ...newMember, bio: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Photo Upload */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Profile Photo</label>
              <div className="flex items-start gap-6">
                {/* Preview */}
                <div className="w-28 h-28 rounded-full overflow-hidden bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center flex-shrink-0 shadow-md">
                  {previewUrl ? (
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-white text-2xl font-bold">
                      {newMember.name ? getInitials(newMember.name) : "?"}
                    </span>
                  )}
                </div>
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  <p className="text-xs text-slate-500 mt-1">Recommended: Square photo (JPG, PNG). This will appear on the website team page.</p>
                  {previewUrl && (
                    <button
                      onClick={() => { setPreviewUrl(""); setSelectedFile(null); setNewMember({ ...newMember, photoUrl: "" }); }}
                      className="mt-2 text-xs text-red-500 hover:text-red-700"
                    >
                      Remove photo
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="active"
                checked={newMember.active}
                onChange={(e) => setNewMember({ ...newMember, active: e.target.checked })}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded"
              />
              <label htmlFor="active" className="ml-2 text-sm font-semibold text-gray-700">
                Active (show on website)
              </label>
            </div>
          </div>
          <div className="flex space-x-3 mt-4">
            <button
              onClick={editingId ? handleUpdate : handleAdd}
              disabled={uploading}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
            >
              {uploading ? 'Uploading...' : (editingId ? 'Update Member' : 'Add Member')}
            </button>
            <button
              onClick={cancelEdit}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Team Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading team members...</p>
        </div>
      ) : teamMembers.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-lg">
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Team Members Yet</h3>
          <p className="text-gray-600 mb-4">Start by adding your first team member</p>
          <button onClick={() => setIsAdding(true)} className="btn-primary">Add First Member</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teamMembers.map((member) => (
            <div key={member.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              {/* Photo / Initials */}
              <div className="h-40 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center relative">
                {member.photo_url ? (
                  <img
                    src={member.photo_url}
                    alt={member.name}
                    className="w-full h-full object-cover object-top"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                ) : (
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-xl">
                    {getInitials(member.name)}
                  </div>
                )}
                {!member.active && (
                  <div className="absolute top-2 right-2 bg-gray-700/80 text-white text-xs px-2 py-1 rounded">Hidden</div>
                )}
              </div>

              <div className="p-5">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-lg font-bold text-gray-900">{member.name}</h3>
                  <span className={`px-2 py-1 text-xs rounded font-semibold ${!member.role || member.role === 'stylist' ? 'bg-blue-100 text-blue-700' :
                      member.role === 'receptionist' ? 'bg-green-100 text-green-700' :
                        'bg-purple-100 text-purple-700'
                    }`}>
                    {member.role ? member.role.charAt(0).toUpperCase() + member.role.slice(1) : 'Stylist'}
                  </span>
                </div>
                <p className="text-blue-600 font-semibold text-sm mb-3">{member.title}</p>

                {member.bio && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{member.bio}</p>
                )}

                {member.specialties && member.specialties.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {member.specialties.map((specialty, idx) => (
                      <span key={idx} className="px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-semibold">
                        {specialty}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(member)}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    disabled={editingId !== null || isAdding}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(member.id)}
                    className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
                    disabled={editingId !== null || isAdding}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
