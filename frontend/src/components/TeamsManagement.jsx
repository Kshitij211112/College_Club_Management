import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import TeamCard from './TeamCard';
import AddTeamModal from './AddTeamModal';
import AddMemberModal from './AddMemberModal';
import './TeamsManagement.css';

const TeamsManagement = ({ clubId, isPresident, currentUserId }) => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddTeam, setShowAddTeam] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [showAddMember, setShowAddMember] = useState(false);

  // Memoized fetch function to prevent unnecessary re-renders
  const fetchTeams = useCallback(async () => {
    try {
      setLoading(true);
      // Matching the nested route in your server.js: /api/clubs/:clubId/teams
      const response = await axios.get(`http://localhost:8000/api/clubs/${clubId}/teams`);
      
      // Handle your controller's specific response structure: { success: true, data: [...] }
      const incomingData = response.data.data || response.data;
      setTeams(Array.isArray(incomingData) ? incomingData : []);
      setError('');
    } catch (err) {
      setError('Failed to load teams. Please ensure the server is running.');
      console.error('Fetch Teams Error:', err);
    } finally {
      setLoading(false);
    }
  }, [clubId]);

  useEffect(() => {
    if (clubId) {
      fetchTeams();
    }
  }, [clubId, fetchTeams]);

  // Create a new sub-team (e.g., Videography, Technical)
  const handleCreateTeam = async (teamData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `http://localhost:8000/api/clubs/${clubId}/teams`,
        teamData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const newTeam = response.data.data || response.data;
      setTeams(prev => [...prev, newTeam]);
      setShowAddTeam(false);
      alert('Team created successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create team');
    }
  };

  // Add a student to a specific team
  const handleAddMember = async (teamId, memberData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `http://localhost:8000/api/clubs/${clubId}/teams/${teamId}/members`,
        memberData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updatedTeam = response.data.data || response.data;
      setTeams(prev => prev.map(t => (t._id === teamId ? updatedTeam : t)));
      setShowAddMember(false);
      setSelectedTeam(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add member');
    }
  };

  // Remove member from team
  const handleRemoveMember = async (teamId, memberId) => {
    if (!window.confirm('Remove this member from the team?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(
        `http://localhost:8000/api/clubs/${clubId}/teams/${teamId}/members/${memberId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updatedTeam = response.data.data || response.data;
      setTeams(prev => prev.map(t => (t._id === teamId ? updatedTeam : t)));
    } catch (err) {
      alert('Error removing member');
    }
  };

  // Update role (Member -> Lead / Co-Lead)
  const handleUpdateRole = async (teamId, memberId, newRole) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `http://localhost:8000/api/clubs/${clubId}/teams/${teamId}/members/${memberId}`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updatedTeam = response.data.data || response.data;
      setTeams(prev => prev.map(t => (t._id === teamId ? updatedTeam : t)));
    } catch (err) {
      alert('Error updating role');
    }
  };

  // Delete the entire sub-team
  const handleDeleteTeam = async (teamId) => {
    if (!window.confirm('Delete this entire team? This cannot be undone.')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `http://localhost:8000/api/clubs/${clubId}/teams/${teamId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTeams(prev => prev.filter(t => t._id !== teamId));
    } catch (err) {
      alert('Error deleting team');
    }
  };

  if (loading) return <div className="loading-state">Gathering club teams...</div>;

  return (
    <div className="teams-management">
      <div className="teams-header">
        <h2>Club Departments & Teams</h2>
        {isPresident && (
          <button className="btn-create-team" onClick={() => setShowAddTeam(true)}>
            <i className="fas fa-plus"></i> Create New Team
          </button>
        )}
      </div>

      {error && <div className="error-banner">{error}</div>}

      {teams.length === 0 ? (
        <div className="empty-state">
          <p>No teams have been created for this club yet.</p>
          {isPresident && <p>Start by creating a team like "Marketing" or "Technical".</p>}
        </div>
      ) : (
        <div className="teams-grid">
          {teams.map(team => (
            <TeamCard
              key={team._id}
              team={team}
              isPresident={isPresident}
              onAddMember={() => {
                setSelectedTeam(team);
                setShowAddMember(true);
              }}
              onRemoveMember={handleRemoveMember}
              onUpdateRole={handleUpdateRole}
              onDeleteTeam={handleDeleteTeam}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      {showAddTeam && (
        <AddTeamModal 
          onClose={() => setShowAddTeam(false)} 
          onSubmit={handleCreateTeam} 
        />
      )}

      {showAddMember && selectedTeam && (
        <AddMemberModal
          teamName={selectedTeam.name}
          onClose={() => setShowAddMember(false)}
          onSubmit={(memberData) => handleAddMember(selectedTeam._id, memberData)}
        />
      )}
    </div>
  );
};

export default TeamsManagement;