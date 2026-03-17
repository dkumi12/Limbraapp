import React, { useState, useEffect } from 'react';
import EvaIcon from './EvaIcon';
import { useAuth, useRoutineStats } from '../hooks';
import ShareStreak from './ShareStreak';
import { getTopStreaks, updateProfileVisibility, updateProfileName } from '../services/supabase';

const Profile = ({ onClose }) => {
  const { user, profile, signOut, refreshProfile } = useAuth();
  const { stats: localStats } = useRoutineStats(user?.id);
  const [displayName, setDisplayName] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  const [saveStatus, setSaveStatus] = useState('');
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [isPublic, setIsPublic] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    async function loadLeaderboard() {
      const topStreaks = await getTopStreaks();
      if (topStreaks && topStreaks.length > 0) {
        // Map top streaks and ensure current user is marked
        const formatted = topStreaks.map((item, index) => ({
          name: item.display_name || 'Anonymous',
          streak: item.streak_days || 0,
          rank: index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`,
          isUser: item.display_name === profile?.display_name
        }));
        setLeaderboard(formatted);
      } else {
        // Fallback mock data if DB is empty or not migrated
        setLeaderboard([
          { name: 'Ama K.', streak: 14, rank: '🥇' },
          { name: 'Kwame B.', streak: 11, rank: '🥈' },
          { name: 'You', streak: localStats.streakDays, rank: '🥉', isUser: true },
          { name: 'Efua D.', streak: 4, rank: '4.' },
          { name: 'Abena M.', streak: 3, rank: '5.' },
        ]);
      }
    }
    loadLeaderboard();
    if (profile) {
      setDisplayName(profile.display_name || '');
      setIsPublic(profile.is_public || false);
    }
    const savedPic = localStorage.getItem('profile_picture') || null;
    setProfilePic(savedPic);
  }, [profile, localStats.streakDays]);

  const handleNameChange = (e) => setDisplayName(e.target.value);

  const handlePicChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setProfilePic(ev.target.result);
      localStorage.setItem('profile_picture', ev.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!user) return;
    try {
      await updateProfileName(user.id, displayName);
      localStorage.setItem('profile_display_name', displayName);
      setSaveStatus('Profile saved!');
      setTimeout(() => setSaveStatus(''), 2000);
      refreshProfile();
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  const handleSignOut = async () => {
    if (window.confirm('Are you sure you want to sign out?')) {
      await signOut();
      window.dispatchEvent(new CustomEvent('navigate', { detail: 'home' }));
    }
  };

  return (
    <div className="profile-page">
      {showShareModal && (
        <ShareStreak streak={localStats.streakDays} onClose={() => setShowShareModal(false)} />
      )}
      
      <header className="header" style={{ display: 'flex', alignItems: 'center', gap: '1rem', position: 'relative', border: 'none', padding: '1rem' }}>
        <button 
          className="settings-back-btn"
          onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'home' }))}
          aria-label="Back"
        >
          <EvaIcon name="arrow-back-outline" width={28} height={28} fill="#22c55e" />
        </button>
        <div style={{ textAlign: 'left' }}>
          <h1 className="header-text" style={{ fontSize: '1.2rem', marginBottom: 0, textAlign: 'left' }}>{displayName || 'User'}</h1>
          <p className="subheader-text" style={{ fontSize: '0.85rem', marginTop: '0.2rem', textAlign: 'left' }}>{user?.email}</p>
        </div>
      </header>
      
      <div className="profile-content" style={{ padding: '1.5rem', maxWidth: '500px', margin: '0 auto', paddingBottom: '100px' }}>
        {/* Avatar Section */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem' }}>
          <div style={{ marginBottom: '1rem', position: 'relative' }}>
            <label htmlFor="profile-pic-upload" style={{ cursor: 'pointer' }}>
              <div style={{ width: 88, height: 88, borderRadius: '50%', background: '#f1f5f9', display: 'flex', justifyContent: 'center', alignItems: 'center', border: '2px solid var(--primary-green)', overflow: 'hidden' }}>
                {profilePic ? (
                  <img src={profilePic} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span style={{ fontSize: '32px' }}>🧑</span>
                )}
              </div>
            </label>
            <input id="profile-pic-upload" type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePicChange} />
          </div>

          <input
            type="text"
            className="form-input"
            value={displayName}
            onChange={handleNameChange}
            placeholder="Display Name"
            style={{ fontSize: '1.2rem', fontWeight: 600, color: '#1e293b', textAlign: 'center', marginBottom: '0.5rem', border: 'none', background: 'transparent', borderRadius: 0, width: '100%' }}
            onBlur={handleSave}
          />

          {profile && (
            <div style={{ background: '#dcfce7', color: '#166534', padding: '0.2rem 0.8rem', borderRadius: '1rem', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              {profile.credits} Credits
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div style={{ marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 600, color: '#64748b' }}>Your stats</div>
        <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <div className="stat-card" style={{ padding: '1rem', textAlign: 'center', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px' }}>
            <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#334155' }}>{localStats.totalSessions}</div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Sessions</div>
          </div>
          <div className="stat-card" style={{ padding: '1rem', textAlign: 'center', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px' }}>
            <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#334155' }}>{Math.round(localStats.totalTimeSpent / 60)}</div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Minutes</div>
          </div>
          <div className="stat-card" style={{ padding: '1rem', textAlign: 'center', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px' }}>
            <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#334155' }}>{localStats.streakDays}</div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Streak</div>
          </div>
        </div>

        {/* Streak Share Card */}
        <div style={{ 
          background: '#f0fdf4', 
          border: '1px solid #bbf7d0', 
          borderRadius: '12px', 
          padding: '1rem', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          marginBottom: '2rem'
        }}>
          <div>
            <div style={{ color: '#166534', fontSize: '0.9rem', fontWeight: 600 }}>{localStats.streakDays}-day stretch streak</div>
            <div style={{ color: '#15803d', fontSize: '0.75rem' }}>Keep it going — share your progress</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.2rem' }}>🔥</span>
            <button 
              onClick={() => setShowShareModal(true)}
              style={{ background: 'var(--primary-green)', color: 'white', border: 'none', padding: '0.4rem 1rem', borderRadius: '14px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
            >
              Share
            </button>
          </div>
        </div>

        {/* Leaderboard */}
        <div style={{ marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 600, color: '#64748b' }}>Top streaks this week</div>
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden', marginBottom: '2rem' }}>
          {leaderboard.map((item, index) => (
            <div key={index} style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              padding: '0.75rem 1rem',
              background: item.isUser ? '#f0fdf4' : 'transparent',
              borderBottom: index === leaderboard.length - 1 ? 'none' : '1px solid #e2e8f0'
            }}>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', color: item.isUser ? '#166534' : '#334155', fontSize: '0.9rem', fontWeight: item.isUser ? 600 : 500 }}>
                <span>{item.rank}</span>
                <span>{item.name}</span>
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: 500, color: item.isUser ? '#166534' : '#64748b' }}>{item.streak} days</div>
            </div>
          ))}
        </div>

        {/* Community Toggle */}
        <div style={{ marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 600, color: '#64748b' }}>Community</div>
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <div>
            <div style={{ fontSize: '0.9rem', fontWeight: 500, color: '#334155' }}>Share my routines publicly</div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Let others discover your saved stretches</div>
          </div>
          <div 
            onClick={async () => {
              const newStatus = !isPublic;
              setIsPublic(newStatus);
              await updateProfileVisibility(user.id, newStatus);
            }}
            style={{ 
              width: 44, height: 24, borderRadius: 12, 
              background: isPublic ? 'var(--primary-green)' : '#cbd5e1', 
              position: 'relative', cursor: 'pointer', transition: '0.3s' 
            }}
          >
            <div style={{ 
              width: 18, height: 18, borderRadius: '50%', background: 'white', 
              position: 'absolute', top: 3, left: isPublic ? 23 : 3, transition: '0.3s',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }} />
          </div>
        </div>

        {/* Sign Out */}
        <button 
          onClick={handleSignOut}
          style={{ 
            width: '100%', padding: '0.85rem', borderRadius: '12px', border: '1px solid #fecaca', 
            background: '#fef2f2', color: '#dc2626', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer',
            display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem'
          }}
        >
          <EvaIcon name="log-out-outline" width={18} height={18} fill="#dc2626" />
          Sign Out
        </button>
      </div>

      <nav className="nav-bar">
        <button className="nav-item" onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'home' }))}>
          <EvaIcon name="home-outline" width={24} height={24} fill="#b0b8c9" />
          <span style={{ color: '#b0b8c9' }}>Home</span>
        </button>
        <button className="nav-item" onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'saved' }))}>
          <EvaIcon name="bookmark-outline" width={24} height={24} fill="#b0b8c9" />
          <span style={{ color: '#b0b8c9' }}>Library</span>
        </button>
        <button className="nav-item nav-item-active">
          <EvaIcon name="person-outline" width={24} height={24} fill="#22c55e" />
          <span style={{ color: '#22c55e' }}>Profile</span>
        </button>
        <button className="nav-item" onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'settings' }))}>
          <EvaIcon name="settings-outline" width={24} height={24} fill="#b0b8c9" />
          <span style={{ color: '#b0b8c9' }}>Settings</span>
        </button>
      </nav>
    </div>
  );
};

export default Profile;