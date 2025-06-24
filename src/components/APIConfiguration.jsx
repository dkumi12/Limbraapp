import React, { useState, useEffect } from 'react'

const APIConfiguration = ({ onSave, onSkip }) => {
  const [openRouterKey, setOpenRouterKey] = useState('')
  const [youtubeKey, setYoutubeKey] = useState('')
  const [showInstructions, setShowInstructions] = useState(false)

  useEffect(() => {
    // Check if keys are already saved in localStorage
    const savedOpenRouterKey = localStorage.getItem('openrouter_api_key')
    const savedYoutubeKey = localStorage.getItem('youtube_api_key')
    
    if (savedOpenRouterKey) setOpenRouterKey(savedOpenRouterKey)
    if (savedYoutubeKey) setYoutubeKey(savedYoutubeKey)
  }, [])

  const handleSave = () => {
    if (openRouterKey) {
      localStorage.setItem('openrouter_api_key', openRouterKey)
    }
    if (youtubeKey) {
      localStorage.setItem('youtube_api_key', youtubeKey)
    }
    onSave({ openRouterKey, youtubeKey })
  }

  return (
    <div className="api-configuration">
      <header className="header">
        <h1 className="header-text">API Configuration</h1>
        <p className="subheader-text">
          Add your API keys for AI-powered routines and YouTube videos
        </p>
      </header>

      <div className="api-notice">
        <p>
          <strong>Optional:</strong> API keys enable AI-generated routines and YouTube videos. 
          The app works without them using pre-built routines.
        </p>
      </div>

      <div className="form-group">
        <label className="form-label">
          OpenRouter API Key (for AI routines)
        </label>
        <input
          type="password"
          className="form-input"
          value={openRouterKey}
          onChange={(e) => setOpenRouterKey(e.target.value)}
          placeholder="sk-or-..."
        />
        <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>
          Get your key from{' '}
          <a 
            href="https://openrouter.ai/keys" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ color: 'var(--primary-green)' }}
          >
            openrouter.ai/keys
          </a>
        </p>
      </div>

      <div className="form-group">
        <label className="form-label">
          YouTube API Key (for exercise videos)
        </label>
        <input
          type="password"
          className="form-input"
          value={youtubeKey}
          onChange={(e) => setYoutubeKey(e.target.value)}
          placeholder="AIza..."
        />
        <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>
          Get your key from{' '}
          <a 
            href="https://console.cloud.google.com/apis/credentials" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ color: 'var(--primary-green)' }}
          >
            Google Cloud Console
          </a>
        </p>
      </div>

      <button
        className="btn btn-secondary"
        onClick={() => setShowInstructions(!showInstructions)}
        style={{ marginBottom: '1rem', width: '100%' }}
      >
        {showInstructions ? 'Hide' : 'Show'} Setup Instructions
      </button>

      {showInstructions && (
        <div style={{ 
          background: '#f8f9fa', 
          padding: '1rem', 
          borderRadius: '8px',
          marginBottom: '1rem',
          fontSize: '0.875rem'
        }}>
          <h3 style={{ marginBottom: '0.5rem' }}>OpenRouter Setup:</h3>
          <ol>
            <li>Go to openrouter.ai and sign up</li>
            <li>Add credits to your account ($5 is plenty)</li>
            <li>Generate an API key</li>
            <li>Paste it above</li>
          </ol>
          
          <h3 style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>YouTube API Setup:</h3>
          <ol>
            <li>Go to Google Cloud Console</li>
            <li>Create a new project</li>
            <li>Enable YouTube Data API v3</li>
            <li>Create credentials (API Key)</li>
            <li>Restrict the key to YouTube Data API</li>
            <li>Paste it above</li>
          </ol>
        </div>
      )}

      <div style={{ display: 'flex', gap: '1rem' }}>
        <button 
          className="btn"
          onClick={handleSave}
          style={{ flex: 1 }}
        >
          Save & Continue
        </button>
        <button 
          className="btn btn-secondary"
          onClick={onSkip}
          style={{ flex: 1 }}
        >
          Skip for Now
        </button>
      </div>
    </div>
  )
}

export default APIConfiguration