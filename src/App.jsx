import React, { useState, useEffect } from 'react'
import PreferencesForm from './components/PreferencesForm'
import RoutineDisplay from './components/RoutineDisplay'
import APIConfiguration from './components/APIConfiguration'
import { routineGenerator } from './routineGenerator'
import { useRoutineStats } from './hooks'
import SavedRoutines from './components/SavedRoutines'
import Settings from './components/Settings'
import Profile from './components/Profile'
import './theme.css'
import Icon from 'react-eva-icons'

function App() {
  const [currentScreen, setCurrentScreen] = useState('preferences')
  const [routine, setRoutine] = useState(null)
  const [preferences, setPreferences] = useState(null)
  const [error, setError] = useState(null)
  const [showAPIConfig, setShowAPIConfig] = useState(false)
  const { stats, updateStats } = useRoutineStats()
  const goBack = () => setCurrentScreen('preferences')

  // Check if this is first time or if API keys are needed
  useEffect(() => {
    const hasSeenAPIConfig = localStorage.getItem('has_seen_api_config')
    if (!hasSeenAPIConfig) {
      setShowAPIConfig(true)
    }
  }, [])

  useEffect(() => {
    const handler = (e) => {
      if (e.detail === 'home') {
        setShowAPIConfig(false)
        setCurrentScreen('preferences')
      }
      if (e.detail === 'settings') {
        setShowAPIConfig(true)
        setCurrentScreen('settings')
      }
      if (e.detail === 'saved') {
        setShowAPIConfig(false)
        setCurrentScreen('saved')
      }
      if (e.detail === 'profile') {
        setShowAPIConfig(false)
        setCurrentScreen('profile')
      }
    }
    window.addEventListener('navigate', handler)
    return () => window.removeEventListener('navigate', handler)
  }, [])

  console.log('App rendering, currentScreen:', currentScreen);

  const handleGenerateRoutine = async (userPreferences) => {
    try {
      console.log('Generating routine with preferences:', userPreferences);
      setPreferences(userPreferences)
      const generatedRoutine = await routineGenerator.generateRoutine(userPreferences)
      setRoutine(generatedRoutine)
      setCurrentScreen('routine')
    } catch (error) {
      console.error('Error generating routine:', error)
      setError(error.message)
    }
  }

  const handleCompleteRoutine = (completionData) => {
    console.log('Routine completed:', completionData);
    const routineData = {
      duration: completionData.totalTime,
      exercises: routine.exercises,
      goals: preferences?.goals || [],
      ...completionData
    }
    updateStats(routineData)
    setCurrentScreen('complete')
  }

  const handleStartNew = () => {
    setCurrentScreen('preferences')
    setRoutine(null)  
    setPreferences(null)
  }

  const handleAPIConfigSave = (keys) => {
    console.log('API keys saved:', keys);
    localStorage.setItem('has_seen_api_config', 'true')
    setShowAPIConfig(false)
  }

  const handleAPIConfigSkip = () => {
    localStorage.setItem('has_seen_api_config', 'true')
    setShowAPIConfig(false)
  }

  if (error) {
    return (
      <div style={{ padding: '20px', color: 'red' }}>
        <h2>Error:</h2>
        <p>{error}</p>
        <button onClick={() => setError(null)}>Try Again</button>
      </div>
    )
  }

  return (
    <div className="app">
      <div className="main-container">
        {showAPIConfig && (
          <Settings
            onClose={goBack}
          />
        )}
        
        {!showAPIConfig && currentScreen === 'preferences' && (
          <>
            <header className="header" style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{ fontWeight: 'bold', fontSize: '2.2rem', letterSpacing: '0.02em' }}>Limbra</div>
              <div style={{ fontSize: '0.75rem', color: '#b0b8c9', marginTop: '0.15rem', fontWeight: 400, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                BY EVERBOOMING HEALTH AND WELLNESS
              </div>
            </header>
            
            <PreferencesForm 
              onGenerate={handleGenerateRoutine}
              stats={stats}
            />
          </>
        )}

        {!showAPIConfig && currentScreen === 'saved' && (
          <SavedRoutines
            onSelectRoutine={(routine) => {
              setRoutine(routine)
              setCurrentScreen('routine')
            }}
            onClose={goBack}
          />
        )}

        {!showAPIConfig && currentScreen === 'profile' && (
          <Profile
            onClose={goBack}
          />
        )}

        {currentScreen === 'routine' && routine && (
          <RoutineDisplay
            routine={routine}
            preferences={preferences}
            onComplete={handleCompleteRoutine}
            onBack={goBack}
          />
        )}

        {currentScreen === 'complete' && (
          <div className="session-complete">
            <button className="back-button" onClick={goBack} style={{ position: 'absolute', left: '1rem', top: '1rem', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>←</button>
            <div className="celebration">🎉</div>
            <h2>Great Job!</h2>
            <p className="subheader-text">You've completed your stretching routine</p>
            
            <div className="stats-grid">
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

            <button 
              className="btn"
              onClick={handleStartNew}
            >
              Start New Routine
            </button>
          </div>
        )}

        {/* Navigation Bar - always visible */}
        <nav className="nav-bar">
          <button className="nav-item" onClick={() => setCurrentScreen('preferences')}>
            <Icon name="home-outline" fill="#22d3ee" width={24} height={24} />
            Home
          </button>
          <button className="nav-item" onClick={() => setCurrentScreen('saved')}>
            <Icon name="bookmark-outline" fill="#22d3ee" width={24} height={24} />
            Saved
          </button>
          <button className="nav-item" onClick={() => setCurrentScreen('profile')}>
            <Icon name="person-outline" fill="#22d3ee" width={24} height={24} />
            Profile
          </button>
          <button className="nav-item" onClick={() => setShowAPIConfig(true)}>
            <Icon name="settings-outline" fill="#22d3ee" width={24} height={24} />
            Settings
          </button>
        </nav>
      </div>
    </div>
  )
}

export default App