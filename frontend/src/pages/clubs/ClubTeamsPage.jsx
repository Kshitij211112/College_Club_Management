import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as clubService from '../../services/clubService';
import * as authService from '../../services/authService';
import useAuth from '../../hooks/useAuth';
import TeamsManagement from '../../components/TeamsManagement';
import { Spinner } from '../../components/ui';

const ClubTeamsPage = () => {
    const { id: clubId } = useParams();
    const navigate = useNavigate();
    const { userId } = useAuth();
    const [club, setClub] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isPresident, setIsPresident] = useState(false);

    useEffect(() => {
        const initializeData = async () => {
            try {
                setLoading(true);

                // Fetch current user
                const userRes = await authService.getCurrentUser();
                const user = userRes.data;

                // Fetch club details
                const clubRes = await clubService.getById(clubId);
                const clubData = clubRes.data;
                setClub(clubData);

                // Determine president
                const presidentId = clubData.president?._id || clubData.president;
                setIsPresident(presidentId === user._id || user.role === 'admin');
            } catch (error) {
                console.error('Initialization error:', error);
            } finally {
                setLoading(false);
            }
        };

        initializeData();
    }, [clubId]);

    if (loading) return <Spinner label="Loading teams..." />;
    if (!club) return <div className="p-10 text-center text-slate-500 font-bold">Club not found</div>;

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
                currentUserId={userId}
            />
        </div>
    );
};

export default ClubTeamsPage;
