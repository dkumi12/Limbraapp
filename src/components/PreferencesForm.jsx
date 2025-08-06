import React, { useState, useEffect } from 'react'
import { GOALS, BODY_PARTS, DIFFICULTY_LEVELS, validateRoutinePreferences } from '../routineGenerator'
import { EQUIPMENT_TYPES, EQUIPMENT_INFO } from '../services/api'
import EvaIcon from './EvaIcon';
import StretchFigureLottie from './StretchFigureLottie';
import MessageCarousel from './MessageCarousel';
import ExerciseSearch from './ExerciseSearch/ExerciseSearch';

const PreferencesForm = ({ onGenerate, stats }) => {
  const [duration, setDuration] = useState(10)
  const [goals, setGoals] = useState([])
  const [bodyParts, setBodyParts] = useState([])
  const [equipment, setEquipment] = useState(['none'])
  const [difficulty, setDifficulty] = useState(DIFFICULTY_LEVELS.BEGINNER)
  const [energyLevel, setEnergyLevel] = useState('medium')
  const [timeOfDay, setTimeOfDay] = useState(() => {
    const hour = new Date().getHours()
    if (hour < 12) return 'morning'
    if (hour < 17) return 'midday'
    return 'evening'
  })
  const [problems, setProblems] = useState([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [showStatsSummary, setShowStatsSummary] = useState(true);
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    if (showSaveConfirmation) {
      const timer = setTimeout(() => {
        setShowSaveConfirmation(false);
      }, 2000); // Hide after 2 seconds
      return () => clearTimeout(timer);
    }
  }, [showSaveConfirmation]);

  // Ensure stats summary can be closed
  const closeStatsSummary = () => {
    setShowStatsSummary(false);
    // Also save this preference to localStorage so it stays closed
    localStorage.setItem('hideStatsSummary', 'true');
  };

  // Check localStorage on mount to see if summary should be hidden
  useEffect(() => {
    const hideStatsSummary = localStorage.getItem('hideStatsSummary') === 'true';
    if (hideStatsSummary) {
      setShowStatsSummary(false);
    }
  }, []);

  const quickStartOptions = [
    {
      id: 'morning',
      icon: '🌅',
      iconColor: '#ff9800',
      title: 'Wake & Stretch',
      subtitle: '5 min energizing',
      preset: () => {
        setGoals([GOALS.MORNING_WAKE_UP])
        setBodyParts([BODY_PARTS.FULL_BODY])
        setEnergyLevel('medium')
        setDuration(5)
        setEquipment(['none'])
      }
    },
    {
      id: 'desk',
      icon: '💻',
      iconColor: '#2196f3',
      title: 'Desk Reset',
      subtitle: '10 min neck & shoulders',
      preset: () => {
        setGoals([GOALS.DESK_BREAK])
        setBodyParts([BODY_PARTS.NECK, BODY_PARTS.SHOULDERS, BODY_PARTS.UPPER_BACK])
        setEnergyLevel('low')
        setDuration(10)
        setEquipment(['wall', 'chair'])
      }
    },
    {
      id: 'workout',
      icon: '🤸',
      iconColor: '#9c27b0',
      title: 'Cool Down Stretch',
      subtitle: '5 min recovery',
      preset: () => {
        setGoals([GOALS.POST_WORKOUT])
        setBodyParts([BODY_PARTS.LEGS, BODY_PARTS.HIPS])
        setEnergyLevel('low')
        setDuration(5)
        setEquipment(['foam_roller', 'mat'])
      }
    },
    {
      id: 'bedtime',
      icon: '🌙',
      iconColor: '#3f51b5',
      title: 'Wind Down Flow',
      subtitle: '5 min relaxing',
      preset: () => {
        setGoals([GOALS.BEDTIME_RELAX])
        setBodyParts([BODY_PARTS.FULL_BODY])
        setEnergyLevel('low')
        setDuration(5)
        setEquipment(['mat'])
      }
    }
  ]

  const quickStartEvaIcons = {
    morning: 'sun-outline',
    desk: 'monitor-outline',
    workout: 'activity-outline',
    bedtime: 'moon-outline',
  };

  const goalOptions = [
    { 
      value: GOALS.MORNING_WAKE_UP, 
      label: 'Morning Wake-up', 
      description: 'Energize and activate your body',
      icon: '🌅'
    },
    { 
      value: GOALS.PRE_WORKOUT, 
      label: 'Pre-workout', 
      description: 'Prepare your muscles for exercise',
      icon: '🏋️'
    },
    { 
      value: GOALS.POST_WORKOUT, 
      label: 'Post-workout', 
      description: 'Recovery and cool down',
      icon: '🧘'
    },
    { 
      value: GOALS.DESK_BREAK, 
      label: 'Desk Break', 
      description: 'Counter sitting posture',
      icon: '💻'
    },
    { 
      value: GOALS.STRESS_RELIEF, 
      label: 'Relaxation', 
      description: 'Calm your mind and body',
      icon: '🌙'
    },
    { 
      value: GOALS.BEDTIME_RELAX, 
      label: 'Bedtime Relax', 
      description: 'Prepare for restful sleep',
      icon: '😴'
    },
    { 
      value: GOALS.PAIN_RELIEF, 
      label: 'Pain Relief', 
      description: 'Target specific discomfort',
      icon: '🩹'
    },
    { 
      value: GOALS.FLEXIBILITY, 
      label: 'Flexibility', 
      description: 'Improve range of motion',
      icon: '🤸'
    }
  ]

  const bodyPartOptions = [
    { value: BODY_PARTS.NECK, label: 'Neck', icon: '🦴' },
    { value: BODY_PARTS.SHOULDERS, label: 'Shoulders', icon: '💪' },
    { value: BODY_PARTS.UPPER_BACK, label: 'Upper Back', icon: '⬆️' },
    { value: BODY_PARTS.LOWER_BACK, label: 'Lower Back', icon: '⬇️' },
    { value: BODY_PARTS.CHEST, label: 'Chest', icon: '❤️' },
    { value: BODY_PARTS.ARMS, label: 'Arms', icon: '💪' },
    { value: BODY_PARTS.HIPS, label: 'Hips', icon: '🦴' },
    { value: BODY_PARTS.LEGS, label: 'Legs', icon: '🦵' },
    { value: BODY_PARTS.CALVES, label: 'Calves', icon: '🦶' },
    { value: BODY_PARTS.FULL_BODY, label: 'Full Body', icon: '🧘' }
  ]

  const handleGoalToggle = (goal) => {
    setGoals(prev => 
      prev.includes(goal) 
        ? prev.filter(g => g !== goal)
        : [...prev, goal]
    )
  }

  const handleBodyPartToggle = (bodyPart) => {
    setBodyParts(prev => 
      prev.includes(bodyPart) 
        ? prev.filter(bp => bp !== bodyPart)
        : [...prev, bodyPart]
    )
  }

  const handleEquipmentToggle = (equipmentType) => {
    setEquipment(prev => {
      if (equipmentType === 'none') {
        return ['none']
      }
      const filtered = prev.filter(e => e !== 'none')
      return filtered.includes(equipmentType)
        ? filtered.filter(e => e !== equipmentType)
        : [...filtered, equipmentType]
    })
  }

  const handleProblemToggle = (problem) => {
    setProblems(prev => 
      prev.includes(problem) 
        ? prev.filter(p => p !== problem)
        : [...prev, problem]
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const preferences = {
      duration: duration * 60,
      goals,
      bodyParts: bodyParts.length > 0 ? bodyParts : [BODY_PARTS.FULL_BODY],
      equipment: equipment.length === 0 ? ['none'] : equipment,
      difficulty,
      energyLevel,
      timeOfDay,
      problems
    }

    const validation = validateRoutinePreferences(preferences)
    if (!validation.isValid) {
      alert(validation.error)
      return
    }

    setIsGenerating(true)
    try {
      await onGenerate(preferences)
      setIsSaved(true)
    } catch (error) {
      console.error('Error generating routine:', error)
      alert('Failed to generate routine with AI. Please check your OpenRouter API key and network connection. Fallback routines are no longer available.');
    } finally {
      setIsGenerating(false)
    }
  }
  
  const handleSearchRoutineGenerated = (routine) => {
    setShowSearch(false)
    onGenerate({
      searchGenerated: true,
      routine
    })
  }

  const handleReset = () => {
    setGoals([])
    setBodyParts([])
    setEquipment(['none'])
    setIsSaved(false)
  }

  const durationOptions = [5, 10, 15, 20, 30]

  return (
    <form onSubmit={handleSubmit} className="preferences-form">
      {/* Stats Summary with close button */}
      {stats.totalSessions > 0 && showStatsSummary && (
        <div className="stats-summary" style={{ 
          position: 'relative', 
          backgroundColor: '#d1f5da', 
          borderRadius: '10px', 
          padding: '1rem', 
          marginBottom: '1.5rem',
          color: '#16a34a',
          boxShadow: '0 2px 8px rgba(34, 197, 94, 0.1)'
        }}>
          <span>Welcome back! You've completed {stats.totalSessions} sessions 🎉</span>
          <button
            type="button"
            onClick={closeStatsSummary}
            style={{
              position: 'absolute',
              top: '50%',
              right: 12,
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              color: '#16a34a',
              fontSize: 18,
              cursor: 'pointer',
              padding: 5,
              lineHeight: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10
            }}
            aria-label="Close welcome message"
          >
            ×
          </button>
        </div>
      )}

      {/* Hero Section */}
      <div className="hero-card" style={{ background: '#232b39', borderRadius: '1.25rem', boxShadow: '0 4px 24px 0 #00000022', padding: '2rem 1.5rem', marginBottom: '2rem', textAlign: 'center' }}>
        <MessageCarousel
              messages={[
                "Stretch smarter. Feel stronger.",
                "Release tension. Regain motion.",
                "Unlock your body's best.",
                "Small stretches. Big results.",
                "Breathe in. Stretch out.",
                "Feel better in 5 minutes.",
              ]}
              className="hero-headline"
            />
        <div className="hero-subheadline">Daily guided stretches to unlock your body's best.</div>
      </div>

      {/* Search Toggle Button */}
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <button
          type="button"
          onClick={() => setShowSearch(!showSearch)}
          style={{
            background: '#1a2031',
            color: 'var(--primary-green)',
            border: 'none',
            borderRadius: '999px',
            padding: '0.5rem 1rem',
            fontSize: '0.9rem',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#2d3344';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(34, 197, 94, 0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#1a2031';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <EvaIcon name={showSearch ? "chevron-up-outline" : "search-outline"} width={18} height={18} fill="var(--primary-green)" />
          {showSearch ? "Hide Search" : "Search for Specific Stretches"}
        </button>
      </div>

      {/* Conditional rendering for search or quick start */}
      {showSearch ? (
        <ExerciseSearch 
          onGenerateRoutine={handleSearchRoutineGenerated} 
          defaultDuration={duration}
          defaultDifficulty={difficulty}
        />
      ) : (
        <>
          {/* Quick Start Section */}
          <section className="quick-start-section">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <h2 className="section-title" style={{ color: 'white', fontWeight: 700, marginBottom: 0 }}>Stretch in a Snap</h2>
              <div className="stretch-anim">
                <StretchFigureLottie style={{ width: '100%', height: '100%' }} />
              </div>
            </div>
            <div className="quick-start-grid">
              {quickStartOptions.map(option => (
                <div
                  key={option.id}
                  className="quick-start-card"
                  onClick={option.preset}
                >
                  <div className="quick-start-title">
                    <EvaIcon name={quickStartEvaIcons[option.id]} width={24} height={24} fill={option.iconColor} />
                    <span>{option.title}</span>
                  </div>
                  <div className="quick-start-subtitle">{option.subtitle}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Duration Selection */}
          <section>
            <h2 className="section-title">How much time do you have?</h2>
            <div className="duration-selector">
              {durationOptions.map(time => (
                <button
                  key={time}
                  type="button"
                  className={`time-button ${duration === time ? 'active' : ''}`}
                  onClick={() => setDuration(time)}
                >
                  {time}min
                </button>
              ))}
            </div>
          </section>

          {/* Goals Selection */}
          <section>
            <h2 className="section-title">What's your main goal today?</h2>
            <select
              className="form-input"
              value={goals[0] || ''}
              onChange={e => setGoals([e.target.value])}
              style={{ width: '100%', marginBottom: '1rem' }}
            >
              <option value="" disabled>Select a goal...</option>
              {goalOptions.map(goal => (
                <option key={goal.value} value={goal.value}>
                  {goal.icon} {goal.label}
                </option>
              ))}
            </select>
          </section>

          {/* Body Parts Selection */}
          <section>
            <h2 className="section-title">Which areas to focus on?</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem 1rem', marginBottom: '1rem' }}>
              {bodyPartOptions.map((part, idx) => (
                <label key={part.value} className="body-part-label">
                  <input
                    type="checkbox"
                    checked={bodyParts.includes(part.value)}
                    onChange={e => {
                      if (e.target.checked) {
                        setBodyParts(prev => [...prev, part.value])
                      } else {
                        setBodyParts(prev => prev.filter(v => v !== part.value))
                      }
                    }}
                  />
                  <span>{part.icon} {part.label}</span>
                </label>
              ))}
            </div>
            <button
              type="button"
              className="btn"
              style={{ marginBottom: '1rem' }}
              onClick={() => {
                setBodyParts([...bodyParts]);
                setShowSaveConfirmation(true);
              }}
            >
              {showSaveConfirmation ? (
                <div className="save-confirmation-animation">
                  <EvaIcon name="checkmark-circle-2-outline" style={{ fontSize: 22, color: 'white', marginRight: '6px' }} />
                  <span>Saved!</span>
                </div>
              ) : (
                <span>Save Selection</span>
              )}
            </button>
          </section>

          {/* Equipment Selection */}
          <section>
            <h2 className="section-title">Available Equipment</h2>
            <div className="equipment-grid">
              {Object.entries(EQUIPMENT_INFO).map(([key, info]) => (
                <div
                  key={key}
                  className={`equipment-card ${equipment.includes(key) ? 'active' : ''}`}
                  onClick={() => handleEquipmentToggle(key)}
                >
                  <div className="equipment-icon">
                    {info.icon && info.icon.endsWith && info.icon.endsWith('.svg') ? (
                      <img src={info.icon} alt={info.name} style={{ width: 24, height: 24 }} />
                    ) : (
                      <span style={{ fontSize: '1.5rem' }}>{info.icon}</span>
                    )}
                  </div>
                  <div className="equipment-name">{info.name}</div>
                  <div className="equipment-desc">{info.description}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Difficulty Selection */}
          <section>
            <h2 className="section-title">Difficulty Level</h2>
            <select
              className="form-input"
              value={difficulty}
              onChange={e => setDifficulty(e.target.value)}
              style={{ width: '100%', marginBottom: '1rem' }}
            >
              {Object.values(DIFFICULTY_LEVELS).map(level => (
                <option key={level} value={level}>
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </option>
              ))}
            </select>
          </section>

          {/* Generate Button */}
          <button 
            type="submit" 
            className="btn"
            disabled={isGenerating || goals.length === 0}
          >
            {isGenerating ? (
              <>
                <span className="spinner" style={{ 
                  display: 'inline-block',
                  width: '16px',
                  height: '16px',
                  border: '2px solid white',
                  borderTopColor: 'transparent',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  marginRight: '0.5rem'
                }}></span>
                Generating your routine...
              </>
            ) : (
              <span>Generate My Routine</span>
            )}
          </button>

          {isSaved && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem', justifyContent: 'center' }}>
              <EvaIcon name="checkmark-circle-2-outline" style={{ color: '#22c55e', fontSize: 32 }} titleAccess="Saved!" />
              <button type="button" className="btn btn-secondary" onClick={handleReset} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <EvaIcon name="refresh-outline" style={{ fontSize: 28 }} />
              </button>
            </div>
          )}
        </>
      )}
    </form>
  )
}

export default PreferencesForm