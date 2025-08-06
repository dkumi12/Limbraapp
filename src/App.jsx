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
import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import EvaIcon from './components/EvaIcon'
import MessageCarousel from './components/MessageCarousel'

function App() {
  const [currentScreen, setCurrentScreen] = useState('preferences')
  const [routine, setRoutine] = useState(null)
  const [preferences, setPreferences] = useState(null)
  const [error, setError] = useState(null)
  const [showAPIConfig, setShowAPIConfig] = useState(false)
  const [showCompletionNotification, setShowCompletionNotification] = useState(false)
  const { stats, updateStats } = useRoutineStats()
  const goBack = () => setCurrentScreen('preferences')

  // Check if this is first time or if API keys are needed
  useEffect(() => {
    console.log('Environment Variables:', import.meta.env);
    // Removed automatic display of API config on first launch
  }, [])

  useEffect(() => {
    const handler = (e) => {
      if (e.detail === 'home') {
        setShowAPIConfig(false)
        setCurrentScreen('preferences')
      }
      if (e.detail === 'settings') {
        setShowAPIConfig(true)
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
    setError(null); // Clear any previous errors
    try {
      console.log('Generating routine with preferences:', userPreferences);
      
      // Handle search-generated routines
      if (userPreferences.searchGenerated) {
        setRoutine(userPreferences.routine);
        setPreferences({
          duration: userPreferences.routine.totalDuration,
          goals: ['custom_search'],
          bodyParts: ['custom_search'],
          searchTerm: userPreferences.routine.searchTerm
        });
        setCurrentScreen('routine');
        return;
      }
      
      // Normal routine generation flow
      setPreferences(userPreferences)
      const generatedRoutine = await routineGenerator.generateRoutine(userPreferences)
      setRoutine(generatedRoutine)
      setCurrentScreen('routine')
    } catch (error) {
      console.error('Error generating routine:', error)
      setError(error.message)
      setCurrentScreen('preferences'); // Go back to preferences on error
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
    setShowCompletionNotification(true)
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
              <div style={{ fontWeight: 'bold', fontSize: '2.2rem', letterSpacing: '0.02em', color: 'var(--primary-green)' }}>LIMBRA</div>
              <div style={{ fontSize: '0.75rem', color: '#b0b8c9', marginTop: '0.15rem', fontWeight: 400, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                BY EVERBOOMING HEALTH AND WELLNESS&reg;
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
            isFallback={routine.isFallback} // Pass isFallback prop
          />
        )}

        {showCompletionNotification && (
          <div className="session-complete">
            <button 
              className="back-button" 
              onClick={() => { 
                setShowCompletionNotification(false); 
                setCurrentScreen('preferences'); 
              }} 
              style={{ 
                position: 'absolute', 
                left: '1rem', 
                top: '1rem', 
                background: 'none', 
                border: 'none', 
                fontSize: '1.5rem', 
                cursor: 'pointer', 
                zIndex: 10 
              }}
            >
              ←
            </button>
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
          <button className={`nav-item${currentScreen === 'preferences' ? ' nav-item-active' : ''}`} onClick={() => { setShowAPIConfig(false); setCurrentScreen('preferences'); }}>
            <EvaIcon name="home-outline" width={24} height={24} fill={currentScreen === 'preferences' ? '#22c55e' : '#b0b8c9'} />
            <span style={{ color: currentScreen === 'preferences' ? '#22c55e' : '#b0b8c9' }}>Home</span>
          </button>
          <button className={`nav-item${currentScreen === 'saved' ? ' nav-item-active' : ''}`} onClick={() => { setShowAPIConfig(false); setCurrentScreen('saved'); }}>
            <EvaIcon name="bookmark-outline" width={24} height={24} fill={currentScreen === 'saved' ? '#22c55e' : '#b0b8c9'} />
            <span style={{ color: currentScreen === 'saved' ? '#22c55e' : '#b0b8c9' }}>Library</span>
          </button>
          <button className={`nav-item${currentScreen === 'profile' ? ' nav-item-active' : ''}`} onClick={() => { setShowAPIConfig(false); setCurrentScreen('profile'); }}>
            <EvaIcon name="person-outline" width={24} height={24} fill={currentScreen === 'profile' ? '#22c55e' : '#b0b8c9'} />
            <span style={{ color: currentScreen === 'profile' ? '#22c55e' : '#b0b8c9' }}>Profile</span>
          </button>
          <button className={`nav-item${showAPIConfig ? ' nav-item-active' : ''}`} onClick={() => { setShowAPIConfig(true); }}>
            <EvaIcon name="settings-outline" width={24} height={24} fill={showAPIConfig ? '#22c55e' : '#b0b8c9'} />
            <span style={{ color: showAPIConfig ? '#22c55e' : '#b0b8c9' }}>Settings</span>
          </button>
        </nav>
      </div>
    </div>
  )
}

export default App