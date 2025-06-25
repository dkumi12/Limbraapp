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
import HomeIcon from '@mui/icons-material/Home'
import BookmarkIcon from '@mui/icons-material/Bookmark'
import PersonIcon from '@mui/icons-material/Person'
import SettingsIcon from '@mui/icons-material/Settings'
import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'

function App() {
  const [currentScreen, setCurrentScreen] = useState('preferences')
  const [routine, setRoutine] = useState(null)
  const [preferences, setPreferences] = useState(null)
  const [error, setError] = useState(null)
  const [showAPIConfig, setShowAPIConfig] = useState(false)
  const { stats, updateStats } = useRoutineStats()
  const goBack = () => setCurrentScreen('preferences')
  const [showWelcome, setShowWelcome] = useState(false)
  const [profileName, setProfileName] = useState('')

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

  useEffect(() => {
    // Show welcome popup only once per session
    const hasSeenWelcome = localStorage.getItem('has_seen_welcome')
    if (!hasSeenWelcome) {
      setShowWelcome(true)
      localStorage.setItem('has_seen_welcome', 'true')
    }
    // Load profile name if available
    const savedName = localStorage.getItem('profile_display_name') || ''
    setProfileName(savedName)
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

  const handleCloseWelcome = () => {
    setShowWelcome(false)
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
      {/* Welcome Modal */}
      <Modal open={showWelcome} onClose={handleCloseWelcome}>
        <Box className="onboarding-modal" sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          borderRadius: 3,
          boxShadow: 24,
          p: 4,
          minWidth: 320,
          maxWidth: 400,
          textAlign: 'center',
          background: 'linear-gradient(135deg, #e0f7fa 0%, #f3e8ff 100%)',
        }}>
          <h2 style={{ fontWeight: 700, marginBottom: '1rem', color: '#23293a' }}>Start your stretch habit with Limbra.</h2>
          <div style={{ color: '#4b5563', fontSize: '1.1rem', marginBottom: '2rem' }}>
            In just 5 minutes a day, improve your flexibility, reduce tension, and move more freely — anytime, anywhere.
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            <Button variant="outlined" onClick={handleCloseWelcome} sx={{ borderRadius: 2 }}>Skip</Button>
            <Button variant="contained" onClick={handleCloseWelcome} sx={{ borderRadius: 2, background: 'linear-gradient(90deg, #22c55e 60%, #3f51b5 100%)' }}>Start</Button>
          </div>
        </Box>
      </Modal>
      <div className="main-container">
        {/* Show profile name in header if available and not showing welcome */}
        {(!showWelcome && profileName) && (
          <div style={{ textAlign: 'center', margin: '1.5rem 0', fontWeight: 600, color: '#22c55e', fontSize: '1.25rem' }}>
            {profileName}
          </div>
        )}
        {(showAPIConfig || currentScreen === 'settings') ? (
          <Settings onClose={goBack} />
        ) : (
          <>
            {!showAPIConfig && currentScreen === 'preferences' && (
              <>
                {/* Limbra Home Header - matches screenshot */}
                <div className="header" style={{ marginBottom: '2.5rem', marginTop: '2.5rem', textAlign: 'center' }}>
                  <div className="header-text" style={{ fontWeight: 800, fontSize: '2.8rem', letterSpacing: '0.01em', color: '#4be2d3', marginBottom: '0.5rem' }}>LIMBRA</div>
                  <div style={{ textTransform: 'uppercase', fontWeight: 400, letterSpacing: '0.08em', fontSize: '1.05rem', color: '#b0b8c9', marginBottom: '0.5rem' }}>
                    BY EVERBOOMING HEALTH AND WELLNESS ®
                  </div>
                </div>
                <PreferencesForm 
                  onGenerate={handleGenerateRoutine}
                  stats={stats}
                />
              </>
            )}
            {currentScreen === 'saved' && (
              <SavedRoutines
                onSelectRoutine={(routine) => {
                  setRoutine(routine)
                  setCurrentScreen('routine')
                }}
                onClose={goBack}
              />
            )}
            {currentScreen === 'profile' && (
              <Profile onClose={goBack} />
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
          </>
        )}
        {/* Navigation Bar - always visible */}
        <nav className="nav-bar">
          <button className={`nav-item${currentScreen === 'preferences' ? ' nav-item-active' : ''}`} onClick={() => setCurrentScreen('preferences')}>
            <HomeIcon style={{ color: currentScreen === 'preferences' ? '#22c55e' : '#b0b8c9' }} />
            <span style={{ color: currentScreen === 'preferences' ? '#22c55e' : '#b0b8c9' }}>Home</span>
          </button>
          <button className={`nav-item${currentScreen === 'saved' ? ' nav-item-active' : ''}`} onClick={() => setCurrentScreen('saved')}>
            <BookmarkIcon style={{ color: currentScreen === 'saved' ? '#22c55e' : '#b0b8c9' }} />
            <span style={{ color: currentScreen === 'saved' ? '#22c55e' : '#b0b8c9' }}>Saved</span>
          </button>
          <button className={`nav-item${currentScreen === 'profile' ? ' nav-item-active' : ''}`} onClick={() => setCurrentScreen('profile')}>
            <PersonIcon style={{ color: currentScreen === 'profile' ? '#22c55e' : '#b0b8c9' }} />
            <span style={{ color: currentScreen === 'profile' ? '#22c55e' : '#b0b8c9' }}>Profile</span>
          </button>
          <button className={`nav-item${showAPIConfig || currentScreen === 'settings' ? ' nav-item-active' : ''}`} onClick={() => { setShowAPIConfig(true); setCurrentScreen('settings'); }}>
            <SettingsIcon style={{ color: (showAPIConfig || currentScreen === 'settings') ? '#22c55e' : '#b0b8c9' }} />
            <span style={{ color: (showAPIConfig || currentScreen === 'settings') ? '#22c55e' : '#b0b8c9' }}>Settings</span>
          </button>
        </nav>
      </div>
    </div>
  )
}

export default App