import React, { useState, useEffect } from 'react';
import EvaIcon from './EvaIcon';

const Profile = ({ onClose }) => {
  const [displayName, setDisplayName] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  const [stats, setStats] = useState({ totalSessions: 0, totalTimeSpent: 0, streakDays: 0 });
  const [saveStatus, setSaveStatus] = useState('');

  useEffect(() => {
    const savedName = localStorage.getItem('profile_display_name') || '';
    const savedPic = localStorage.getItem('profile_picture') || null;
    const savedStats = JSON.parse(localStorage.getItem('routine_stats') || '{}');
    setDisplayName(savedName);
    setProfilePic(savedPic);
    setStats({
      totalSessions: savedStats.totalSessions || 0,
      totalTimeSpent: savedStats.totalTimeSpent || 0,
      streakDays: savedStats.streakDays || 0,
    });
  }, []);

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

  const handleSave = () => {
    localStorage.setItem('profile_display_name', displayName);
    setSaveStatus('Profile saved!');
    setTimeout(() => setSaveStatus(''), 2000);
  };

  return (
    <div className="profile-page">
      <header className="header">
        <button 
          className="back-button"
          onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'home' }))}
          style={{ position: 'absolute', left: '1rem', top: '1rem', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}
        >
          ←
        </button>
        <h1 className="header-text">Profile</h1>
        <p className="subheader-text">Your stats and personal info</p>
      </header>
      <nav className="nav-bar">
        <button className={`nav-item`} onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'home' }))}>
          <EvaIcon name="home-outline" width={24} height={24} fill="#b0b8c9" />
          <span style={{ color: '#b0b8c9' }}>Home</span>
        </button>
        <button className={`nav-item`} onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'saved' }))}>
          <EvaIcon name="bookmark-outline" width={24} height={24} fill="#b0b8c9" />
          <span style={{ color: '#b0b8c9' }}>Saved</span>
        </button>
        <button className={`nav-item nav-item-active`} disabled>
          <EvaIcon name="person-outline" width={24} height={24} fill="#22c55e" />
          <span style={{ color: '#22c55e' }}>Profile</span>
        </button>
        <button className={`nav-item`} onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'settings' }))}>
          <EvaIcon name="settings-outline" width={24} height={24} fill="#b0b8c9" />
          <span style={{ color: '#b0b8c9' }}>Settings</span>
        </button>
      </nav>
      <div className="profile-content" style={{ padding: '1.5rem', maxWidth: '500px', margin: '0 auto' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem' }}>
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="profile-pic-upload" style={{ cursor: 'pointer' }}>
              <img
                src={profilePic || '/public/stretch-icon.svg'}
                alt="Profile"
                style={{ width: 96, height: 96, borderRadius: '50%', objectFit: 'cover', border: '2px solid #ddd' }}
              />
            </label>
            <input
              id="profile-pic-upload"
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handlePicChange}
            />
          </div>
          <input
            type="text"
            className="form-input"
            value={displayName}
            onChange={handleNameChange}
            placeholder="Display Name"
            style={{ fontSize: '1.2rem', textAlign: 'center', marginBottom: '0.5rem' }}
          />
          <button className="btn" onClick={handleSave} style={{ marginBottom: '1rem' }}>Save Profile</button>
          {saveStatus && <div style={{ color: 'green', marginBottom: '1rem' }}>{saveStatus}</div>}
        </div>
        <div className="stats-grid" style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', marginBottom: '2rem' }}>
          <div className="stat-card">
            <div className="stat-value">{stats.totalSessions}</div>
            <div className="stat-label">Total Sessions</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{Math.round(stats.totalTimeSpent / 60)}</div>
            <div className="stat-label">Minutes Stretched</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.streakDays}</div>
            <div className="stat-label">Day Streak</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 