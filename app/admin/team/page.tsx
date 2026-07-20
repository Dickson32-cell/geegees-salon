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
}

export default function TeamManagement() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newMember, setNewMember] = useState({
    name: "",
    title: "",
    bio: "",
    specialties: "",
    role: "stylist",
    active: true,
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
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('Failed to fetch team members:', errorData);
      }
    } catch (error) {
      console.error('Error fetching team members:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!newMember.name || !newMember.title) {
      alert('Please fill in at least Name and Title');
      return;
    }

    try {
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
        }),
      });

      if (response.ok) {
        await fetchTeamMembers();
        setNewMember({ name: "", title: "", bio: "", specialties: "", role: "stylist", active: true });
        setIsAdding(false);
        alert('Team member added successfully!');
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('Server error:', errorData);
        alert(`Failed to add team member: ${errorData.error || errorData.details || 'Unknown error'}\n\nCheck browser console for more details.`);
      }
    } catch (error) {
      console.error('Error adding team member:', error);
      alert(`Failed to add team member: ${error instanceof Error ? error.message : 'Network error'}\n\nCheck browser console for more details.`);
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
    });
  };

  const handleUpdate = async () => {
    if (!editingId) return;

    try {
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
        }),
      });

      if (response.ok) {
        await fetchTeamMembers();
        setNewMember({ name: "", title: "", bio: "", specialties: "", role: "stylist", active: true });
        setEditingId(null);
        alert('Team member updated successfully!');
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('Server error:', errorData);
        alert(`Failed to update team member: ${errorData.error || errorData.details || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error updating team member:', error);
      alert(`Failed to update team member: ${error instanceof Error ? error.message : 'Network error'}`);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to remove this team member?")) {
      return;
    }

    try {
      const response = await fetch(`/api/team?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchTeamMembers();
        alert('Team member removed successfully!');
      } else {
        alert('Failed to remove team member');
      }
    } catch (error) {
      console.error('Error deleting team member:', error);
      alert('Failed to remove team member');
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setIsAdding(false);
    setNewMember({ name: "", title: "", bio: "", specialties: "", role: "stylist", active: true });
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Team Management</h1>
          <p className="text-gray-600">Manage your salon team members</p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="btn-primary flex items-center space-x-2"
          disabled={editingId !== null}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Add Member</span>
        </button>
      </div>

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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Title *</label>
              <input
                type="text"
                placeholder="e.g., Master Hair Stylist"
                value={newMember.title}
                onChange={(e) => setNewMember({ ...newMember, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Role *</label>
              <select
                value={newMember.role}
                onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                <option value="stylist">Stylist</option>
                <option value="receptionist">Receptionist</option>
                <option value="manager">Manager</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Bio</label>
              <textarea
                placeholder="Brief bio about the team member"
                value={newMember.bio}
                onChange={(e) => setNewMember({ ...newMember, bio: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Specialties</label>
              <input
                type="text"
                placeholder="e.g., Hair Coloring, Bridal Styling (comma separated)"
                value={newMember.specialties}
                onChange={(e) => setNewMember({ ...newMember, specialties: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
              <p className="text-xs text-gray-500 mt-1">Separate multiple specialties with commas</p>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="active"
                checked={newMember.active}
                onChange={(e) => setNewMember({ ...newMember, active: e.target.checked })}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <label htmlFor="active" className="ml-2 text-sm font-semibold text-gray-700">
                Active (show on website)
              </label>
            </div>
          </div>
          <div className="flex space-x-3 mt-4">
            <button
              onClick={editingId ? handleUpdate : handleAdd}
              className="btn-primary"
            >
              {editingId ? 'Update Member' : 'Add Member'}
            </button>
            <button
              onClick={cancelEdit}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Team Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Loading team members...</p>
        </div>
      ) : teamMembers.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-lg">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Team Members Yet</h3>
          <p className="text-gray-600 mb-4">Start by adding your first team member</p>
          <button
            onClick={() => setIsAdding(true)}
            className="btn-primary"
          >
            Add First Member
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teamMembers.map((member) => (
            <div key={member.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="h-32 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-xl">
                  {getInitials(member.name)}
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
                  <div className="flex gap-2">
                    <span className={`px-2 py-1 text-xs rounded font-semibold ${
                      !member.role || member.role === 'stylist' ? 'bg-blue-100 text-blue-700' :
                      member.role === 'receptionist' ? 'bg-green-100 text-green-700' :
                      'bg-purple-100 text-purple-700'
                    }`}>
                      {member.role ? member.role.charAt(0).toUpperCase() + member.role.slice(1) : 'Stylist'}
                    </span>
                    {!member.active && (
                      <span className="px-2 py-1 bg-gray-200 text-gray-600 text-xs rounded">Hidden</span>
                    )}
                  </div>
                </div>
                <p className="text-primary-600 font-semibold mb-3">{member.title}</p>

                {member.bio && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{member.bio}</p>
                )}

                {member.specialties && member.specialties.length > 0 && (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {member.specialties.map((specialty, idx) => (
                        <span
                          key={idx}
                          className="inline-block px-3 py-1 bg-primary-50 text-primary-600 rounded-full text-xs font-semibold"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(member)}
                    className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    disabled={editingId !== null || isAdding}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(member.id)}
                    className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
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
