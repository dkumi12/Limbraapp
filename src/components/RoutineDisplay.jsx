import React, { useState, useEffect } from 'react'
import { useTimer, useAudio, useWakeLock } from '../hooks'
import { getYouTubeEmbedUrl } from '../routineGenerator'
import EvaIcon from './EvaIcon';

const RoutineDisplay = ({ routine, preferences, onComplete, onBack, isFallback }) => {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [sessionStartTime, setSessionStartTime] = useState(null)
  const [showInstructions, setShowInstructions] = useState(true)
  const [showVideo, setShowVideo] = useState(true)
  const [completedExercises, setCompletedExercises] = useState([])
  const [isRoutineSaved, setIsRoutineSaved] = useState(false)

  const handleSaveRoutine = () => {
    const savedRoutines = JSON.parse(localStorage.getItem('savedRoutines') || '[]');
    const newRoutine = {
      id: Date.now(), // Unique ID
      name: routine.name,
      exercises: routine.exercises,
      totalDuration: routine.totalDuration,
      difficulty: routine.difficulty,
      benefits: routine.benefits,
      tips: routine.tips,
      cooldownAdvice: routine.cooldownAdvice,
      preferences: preferences, // Save preferences for context
      savedAt: new Date().toISOString()
    };
    savedRoutines.push(newRoutine);
    localStorage.setItem('savedRoutines', JSON.stringify(savedRoutines));
    setIsRoutineSaved(true);
    alert('Routine saved successfully!');
  };
  
  const currentExercise = routine.exercises[currentExerciseIndex]
  const isLastExercise = currentExerciseIndex === routine.exercises.length - 1
  
  const { time, isRunning, formatTime, start, pause, reset } = useTimer(currentExercise?.duration || 0)
  const { playBeep, playSuccess, playAlert } = useAudio()
  const { requestWakeLock, releaseWakeLock } = useWakeLock()

  const handleNextExercise = () => {
    if (currentExerciseIndex < routine.exercises.length - 1) {
      setCompletedExercises([...completedExercises, currentExerciseIndex]);
      setCurrentExerciseIndex(currentExerciseIndex + 1);
      pause();
    } else {
      // Routine complete
      playSuccess();
      const sessionEndTime = Date.now();
      const totalTime = Math.round((sessionEndTime - sessionStartTime) / 1000);
      onComplete({
        totalTime,
        completedExercises: routine.exercises.length,
        skippedExercises: 0
      });
    }
  }

  useEffect(() => {
    if (!sessionStartTime && isTimerRunning) {
      setSessionStartTime(Date.now())
      requestWakeLock()
    }
    
    return () => {
      releaseWakeLock()
    }
  }, [isTimerRunning, sessionStartTime, requestWakeLock, releaseWakeLock]);

  useEffect(() => {
    if (time === 0 && isRunning) {
      playAlert();
      handleNextExercise();
    }
    // Play beep every second during the last 10 seconds
    if (isRunning && time > 0 && time <= 10) {
      playBeep();
    }
  }, [time, isRunning, playAlert, handleNextExercise, playBeep]);

  // Reset timer when exercise changes
  useEffect(() => {
    reset();
  }, [currentExerciseIndex, reset]);

  const handleStartTimer = () => {
    if (!isTimerRunning) {
      setIsTimerRunning(true);
    }
    start();
  }

  const handlePauseTimer = () => {
    pause();
  }

  const handlePreviousExercise = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(currentExerciseIndex - 1);
      setCompletedExercises(completedExercises.filter(i => i !== currentExerciseIndex - 1));
      pause();
    }
  }

  const handleSkipExercise = () => {
    handleNextExercise();
  }

  const progressPercentage = ((currentExerciseIndex + 1) / routine.exercises.length) * 100;
  const timePercentage = time > 0 ? ((currentExercise.duration - time) / currentExercise.duration) * 100 : 100;

  return (
    <div className="routine-container">
      {/* Header */}
      <div className="routine-header">
        <h1 className="header-text">{routine.name}</h1>
        {isFallback && (
          <p style={{ color: '#ff9800', textAlign: 'center', marginBottom: '1rem' }}>
            AI generation unavailable. Displaying a general routine.
          </p>
        )}
        <div className="routine-meta">
          <span>
            <EvaIcon name="clock-outline" width={20} height={20} fill="#64748b" style={{ marginRight: '0.25rem' }} />
            {Math.round(routine.totalDuration / 60)} minutes
          </span>
          <span>
            <EvaIcon name="activity-outline" width={20} height={20} fill="#64748b" style={{ marginRight: '0.25rem' }} />
            {routine.exercises.length} exercises
          </span>
        </div>
      </div>

      {/* Current Exercise Display */}
      <div className="current-exercise-display">
        <div className="exercise-counter">
          Exercise {currentExerciseIndex + 1} of {routine.exercises.length}
        </div>
        <h2 className="current-exercise-name">{currentExercise.name}</h2>
        {showInstructions && (
          <>
            <p className="current-exercise-description">{currentExercise.description}</p>
            {currentExercise.tips && (
              <p style={{ fontSize: '0.875rem', opacity: 0.9, marginTop: '0.5rem', fontStyle: 'italic' }}>
                💡 {currentExercise.tips}
              </p>
            )}
          </>
        )}
        
        {/* Equipment Tags */}
        {currentExercise.equipment && currentExercise.equipment.length > 0 && (
          <div className="equipment-tags">
            {currentExercise.equipment.map((eq, index) => (
              <span key={index} className="equipment-tag">
                {eq.replace(/_/g, ' ')}
              </span>
            ))}
          </div>
        )}
        
        {/* Benefits */}
        {currentExercise.benefits && currentExercise.benefits.length > 0 && (
          <div className="exercise-benefits">
            <h4>Benefits:</h4>
            <ul>
              {currentExercise.benefits.slice(0, 3).map((benefit, index) => (
                <li key={index}>{benefit}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Video Section */}
      {showVideo && (
        <div style={{ marginBottom: '1rem' }}>
          {currentExercise.videoId ? (
            <div className="video-container">
              <iframe
                src={getYouTubeEmbedUrl(currentExercise.videoId)}
                title={currentExercise.videoTitle || currentExercise.name}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <div className="video-placeholder">
              {/* No replacement needed for videocam-off-outline, fallback to text or another icon if needed */}
              <p>No video available for this exercise</p>
            </div>
          )}
          <button 
            className="btn btn-secondary" 
            onClick={() => setShowVideo(!showVideo)}
            style={{ width: '100%', marginTop: '0.5rem' }}
          >
            {showVideo ? 'Hide Video' : 'Show Video'}
          </button>
        </div>
      )}

      {/* Timer */}
      <div className="timer-container">
        <div className={`timer-display ${time <= 5 ? 'danger' : time <= 10 ? 'warning' : ''}`}>
          {formatTime(time)}
        </div>
        
        {/* Timer Progress Bar */}
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${timePercentage}%` }}
          />
        </div>

        {/* Timer Controls */}
        <div className="timer-controls">
          {!isRunning ? (
            <button className="btn" onClick={handleStartTimer}>
              <EvaIcon name="play-circle-outline" width={24} height={24} fill="#22d3ee" style={{ marginRight: '0.5rem' }} />
              Start
            </button>
          ) : (
            <button className="btn btn-secondary" onClick={handlePauseTimer}>
              <EvaIcon name="pause-circle-outline" width={24} height={24} fill="#64748b" style={{ marginRight: '0.5rem' }} />
              Pause
            </button>
          )}
          
          <button 
            className="btn btn-secondary" 
            onClick={handleSkipExercise}
          >
            Skip
            <EvaIcon name="skip-forward-outline" width={24} height={24} fill="#64748b" style={{ marginLeft: '0.5rem' }} />
          </button>
        </div>
      </div>

      {/* Exercise List */}
      <div className="exercise-list-small">
        <h4>Exercise Overview</h4>
        {routine.exercises.map((exercise, index) => (
          <div
            key={index}
            className={`exercise-summary ${
              index === currentExerciseIndex ? 'current' : 
              completedExercises.includes(index) ? 'completed' : ''
            }`}
            onClick={() => {
              if (index !== currentExerciseIndex) {
                setCurrentExerciseIndex(index);
                pause();
              }
            }}
          >
            <span className="exercise-summary-name">{exercise.name}</span>
            <span className="exercise-summary-duration">{exercise.duration}s</span>
          </div>
        ))}
      </div>

      {/* Tips Section */}
      {routine.tips && routine.tips.length > 0 && (
        <div style={{ 
          background: 'rgba(34, 197, 94, 0.1)', 
          padding: '1rem', 
          borderRadius: '8px',
          marginTop: '1rem'
        }}>
          <h4 style={{ marginBottom: '0.5rem', color: 'var(--primary-green)' }}>Tips:</h4>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {routine.tips.map((tip, index) => (
              <li key={index} style={{ marginBottom: '0.25rem' }}>• {tip}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Navigation */}
      <div className="navigation-buttons">
        <button 
          className="btn btn-secondary" 
          onClick={handlePreviousExercise}
          disabled={currentExerciseIndex === 0}
        >
          <EvaIcon name="arrow-back-outline" width={20} height={20} fill="#64748b" style={{ marginRight: '0.5rem' }} />
          Previous
        </button>
        
        <button 
          className="btn" 
          onClick={isLastExercise ? handleNextExercise : handleNextExercise}
        >
          {isLastExercise ? (
            <>
              Complete
              <EvaIcon name="checkmark-circle-2-outline" width={20} height={20} fill="#22d3ee" style={{ marginLeft: '0.5rem' }} />
            </>
          ) : (
            <>
              Next
              <EvaIcon name="arrow-forward-outline" width={20} height={20} fill="#22d3ee" style={{ marginLeft: '0.5rem' }} />
            </>
          )}
        </button>
      </div>

      {/* Overall Progress */}
      <div style={{ marginTop: '2rem' }}>
        <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.5rem' }}>
          Overall Progress
        </p>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Save Routine Button */}
      <button 
        className="btn" 
        onClick={handleSaveRoutine}
        disabled={isRoutineSaved}
        style={{ marginTop: '1rem' }}
      >
        {isRoutineSaved ? 'Routine Saved!' : 'Save Routine'}
      </button>

      {/* Back Button */}
      <button 
        className="btn btn-secondary" 
        onClick={onBack}
        style={{ marginTop: '1rem' }}
      >
        <EvaIcon name="arrow-back-outline" width={20} height={20} fill="#64748b" style={{ marginRight: '0.5rem' }} />
        Back to Preferences
      </button>
    </div>
  )
}

export default RoutineDisplay