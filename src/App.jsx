import React, { useState, useEffect } from 'react';
import PreferencesForm from './components/PreferencesForm';
import RoutineDisplay from './components/RoutineDisplay';
import APIConfiguration from './components/APIConfiguration';
import { routineGenerator } from './routineGenerator';
import { useRoutineStats, useAuth } from './hooks';
import { deductUserCredit } from './services/supabase';
import SavedRoutines from './components/SavedRoutines';
import Settings from './components/Settings';
import Profile from './components/Profile';
import Auth from './components/Auth';
import UpgradeModal from './components/UpgradeModal';
import Onboarding from './components/Onboarding';
import ShareStreak from './components/ShareStreak';
import './theme.css';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import EvaIcon from './components/EvaIcon';
import MessageCarousel from './components/MessageCarousel';

function App() {
  const {
    user,
    profile,
    loading: authLoading,
    signOut,
    refreshProfile,
  } = useAuth();
  const [currentScreen, setCurrentScreen] = useState('preferences');
  const [routine, setRoutine] = useState(null);
  const [preferences, setPreferences] = useState(null);
  const [error, setError] = useState(null);

  // Read last routine and screen from local storage on init
  useEffect(() => {
    const savedScreen = localStorage.getItem('current_screen');
    if (savedScreen) setCurrentScreen(savedScreen);

    const savedRoutineJSON = localStorage.getItem('current_routine');
    if (savedRoutineJSON) {
      try {
        setRoutine(JSON.parse(savedRoutineJSON));
      } catch (e) {
        console.error('Failed to parse saved routine', e);
      }
    }

    const savedPrefsJSON = localStorage.getItem('current_preferences');
    if (savedPrefsJSON) {
      try {
        setPreferences(JSON.parse(savedPrefsJSON));
      } catch (e) {
        console.error('Failed to parse saved preferences', e);
      }
    }
  }, []);

  // Update local storage when critical state changes
  useEffect(() => {
    localStorage.setItem('current_screen', currentScreen);
    if (routine) {
      localStorage.setItem('current_routine', JSON.stringify(routine));
    } else {
      localStorage.removeItem('current_routine');
    }
    if (preferences) {
      localStorage.setItem('current_preferences', JSON.stringify(preferences));
    } else {
      localStorage.removeItem('current_preferences');
    }
  }, [currentScreen, routine, preferences]);

  const [showAPIConfig, setShowAPIConfig] = useState(false);
  const [showCompletionNotification, setShowCompletionNotification] =
    useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showShareStreak, setShowShareStreak] = useState(false);
  const [runOnboarding, setRunOnboarding] = useState(false);
  const { stats, updateStats } = useRoutineStats(user?.id);
  const goBack = () => setCurrentScreen('preferences');

  // Check if this is first time or if API keys are needed
  useEffect(() => {
    console.log('Environment Variables:', import.meta.env);

    // Check if onboarding needs to be shown
    if (user && !authLoading) {
      const hasSeenOnboarding = localStorage.getItem('has_seen_onboarding');
      if (!hasSeenOnboarding) {
        // Wait a small moment for UI to settle before starting tour
        setTimeout(() => setRunOnboarding(true), 500);
      }
    }
  }, [user, authLoading]);

  useEffect(() => {
    const handler = e => {
      // Clear any overlays when navigating
      setShowCompletionNotification(false);

      if (e.detail === 'home') {
        setShowAPIConfig(false);
        // If there's an active routine, show it. Otherwise show preferences.
        setCurrentScreen(routine ? 'routine' : 'preferences');
      }
      if (e.detail === 'settings') {
        setShowAPIConfig(true);
      }
      if (e.detail === 'saved') {
        setShowAPIConfig(false);
        setCurrentScreen('saved');
      }
      if (e.detail === 'profile') {
        setShowAPIConfig(false);
        setCurrentScreen('profile');
      }
    };

    const showUpgradeHandler = () => {
      setShowUpgradeModal(true);
    };

    window.addEventListener('navigate', handler);
    window.addEventListener('show-upgrade', showUpgradeHandler);
    return () => {
      window.removeEventListener('navigate', handler);
      window.removeEventListener('show-upgrade', showUpgradeHandler);
    };
  }, []);

  console.log(
    'App rendering, currentScreen:',
    currentScreen,
    'user:',
    user?.email
  );

  if (authLoading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          background: 'var(--bg-light)',
        }}
      >
        <div className="loader">Loading Limbra...</div>
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  const handleGenerateRoutine = async userPreferences => {
    setError(null); // Clear any previous errors

    // Check if user has credits
    if (profile && profile.credits <= 0) {
      setShowUpgradeModal(true);
      return;
    }

    try {
      console.log('🎯 Generating routine with preferences:', userPreferences);

      // Handle search-generated routines
      if (userPreferences.searchGenerated) {
        setRoutine(userPreferences.routine);
        setPreferences({
          duration: userPreferences.routine.totalDuration,
          goals: ['custom_search'],
          bodyParts: ['custom_search'],
          searchTerm: userPreferences.routine.searchTerm,
        });
        setCurrentScreen('routine');
        return;
      }

      // Normal routine generation flow
      setPreferences(userPreferences);
      const generatedRoutine =
        await routineGenerator.generateRoutine(userPreferences);

      console.log('✅ Generated routine:', generatedRoutine);
      console.log(
        '📋 Routine has exercises:',
        generatedRoutine?.exercises?.length || 0
      );

      if (!generatedRoutine) {
        throw new Error('No routine generated');
      }

      if (
        !generatedRoutine.exercises ||
        generatedRoutine.exercises.length === 0
      ) {
        throw new Error('Generated routine has no exercises');
      }

      setRoutine(generatedRoutine);
      setCurrentScreen('routine');

      // Update profile credits after successful generation
      const deductionResult = await deductUserCredit(user.id);
      if (deductionResult.success) {
        console.log(
          '💳 Credit deducted. Remaining:',
          deductionResult.remainingCredits
        );
        refreshProfile();
      } else {
        console.warn('⚠️ Failed to deduct credit:', deductionResult.error);
      }

      console.log('🎉 Screen changed to routine, routine state set');
    } catch (error) {
      console.error('❌ Error generating routine:', error);
      setError(error.message);
      setCurrentScreen('preferences'); // Go back to preferences on error
    }
  };

  const handleCompleteRoutine = completionData => {
    console.log('Routine completed:', completionData);
    const routineData = {
      duration: completionData.totalTime,
      exercises: routine.exercises,
      goals: preferences?.goals || [],
      ...completionData,
    };
    updateStats(routineData);
    setCurrentScreen('complete');
    setShowCompletionNotification(true);

    // Trigger share prompt if streak is a milestone
    if (
      stats.streakDays > 0 &&
      (stats.streakDays % 3 === 0 || stats.streakDays % 5 === 0)
    ) {
      // Timeout so it appears after the main completion screen
      setTimeout(() => setShowShareStreak(true), 1500);
    }
  };

  const handleStartNew = () => {
    setShowCompletionNotification(false);
    setCurrentScreen('preferences');
    setRoutine(null);
    setPreferences(null);
  };

  const handleAPIConfigSave = keys => {
    console.log('API keys saved:', keys);
    localStorage.setItem('has_seen_api_config', 'true');
    setShowAPIConfig(false);
  };

  const handleAPIConfigSkip = () => {
    localStorage.setItem('has_seen_api_config', 'true');
    setShowAPIConfig(false);
  };

  return (
    <div className="app">
      <div className="main-container">
        <Onboarding run={runOnboarding} setRun={setRunOnboarding} />

        {showAPIConfig && <Settings onClose={goBack} />}

        {!showAPIConfig && currentScreen === 'preferences' && (
          <>
            <header
              className="header"
              style={{
                textAlign: 'center',
                marginBottom: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  fontWeight: 'bold',
                  fontSize: '2.2rem',
                  letterSpacing: '0.02em',
                  color: 'var(--primary-green)',
                }}
              >
                LIMBRA
              </div>
              <div
                style={{
                  fontSize: '0.75rem',
                  color: '#b0b8c9',
                  marginTop: '0.15rem',
                  fontWeight: 400,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                }}
              >
                BY EVERBOOMING HEALTH AND WELLNESS&reg;
              </div>
              {profile && (
                <div
                  className="credit-display"
                  style={{
                    fontSize: '0.7rem',
                    color: 'var(--primary-green)',
                    marginTop: '0.5rem',
                    fontWeight: 'bold',
                    background: '#dcfce7',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '1rem',
                  }}
                >
                  Credits: {profile.credits}
                </div>
              )}
            </header>

            <PreferencesForm onGenerate={handleGenerateRoutine} stats={stats} />
          </>
        )}

        {!showAPIConfig && currentScreen === 'saved' && (
          <SavedRoutines
            onSelectRoutine={routine => {
              setRoutine(routine);
              setCurrentScreen('routine');
            }}
            onClose={goBack}
          />
        )}

        {!showAPIConfig && currentScreen === 'profile' && (
          <Profile onClose={goBack} />
        )}

        {!showAPIConfig && currentScreen === 'routine' && routine && (
          <RoutineDisplay
            routine={routine}
            preferences={preferences}
            onComplete={handleCompleteRoutine}
            onBack={goBack}
            isFallback={routine.isFallback} // Pass isFallback prop
          />
        )}

        {!showAPIConfig && showCompletionNotification && (
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
                zIndex: 10,
              }}
            >
              ←
            </button>
            <div className="celebration">🎉</div>
            <h2>Great Job!</h2>
            <p className="subheader-text">
              You've completed your stretching routine
            </p>

            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-value">{stats.totalSessions}</div>
                <div className="stat-label">Total Sessions</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">
                  {Math.round(stats.totalTimeSpent / 60)}
                </div>
                <div className="stat-label">Minutes Stretched</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{stats.streakDays}</div>
                <div className="stat-label">Day Streak</div>
              </div>
            </div>

            <button className="btn" onClick={handleStartNew}>
              Start New Routine
            </button>
          </div>
        )}

        {/* Error Modal */}
        {error && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.5)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1000,
              padding: '1rem',
            }}
          >
            <div
              style={{
                background: 'white',
                padding: '2rem',
                borderRadius: '1rem',
                maxWidth: '400px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
              <h3 style={{ marginBottom: '0.5rem' }}>Hold On!</h3>
              <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
                {error}
              </p>
              <button
                className="btn"
                onClick={() => setError(null)}
                style={{ width: '100%' }}
              >
                OK
              </button>
            </div>
          </div>
        )}

        {/* Upgrade Modal */}
        {showUpgradeModal && (
          <UpgradeModal onClose={() => setShowUpgradeModal(false)} />
        )}

        {/* Share Streak Modal */}
        {showShareStreak && (
          <ShareStreak
            streak={stats.streakDays}
            onClose={() => setShowShareStreak(false)}
          />
        )}

        {/* Navigation Bar - always visible */}
        <nav className="nav-bar">
          <button
            className={`nav-item${currentScreen === 'preferences' || currentScreen === 'routine' ? ' nav-item-active' : ''}`}
            onClick={() => {
              setShowAPIConfig(false);
              setCurrentScreen(routine ? 'routine' : 'preferences');
              setShowCompletionNotification(false);
            }}
          >
            <EvaIcon
              name="home-outline"
              width={24}
              height={24}
              fill={
                currentScreen === 'preferences' || currentScreen === 'routine'
                  ? '#22c55e'
                  : '#b0b8c9'
              }
            />
            <span
              style={{
                color:
                  currentScreen === 'preferences' || currentScreen === 'routine'
                    ? '#22c55e'
                    : '#b0b8c9',
              }}
            >
              Home
            </span>
          </button>
          <button
            className={`nav-item${currentScreen === 'saved' ? ' nav-item-active' : ''}`}
            onClick={() => {
              setShowAPIConfig(false);
              setCurrentScreen('saved');
              setShowCompletionNotification(false);
            }}
          >
            <EvaIcon
              name="bookmark-outline"
              width={24}
              height={24}
              fill={currentScreen === 'saved' ? '#22c55e' : '#b0b8c9'}
            />
            <span
              style={{
                color: currentScreen === 'saved' ? '#22c55e' : '#b0b8c9',
              }}
            >
              Library
            </span>
          </button>
          <button
            className={`nav-item${currentScreen === 'profile' ? ' nav-item-active' : ''}`}
            onClick={() => {
              setShowAPIConfig(false);
              setCurrentScreen('profile');
              setShowCompletionNotification(false);
            }}
          >
            <EvaIcon
              name="person-outline"
              width={24}
              height={24}
              fill={currentScreen === 'profile' ? '#22c55e' : '#b0b8c9'}
            />
            <span
              style={{
                color: currentScreen === 'profile' ? '#22c55e' : '#b0b8c9',
              }}
            >
              Profile
            </span>
          </button>
          <button
            className={`nav-item${showAPIConfig ? ' nav-item-active' : ''}`}
            onClick={() => {
              setShowAPIConfig(true);
              setShowCompletionNotification(false);
            }}
          >
            <EvaIcon
              name="settings-outline"
              width={24}
              height={24}
              fill={showAPIConfig ? '#22c55e' : '#b0b8c9'}
            />
            <span style={{ color: showAPIConfig ? '#22c55e' : '#b0b8c9' }}>
              Settings
            </span>
          </button>
        </nav>
      </div>
    </div>
  );
}

export default App;
