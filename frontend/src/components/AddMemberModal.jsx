import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddMemberModal = ({ team, clubId, onClose, onSubmit }) => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [role, setRole] = useState('member');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAvailableUsers();
  }, []);

  const fetchAvailableUsers = async () => {
    try {
      setLoading(true);
      // You'll need to create this endpoint to get users who are not already in the team
      const response = await axios.get(`/api/users?clubId=${clubId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      // Filter out users already in the team
      const existingUserIds = team.members.map(m => m.user._id);
      const availableUsers = response.data.data.filter(
        user => !existingUserIds.includes(user._id)
      );
      
      setUsers(availableUsers);
    } catch (err) {
      console.error('Error fetching users:', err);
      alert('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedUser) {
      alert('Please select a user');
      return;
    }
    onSubmit({
      userId: selectedUser._id,
      role: role
    });
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Add Member to {team.name}</h3>
          <button className="btn-close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="userSearch">Search Users</label>
            <input
              id="userSearch"
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label>Select User *</label>
            {loading ? (
              <p>Loading users...</p>
            ) : filteredUsers.length === 0 ? (
              <p className="no-results">
                {searchTerm ? 'No users found' : 'No available users'}
              </p>
            ) : (
              <div className="user-list">
                {filteredUsers.map(user => (
                  <div
                    key={user._id}
                    className={`user-option ${selectedUser?._id === user._id ? 'selected' : ''}`}
                    onClick={() => setSelectedUser(user)}
                  >
                    <img 
                      src={user.avatar || '/default-avatar.png'} 
                      alt={user.name}
                      className="user-avatar-small"
                    />
                    <div className="user-info-small">
                      <span className="user-name">{user.name}</span>
                      <span className="user-email">{user.email}</span>
                    </div>
                    {selectedUser?._id === user._id && (
                      <i className="fas fa-check-circle"></i>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="role">Role *</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="form-control"
            >
              <option value="member">Member</option>
              <option value="co-lead">Co-Lead</option>
              <option value="lead">Lead</option>
            </select>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-primary"
              disabled={!selectedUser}
            >
              Add Member
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMemberModal;