"use client";

import { useState } from "react";

export default function TeamManagement() {
  const [teamMembers, setTeamMembers] = useState([
    { id: 1, name: "Sarah Johnson", role: "Master Hair Stylist", specialty: "Hair Coloring", experience: "12 years", initials: "SJ", color: "from-pink-500 to-rose-500" },
    { id: 2, name: "Michael Chen", role: "Senior Stylist", specialty: "Men's Grooming", experience: "10 years", initials: "MC", color: "from-blue-500 to-cyan-500" },
    { id: 3, name: "Elena Rodriguez", role: "Spa Director", specialty: "Facial Treatments", experience: "15 years", initials: "ER", color: "from-purple-500 to-pink-500" },
    { id: 4, name: "James Wilson", role: "Creative Director", specialty: "Bridal Styling", experience: "14 years", initials: "JW", color: "from-amber-500 to-orange-500" },
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [newMember, setNewMember] = useState({
    name: "",
    role: "",
    specialty: "",
    experience: "",
    initials: "",
    color: "from-blue-500 to-purple-500",
  });

  const handleAdd = () => {
    if (newMember.name && newMember.role && newMember.specialty) {
      setTeamMembers([...teamMembers, { ...newMember, id: teamMembers.length + 1 }]);
      setNewMember({ name: "", role: "", specialty: "", experience: "", initials: "", color: "from-blue-500 to-purple-500" });
      setIsAdding(false);
    }
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to remove this team member?")) {
      setTeamMembers(teamMembers.filter((m) => m.id !== id));
    }
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
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Add Member</span>
        </button>
      </div>

      {/* Add Member Form */}
      {isAdding && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h3 className="text-xl font-bold mb-4">Add New Team Member</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Full Name"
              value={newMember.name}
              onChange={(e) => setNewMember({ ...newMember, name: e.target.value, initials: e.target.value.split(' ').map(n => n[0]).join('').toUpperCase() })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
            <input
              type="text"
              placeholder="Role"
              value={newMember.role}
              onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
            <input
              type="text"
              placeholder="Specialty"
              value={newMember.specialty}
              onChange={(e) => setNewMember({ ...newMember, specialty: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
            <input
              type="text"
              placeholder="Experience (e.g., 10 years)"
              value={newMember.experience}
              onChange={(e) => setNewMember({ ...newMember, experience: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div className="flex space-x-3 mt-4">
            <button onClick={handleAdd} className="btn-primary">
              Add Member
            </button>
            <button
              onClick={() => setIsAdding(false)}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Team Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teamMembers.map((member) => (
          <div key={member.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            <div className="h-32 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              <div className={`w-24 h-24 bg-gradient-to-br ${member.color} rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-xl`}>
                {member.initials}
              </div>
            </div>

            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
              <p className="text-primary-600 font-semibold mb-3">{member.role}</p>

              <div className="space-y-2 mb-4 text-sm">
                <div className="flex items-center text-gray-600">
                  <svg className="w-4 h-4 mr-2 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {member.specialty}
                </div>
                <div className="flex items-center text-gray-600">
                  <svg className="w-4 h-4 mr-2 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {member.experience} experience
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => alert("Edit functionality")}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(member.id)}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
