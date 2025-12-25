import React, { useState, useEffect } from 'react'
import EvaIcon from './EvaIcon';

const Settings = ({ onClose }) => {
  const [openRouterKey, setOpenRouterKey] = useState('')
  const [youtubeKey, setYoutubeKey] = useState('')
  const [hfToken, setHfToken] = useState('')
  const [selectedModel, setSelectedModel] = useState('')
  const [aiProvider, setAiProvider] = useState('stretchgpt')
  const [availableModels, setAvailableModels] = useState([])
  const [loadingModels, setLoadingModels] = useState(false)
  const [showInstructions, setShowInstructions] = useState(false)
  const [saveStatus, setSaveStatus] = useState('')
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);

  useEffect(() => {
    if (showSaveConfirmation) {
      const timer = setTimeout(() => {
        setShowSaveConfirmation(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showSaveConfirmation]);

  useEffect(() => {
    // Load saved keys and model from localStorage
    const savedOpenRouterKey = localStorage.getItem('openrouter_api_key') || ''
    const savedYoutubeKey = localStorage.getItem('youtube_api_key') || ''
    const savedHfToken = localStorage.getItem('hf_access_token') || ''
    const savedModel = localStorage.getItem('selected_model') || 'anthropic/claude-3-haiku'
    const savedProvider = localStorage.getItem('ai_provider') || 'stretchgpt'
    
    setOpenRouterKey(savedOpenRouterKey)
    setYoutubeKey(savedYoutubeKey)
    setHfToken(savedHfToken)
    setSelectedModel(savedModel)
    setAiProvider(savedProvider)
    
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
          'X-Title': 'Limbra App'
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
        { id: 'anthropic/claude-3-haiku', name: 'Claude 3 Haiku' },
        { id: 'openai/gpt-3.5-turbo', name: 'GPT-3.5 Turbo' },
        { id: 'openai/gpt-4', name: 'GPT-4' },
        { id: 'mistralai/mistral-7b-instruct', name: 'Mistral 7B' }
      ])
    } finally {
      setLoadingModels(false)
    }
  }

  const handleSave = () => {
    // Save HuggingFace token
    if (hfToken) {
      localStorage.setItem('hf_access_token', hfToken)
    } else {
      localStorage.removeItem('hf_access_token')
    }
    
    // Save AI provider preference
    localStorage.setItem('ai_provider', aiProvider)
    
    // Save OpenRouter key
    if (openRouterKey) {
      localStorage.setItem('openrouter_api_key', openRouterKey)
    } else {
      localStorage.removeItem('openrouter_api_key')
    }
    
    // Save YouTube key
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
        aiProvider,
        hasKeys: {
          openRouter: !!openRouterKey,
          youtube: !!youtubeKey,
          huggingFace: !!hfToken
        }
      }
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `limbra-data-${new Date().toISOString().split('T')[0]}.json`
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
          className="settings-back-btn"
          onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'home' }))}
          aria-label="Back"
        >
          <EvaIcon name="arrow-back-outline" width={28} height={28} fill="#22c55e" />
        </button>
        <div>
          <h1 className="header-text">Settings</h1>
          <p className="subheader-text">Configure your app preferences</p>
        </div>
      </header>

      <div className="settings-content" style={{ padding: '1.5rem', maxWidth: '600px', margin: '0 auto' }}>
        
        {/* AI Provider Selection */}
        <div className="settings-card">
          <h2 className="settings-section-title">🤖 AI Provider</h2>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
            <button
              className={`settings-btn ${aiProvider === 'stretchgpt' ? 'settings-btn-primary' : 'settings-btn-secondary'}`}
              onClick={() => setAiProvider('stretchgpt')}
              style={{ flex: 1, padding: '1rem', textAlign: 'center' }}
            >
              <strong>StretchGPT V3</strong>
              <br />
              <small style={{ opacity: 0.8 }}>Your custom model</small>
            </button>
            <button
              className={`settings-btn ${aiProvider === 'openrouter' ? 'settings-btn-primary' : 'settings-btn-secondary'}`}
              onClick={() => setAiProvider('openrouter')}
              style={{ flex: 1, padding: '1rem', textAlign: 'center' }}
            >
              <strong>OpenRouter</strong>
              <br />
              <small style={{ opacity: 0.8 }}>GPT-4, Claude, etc.</small>
            </button>
          </div>
          <p className="settings-hint" style={{ 
            background: aiProvider === 'stretchgpt' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(59, 130, 246, 0.1)',
            padding: '0.75rem',
            borderRadius: '8px',
            marginTop: '0.5rem'
          }}>
            {aiProvider === 'stretchgpt' 
              ? '✅ Using your fine-tuned StretchGPT model (faster, cheaper, specialized for stretching)'
              : '☁️ Using cloud AI via OpenRouter (more variety, requires API key and credits)'
            }
          </p>
        </div>

        {/* HuggingFace Token (shown when StretchGPT selected) */}
        {aiProvider === 'stretchgpt' && (
          <div className="settings-card">
            <h2 className="settings-section-title">🤗 HuggingFace Configuration</h2>
            <div className="form-group">
              <label className="form-label">HuggingFace Access Token</label>
              <input
                type="password"
                className="settings-input"
                value={hfToken}
                onChange={(e) => setHfToken(e.target.value)}
                placeholder="hf_..."
              />
              <p className="settings-hint">
                Get your token from{' '}
                <a 
                  href="https://huggingface.co/settings/tokens" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ color: '#22c55e' }}
                >
                  huggingface.co/settings/tokens
                </a>
              </p>
              <p className="settings-hint" style={{ marginTop: '0.5rem', color: '#f59e0b' }}>
                ⚠️ <strong>Important:</strong> Token needs "Write" access for inference API
              </p>
            </div>
            <div style={{ 
              background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(16, 185, 129, 0.1))', 
              padding: '1rem', 
              borderRadius: '8px',
              marginTop: '1rem',
              border: '1px solid rgba(34, 197, 94, 0.2)'
            }}>
              <strong style={{ color: '#22c55e' }}>🎉 Your Model:</strong>
              <br />
              <code style={{ 
                background: 'rgba(0,0,0,0.2)', 
                padding: '0.25rem 0.5rem', 
                borderRadius: '4px',
                fontSize: '0.875rem'
              }}>
                dkumi12/stretchgptv2
              </code>
              <br />
              <small style={{ opacity: 0.8, marginTop: '0.5rem', display: 'block' }}>
                Fine-tuned Llama-3-8B for personalized stretching routines with 4-phase structure
              </small>
            </div>
          </div>
        )}

        {/* OpenRouter Configuration (shown when OpenRouter selected) */}
        {aiProvider === 'openrouter' && (
          <div className="settings-card">
            <h2 className="settings-section-title">🔑 OpenRouter Configuration</h2>
            <div className="form-group">
              <label className="form-label">OpenRouter API Key</label>
              <input
                type="password"
                className="settings-input"
                value={openRouterKey}
                onChange={(e) => setOpenRouterKey(e.target.value)}
                placeholder="sk-or-..."
              />
              <p className="settings-hint">
                Get your key from{' '}
                <a 
                  href="https://openrouter.ai/keys" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ color: '#22c55e' }}
                >
                  openrouter.ai/keys
                </a>
              </p>
            </div>
            <div className="form-group" style={{ marginTop: '1rem' }}>
              <label className="form-label">AI Model</label>
              <select
                className="settings-input"
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                disabled={!openRouterKey}
              >
                {loadingModels ? (
                  <option>Loading available models...</option>
                ) : (
                  availableModels.length > 0 ? (
                    availableModels.map(model => (
                      <option key={model.id} value={model.id}>
                        {model.name || model.id}
                      </option>
                    ))
                  ) : (
                    <option value="">Enter API key to load models</option>
                  )
                )}
              </select>
            </div>
          </div>
        )}

        {/* YouTube API Section */}
        <div className="settings-card">
          <h2 className="settings-section-title">📺 YouTube Videos</h2>
          <div className="form-group">
            <label className="form-label">YouTube API Key</label>
            <input
              type="password"
              className="settings-input"
              value={youtubeKey}
              onChange={(e) => setYoutubeKey(e.target.value)}
              placeholder="AIza..."
            />
            <p className="settings-hint">
              Get your key from{' '}
              <a 
                href="https://console.cloud.google.com/apis/credentials" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ color: '#22c55e' }}
              >
                Google Cloud Console
              </a>
            </p>
            <p className="settings-hint" style={{ marginTop: '0.5rem' }}>
              Required for exercise demonstration videos
            </p>
          </div>
        </div>

        {/* Setup Instructions */}
        <div className="settings-card">
          <button
            className="settings-btn settings-btn-secondary"
            onClick={() => setShowInstructions(!showInstructions)}
            style={{ width: '100%' }}
          >
            {showInstructions ? '▼ Hide' : '▶ Show'} Setup Instructions
          </button>
          {showInstructions && (
            <div className="settings-instructions" style={{ 
              marginTop: '1rem', 
              padding: '1rem', 
              background: 'rgba(255,255,255,0.05)',
              borderRadius: '8px'
            }}>
              <h3 style={{ color: '#22c55e', marginBottom: '0.5rem' }}>StretchGPT Setup:</h3>
              <ol style={{ paddingLeft: '1.25rem', marginBottom: '1rem' }}>
                <li>Go to huggingface.co and sign up/login</li>
                <li>Go to Settings → Access Tokens</li>
                <li>Create a new token with <strong>Write</strong> access</li>
                <li>Paste it above and select "StretchGPT V3"</li>
              </ol>
              
              <h3 style={{ color: '#22c55e', marginBottom: '0.5rem' }}>OpenRouter Setup (Alternative):</h3>
              <ol style={{ paddingLeft: '1.25rem', marginBottom: '1rem' }}>
                <li>Go to openrouter.ai and sign up</li>
                <li>Add credits to your account ($5 is plenty)</li>
                <li>Generate an API key</li>
                <li>Paste it above and select "OpenRouter"</li>
              </ol>

              <h3 style={{ color: '#22c55e', marginBottom: '0.5rem' }}>YouTube API Setup:</h3>
              <ol style={{ paddingLeft: '1.25rem' }}>
                <li>Go to Google Cloud Console</li>
                <li>Create a new project</li>
                <li>Enable YouTube Data API v3</li>
                <li>Create credentials (API Key)</li>
                <li>Paste it above</li>
              </ol>
            </div>
          )}
        </div>

        {/* Data Management Section */}
        <div className="settings-card">
          <h2 className="settings-section-title">💾 Data Management</h2>
          <div className="settings-data-btns" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button 
              className="settings-btn settings-btn-secondary" 
              onClick={handleExportData}
              style={{ flex: '1 1 calc(50% - 0.25rem)' }}
            >
              Export Data
            </button>
            <label 
              className="settings-btn settings-btn-secondary" 
              style={{ flex: '1 1 calc(50% - 0.25rem)', textAlign: 'center', cursor: 'pointer' }}
            >
              Import Data
              <input type="file" accept=".json" onChange={handleImportData} style={{ display: 'none' }} />
            </label>
            <button 
              className="settings-btn settings-btn-danger" 
              onClick={handleClearData}
              style={{ flex: '1 1 100%', marginTop: '0.5rem' }}
            >
              Clear All Data
            </button>
          </div>
        </div>

        {/* Save Status */}
        {saveStatus && (
          <div className="settings-save-status" style={{
            padding: '1rem',
            background: 'rgba(34, 197, 94, 0.2)',
            borderRadius: '8px',
            textAlign: 'center',
            marginTop: '1rem'
          }}>
            {saveStatus}
          </div>
        )}

        {/* Save Button */}
        <button 
          className="settings-btn settings-btn-primary" 
          onClick={() => {
            handleSave();
            setShowSaveConfirmation(true);
          }}
          style={{ marginTop: '2rem', width: '100%', padding: '1rem', fontSize: '1.1rem' }}
        >
          {showSaveConfirmation ? (
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              <EvaIcon name="checkmark-circle-2-outline" width={22} height={22} fill="white" />
              Saved!
            </span>
          ) : (
            <span>Save Settings</span>
          )}
        </button>

        {/* Version Info */}
        <div style={{ 
          textAlign: 'center', 
          marginTop: '2rem', 
          opacity: 0.5, 
          fontSize: '0.75rem' 
        }}>
          Limbra v2.0 • StretchGPT V3 Integration
        </div>
      </div>
    </div>
  )
}

export default Settings
