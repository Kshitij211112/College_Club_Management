import React, { useState } from 'react';

const TeamCard = ({ 
  team, 
  isPresident, 
  onAddMember, 
  onRemoveMember, 
  onUpdateRole,
  onDeleteTeam 
}) => {
  const [expanded, setExpanded] = useState(false);

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'lead':
        return 'badge-lead';
      case 'co-lead':
        return 'badge-co-lead';
      default:
        return 'badge-member';
    }
  };

  return (
    <div className="team-card">
      <div className="team-card-header">
        <div className="team-info">
          <h3>{team.name}</h3>
          <span className="member-count">
            {team.members.length} {team.members.length === 1 ? 'member' : 'members'}
          </span>
        </div>
        {isPresident && (
          <div className="team-actions">
            <button 
              className="btn-icon"
              onClick={onAddMember}
              title="Add Member"
            >
              <i className="fas fa-user-plus"></i>
            </button>
            <button 
              className="btn-icon btn-danger"
              onClick={() => onDeleteTeam(team._id)}
              title="Delete Team"
            >
              <i className="fas fa-trash"></i>
            </button>
          </div>
        )}
      </div>

      {team.description && (
        <p className="team-description">{team.description}</p>
      )}

      <div className="team-members-section">
        <div 
          className="members-header"
          onClick={() => setExpanded(!expanded)}
        >
          <span>Members</span>
          <i className={`fas fa-chevron-${expanded ? 'up' : 'down'}`}></i>
        </div>

        {expanded && (
          <div className="members-list">
            {team.members.length === 0 ? (
              <p className="no-members">No members yet</p>
            ) : (
              team.members.map(member => (
                <div key={member._id} className="member-item">
                  <div className="member-info">
                    <img 
                      src={member.user.avatar || '/default-avatar.png'} 
                      alt={member.user.name}
                      className="member-avatar"
                    />
                    <div className="member-details">
                      <span className="member-name">{member.user.name}</span>
                      <span className="member-email">{member.user.email}</span>
                    </div>
                  </div>

                  <div className="member-actions">
                    {isPresident ? (
                      <>
                        <select
                          value={member.role}
                          onChange={(e) => onUpdateRole(team._id, member.user._id, e.target.value)}
                          className="role-select"
                        >
                          <option value="member">Member</option>
                          <option value="co-lead">Co-Lead</option>
                          <option value="lead">Lead</option>
                        </select>
                        <button
                          className="btn-remove"
                          onClick={() => onRemoveMember(team._id, member.user._id)}
                          title="Remove member"
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </>
                    ) : (
                      <span className={`role-badge ${getRoleBadgeClass(member.role)}`}>
                        {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamCard;