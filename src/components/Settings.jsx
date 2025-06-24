import React, { useState, useEffect } from 'react'
import Icon from 'react-eva-icons';

const Settings = ({ onClose }) => {
  const [openRouterKey, setOpenRouterKey] = useState('')
  const [youtubeKey, setYoutubeKey] = useState('')
  const [selectedModel, setSelectedModel] = useState('')
  const [availableModels, setAvailableModels] = useState([])
  const [loadingModels, setLoadingModels] = useState(false)
  const [showInstructions, setShowInstructions] = useState(false)
  const [saveStatus, setSaveStatus] = useState('')
  const [exportData, setExportData] = useState(false)

  useEffect(() => {
    // Load saved keys and model from localStorage
    const savedOpenRouterKey = localStorage.getItem('openrouter_api_key') || ''
    const savedYoutubeKey = localStorage.getItem('youtube_api_key') || ''
    const savedModel = localStorage.getItem('selected_model') || 'openai/gpt-3.5-turbo'
    
    setOpenRouterKey(savedOpenRouterKey)
    setYoutubeKey(savedYoutubeKey)
    setSelectedModel(savedModel)
    
    // Load models if we have an API key
    if (savedOpenRouterKey) {
      loadOpenRouterModels(savedOpenRouterKey)
    }
  }, [])
  const loadOpenRouterModels = async (apiKey) => {
    setLoadingModels(true)
    try {
      const response = await fetch('https://openrouter.ai/api/v1/models', {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Stretch Easy App'
        }
      })
      
      if (!response.ok) {
        throw new Error('Failed to fetch models')
      }
      
      const data = await response.json()
      const models = data.data || []
      
      // Filter and sort models for stretching/fitness use cases
      const filteredModels = models
        .filter(model => model.id && !model.id.includes('vision'))
        .sort((a, b) => {
          // Prioritize popular models
          const priorityModels = ['gpt-4', 'gpt-3.5', 'claude', 'mistral']
          const aPriority = priorityModels.some(p => a.id.toLowerCase().includes(p))
          const bPriority = priorityModels.some(p => b.id.toLowerCase().includes(p))
          
          if (aPriority && !bPriority) return -1
          if (!aPriority && bPriority) return 1
          
          return a.id.localeCompare(b.id)
        })
      
      setAvailableModels(filteredModels)
    } catch (error) {
      console.error('Error loading models:', error)
      // Fallback to default models
      setAvailableModels([
        { id: 'openai/gpt-3.5-turbo', name: 'GPT-3.5 Turbo' },
        { id: 'openai/gpt-4', name: 'GPT-4' },
        { id: 'anthropic/claude-2', name: 'Claude 2' },
        { id: 'google/palm-2-chat-bison', name: 'PaLM 2' }
      ])
    } finally {
      setLoadingModels(false)
    }
  }
  const handleSave = () => {
    // Save to localStorage (in browser, we can't write actual .env files)
    if (openRouterKey) {
      localStorage.setItem('openrouter_api_key', openRouterKey)
    } else {
      localStorage.removeItem('openrouter_api_key')
    }
    
    if (youtubeKey) {
      localStorage.setItem('youtube_api_key', youtubeKey)
    } else {
      localStorage.removeItem('youtube_api_key')
    }
    
    if (selectedModel) {
      localStorage.setItem('selected_model', selectedModel)
    }
    
    setSaveStatus('Settings saved successfully!')
    setTimeout(() => setSaveStatus(''), 3000)
    
    // Reload models if API key changed
    if (openRouterKey) {
      loadOpenRouterModels(openRouterKey)
    }
  }

  const handleExportData = () => {
    const data = {
      preferences: JSON.parse(localStorage.getItem('routine_preferences') || '{}'),
      stats: JSON.parse(localStorage.getItem('routine_stats') || '{}'),
      savedRoutines: JSON.parse(localStorage.getItem('saved_routines') || '[]'),
      settings: {
        selectedModel,
        hasKeys: {
          openRouter: !!openRouterKey,
          youtube: !!youtubeKey
        }
      }
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `stretch-easy-data-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImportData = (event) => {
    const file = event.target.files[0]
    if (!file) return
    
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result)
        
        if (data.preferences) {
          localStorage.setItem('routine_preferences', JSON.stringify(data.preferences))
        }
        if (data.stats) {
          localStorage.setItem('routine_stats', JSON.stringify(data.stats))
        }
        if (data.savedRoutines) {
          localStorage.setItem('saved_routines', JSON.stringify(data.savedRoutines))
        }
        
        setSaveStatus('Data imported successfully!')
        setTimeout(() => setSaveStatus(''), 3000)
      } catch (error) {
        setSaveStatus('Error importing data. Please check the file.')
        setTimeout(() => setSaveStatus(''), 3000)
      }
    }
    reader.readAsText(file)
  }
  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear all app data? This cannot be undone.')) {
      localStorage.clear()
      window.location.reload()
    }
  }

  return (
    <div className="settings-page">
      <header className="header" style={{ display: 'flex', alignItems: 'center', gap: '1rem', position: 'relative' }}>
        <button 
          className="back-button"
          onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'home' }))}
          style={{ 
            background: 'none',
            border: 'none',
            fontSize: '2.25rem',
            color: '#22d3ee', // bright cyan for visibility
            fontWeight: 'bold',
            cursor: 'pointer',
            marginRight: '0.5rem',
            lineHeight: 1
          }}
          aria-label="Back"
        >
          ←
        </button>
        <div>
          <h1 className="header-text" style={{ display: 'inline', verticalAlign: 'middle' }}>Settings</h1>
          <p className="subheader-text">Configure your app preferences</p>
        </div>
      </header>

      <div className="settings-content" style={{ padding: '1.5rem', maxWidth: '600px', margin: '0 auto' }}>
        {/* API Configuration Section */}
        <section className="settings-section">
          <h2 style={{ marginBottom: '1rem' }}>API Configuration</h2>
          
          <div className="form-group">
            <label className="form-label">
              OpenRouter API Key
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
              YouTube API Key
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

          {/* Model Selection */}
          <div className="form-group">
            <label className="form-label">
              AI Model
            </label>
            {loadingModels ? (
              <p style={{ color: '#64748b' }}>Loading available models...</p>
            ) : (
              <select
                className="form-input"
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                disabled={!openRouterKey}
              >
                {availableModels.length > 0 ? (
                  availableModels.map(model => (
                    <option key={model.id} value={model.id}>
                      {model.name || model.id} {model.pricing && `($${model.pricing.prompt}/1k tokens)`}
                    </option>
                  ))
                ) : (
                  <option value="">Enter API key to load models</option>
                )}
              </select>
            )}
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
        </section>

        {/* Data Management Section */}
        <section className="settings-section" style={{ marginTop: '2rem' }}>
          <h2 style={{ marginBottom: '1rem' }}>Data Management</h2>
          
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button 
              className="btn btn-secondary"
              onClick={handleExportData}
              style={{ flex: 1, minWidth: '150px' }}
            >
              Export Data
            </button>
            
            <label 
              className="btn btn-secondary"
              style={{ flex: 1, minWidth: '150px', textAlign: 'center', cursor: 'pointer' }}
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
              className="btn"
              onClick={handleClearData}
              style={{ 
                flex: 1, 
                minWidth: '150px',
                background: '#ef4444',
                color: 'white'
              }}
            >
              Clear All Data
            </button>
          </div>
        </section>

        {/* Save Status */}
        {saveStatus && (
          <div style={{ 
            marginTop: '1rem',
            padding: '0.75rem',
            background: saveStatus.includes('Error') ? '#fee' : '#e6f4ea',
            color: saveStatus.includes('Error') ? '#d33' : '#188038',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            {saveStatus}
          </div>
        )}

        {/* Save Button */}
        <button 
          className="btn"
          onClick={handleSave}
          style={{ marginTop: '2rem', width: '100%' }}
        >
          Save Settings
        </button>
      </div>

      {/* Navigation bar always visible at the bottom */}
      <nav className="nav-bar">
        <button className="nav-item" onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'home' }))}>
          <Icon name="home-outline" width={24} height={24} fill="#22d3ee" />
          Home
        </button>
        <button className="nav-item" onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'saved' }))}>
          <Icon name="bookmark-outline" width={24} height={24} fill="#22d3ee" />
          Saved
        </button>
        <button className="nav-item" onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'profile' }))}>
          <Icon name="person-outline" width={24} height={24} fill="#22d3ee" />
          Profile
        </button>
        <button className="nav-item nav-item-active" disabled>
          <Icon name="settings-outline" width={24} height={24} fill="#22d3ee" />
          Settings
        </button>
      </nav>
    </div>
  )
}

export default Settings