import React, { useState } from 'react';

const AddTeamModal = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  const teamTypes = [
    'Photography',
    'Videography',
    'Technical',
    'Non-Technical',
    'Volunteers',
    'Design',
    'Content',
    'Marketing',
    'Social Media',
    'Event Management'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name) {
      alert('Please select a team type');
      return;
    }
    onSubmit(formData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Create New Team</h3>
          <button className="btn-close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="teamType">Team Type *</label>
            <select
              id="teamType"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="form-control"
            >
              <option value="">Select a team type</option>
              {teamTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description (Optional)</label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description of the team's responsibilities..."
              maxLength={500}
              rows={4}
              className="form-control"
            />
            <small className="char-count">
              {formData.description.length}/500 characters
            </small>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Create Team
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTeamModal;