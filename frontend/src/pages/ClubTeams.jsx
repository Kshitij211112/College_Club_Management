import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import TeamsManagement from '../components/TeamsManagement';
import './ClubTeams.css';

const ClubTeams = () => {
  const { id: clubId } = useParams();
  const navigate = useNavigate();
  const [club, setClub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPresident, setIsPresident] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const initializeData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        // 1. Fetch current user profile
        const userRes = await axios.get('http://localhost:8000/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const user = userRes.data;
        setCurrentUserId(user._id);

        // 2. Fetch club details
        const clubRes = await axios.get(`http://localhost:8000/api/clubs/${clubId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const clubData = clubRes.data;
        setClub(clubData);

        // 3. Determine if user is President (Safety check for ID or Object)
        const presidentId = clubData.president?._id || clubData.president;
        setIsPresident(presidentId === user._id || user.role === 'admin');

      } catch (error) {
        console.error('Initialization error:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, [clubId, navigate]);

  if (loading) return <div className="loading-container">Loading...</div>;
  if (!club) return <div className="error-container">Club not found</div>;

  return (
    <div className="club-teams-page">
      <div className="page-header">
        <button className="back-button" onClick={() => navigate(`/clubs/${clubId}`)}>
          ← Back
        </button>
        <div className="club-info-header">
          <img src={club.logo || 'https://placehold.co/50'} alt="logo" className="club-logo-small" />
          <h1>{club.name} - Teams</h1>
        </div>
        {!isPresident && (
          <div className="info-banner">View Only Mode: Only Presidents can edit teams.</div>
        )}
      </div>

      <TeamsManagement 
        clubId={clubId} 
        isPresident={isPresident} 
        currentUserId={currentUserId} 
      />
    </div>
  );
};

export default ClubTeams;