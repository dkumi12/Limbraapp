import React, { useState, useEffect } from 'react';
import EvaIcon from './EvaIcon';
import { useAuth } from '../hooks';

const Settings = ({ onClose }) => {
  const { user, profile } = useAuth();
  const [saveStatus, setSaveStatus] = useState('');
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);

  useEffect(() => {
    if (showSaveConfirmation) {
      const timer = setTimeout(() => {
        setShowSaveConfirmation(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showSaveConfirmation]);

  const handleExportData = () => {
    const data = {
      preferences: JSON.parse(
        localStorage.getItem('routine_preferences') || '{}'
      ),
      stats: JSON.parse(localStorage.getItem('routine_stats') || '{}'),
      savedRoutines: JSON.parse(localStorage.getItem('saved_routines') || '[]'),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `limbra-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportData = event => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = e => {
      try {
        const data = JSON.parse(e.target.result);

        if (data.preferences) {
          localStorage.setItem(
            'routine_preferences',
            JSON.stringify(data.preferences)
          );
        }
        if (data.stats) {
          localStorage.setItem('routine_stats', JSON.stringify(data.stats));
        }
        if (data.savedRoutines) {
          localStorage.setItem(
            'saved_routines',
            JSON.stringify(data.savedRoutines)
          );
        }

        setSaveStatus('Data imported successfully!');
        setTimeout(() => setSaveStatus(''), 3000);
      } catch (error) {
        setSaveStatus('Error importing data. Please check the file.');
        setTimeout(() => setSaveStatus(''), 3000);
      }
    };
    reader.readAsText(file);
  };

  const handleClearData = () => {
    if (
      window.confirm(
        'Are you sure you want to clear all app data? This cannot be undone.'
      )
    ) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="settings-page">
      <header
        className="header"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          position: 'relative',
        }}
      >
        <button
          className="settings-back-btn"
          onClick={() =>
            window.dispatchEvent(
              new CustomEvent('navigate', { detail: 'home' })
            )
          }
          aria-label="Back"
        >
          <EvaIcon
            name="arrow-back-outline"
            width={28}
            height={28}
            fill="#22c55e"
          />
        </button>
        <div>
          <h1 className="header-text">Settings</h1>
          <p className="subheader-text">Configure your app preferences</p>
        </div>
      </header>

      <div
        className="settings-content"
        style={{
          padding: '1.5rem',
          maxWidth: '600px',
          margin: '0 auto',
          paddingBottom: '80px',
        }}
      >
        {/* User Account Info */}
        <div
          className="settings-card"
          style={{
            background: 'linear-gradient(135deg, #ffffff, #f8fafc)',
            border: '1px solid #e2e8f0',
          }}
        >
          <h2 className="settings-section-title">👤 Account</h2>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              marginBottom: '1rem',
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                background: 'var(--primary-green)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '1.2rem',
              }}
            >
              {user?.email?.[0].toUpperCase()}
            </div>
            <div>
              <div style={{ fontWeight: 'bold', color: '#1e293b' }}>
                {user?.email}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                {profile?.credits || 0} Routine Credits Available
              </div>
            </div>
          </div>
        </div>

        {/* Data Management Section */}
        <div className="settings-card">
          <h2 className="settings-section-title">💾 Data Management</h2>
          <div
            className="settings-data-btns"
            style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}
          >
            <button
              className="settings-btn settings-btn-secondary"
              onClick={handleExportData}
              style={{ flex: '1 1 calc(50% - 0.25rem)' }}
            >
              Export Data
            </button>
            <label
              className="settings-btn settings-btn-secondary"
              style={{
                flex: '1 1 calc(50% - 0.25rem)',
                textAlign: 'center',
                cursor: 'pointer',
              }}
            >
              Import Data
              <input
                type="file"
                accept=".json"
                onChange={handleImportData}
                style={{ display: 'none' }}
              />
            </label>
            <button
              className="settings-btn settings-btn-danger"
              onClick={handleClearData}
              style={{ flex: '1 1 100%', marginTop: '0.5rem' }}
            >
              Clear Local Cache
            </button>
          </div>
        </div>

        {/* Save Status */}
        {saveStatus && (
          <div
            className="settings-save-status"
            style={{
              padding: '1rem',
              background: 'rgba(34, 197, 94, 0.2)',
              borderRadius: '8px',
              textAlign: 'center',
              marginTop: '1rem',
            }}
          >
            {saveStatus}
          </div>
        )}

        {/* Version Info */}
        <div
          style={{
            textAlign: 'center',
            marginTop: '3rem',
            opacity: 0.5,
            fontSize: '0.75rem',
          }}
        >
          Limbra v2.1 • Supabase & Credits Beta
        </div>
      </div>

      <nav className="nav-bar">
        <button
          className={`nav-item`}
          onClick={() =>
            window.dispatchEvent(
              new CustomEvent('navigate', { detail: 'home' })
            )
          }
        >
          <EvaIcon name="home-outline" width={24} height={24} fill="#b0b8c9" />
          <span style={{ color: '#b0b8c9' }}>Home</span>
        </button>
        <button
          className={`nav-item`}
          onClick={() =>
            window.dispatchEvent(
              new CustomEvent('navigate', { detail: 'saved' })
            )
          }
        >
          <EvaIcon
            name="bookmark-outline"
            width={24}
            height={24}
            fill="#b0b8c9"
          />
          <span style={{ color: '#b0b8c9' }}>Library</span>
        </button>
        <button
          className={`nav-item`}
          onClick={() =>
            window.dispatchEvent(
              new CustomEvent('navigate', { detail: 'profile' })
            )
          }
        >
          <EvaIcon
            name="person-outline"
            width={24}
            height={24}
            fill="#b0b8c9"
          />
          <span style={{ color: '#b0b8c9' }}>Profile</span>
        </button>
        <button className={`nav-item nav-item-active`}>
          <EvaIcon
            name="settings-outline"
            width={24}
            height={24}
            fill="#22c55e"
          />
          <span style={{ color: '#22c55e' }}>Settings</span>
        </button>
      </nav>
    </div>
  );
};

export default Settings;
