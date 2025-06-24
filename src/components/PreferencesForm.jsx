import React, { useState } from 'react'
import { GOALS, BODY_PARTS, DIFFICULTY_LEVELS, validateRoutinePreferences } from '../routineGenerator'
import { EQUIPMENT_TYPES, EQUIPMENT_INFO } from '../services/api'
import EvaIcon from './EvaIcon';

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

  const quickStartOptions = [
    {
      id: 'morning',
      icon: 'wb_sunny',
      iconColor: '#ff9800',
      title: 'Morning Routine',
      subtitle: '10 min energizing',
      preset: () => {
        setGoals([GOALS.MORNING_WAKE_UP])
        setBodyParts([BODY_PARTS.FULL_BODY])
        setEnergyLevel('medium')
        setDuration(10)
        setEquipment(['none'])
      }
    },
    {
      id: 'desk',
      icon: 'desktop_windows',
      iconColor: '#2196f3',
      title: 'Desk Break',
      subtitle: '5 min neck & shoulders',
      preset: () => {
        setGoals([GOALS.DESK_BREAK])
        setBodyParts([BODY_PARTS.NECK, BODY_PARTS.SHOULDERS, BODY_PARTS.UPPER_BACK])
        setEnergyLevel('low')
        setDuration(5)
        setEquipment(['wall', 'chair'])
      }
    },
    {
      id: 'workout',
      icon: 'fitness_center',
      iconColor: '#9c27b0',
      title: 'Post-Workout',
      subtitle: '15 min recovery',
      preset: () => {
        setGoals([GOALS.POST_WORKOUT])
        setBodyParts([BODY_PARTS.LEGS, BODY_PARTS.HIPS])
        setEnergyLevel('low')
        setDuration(15)
        setEquipment(['foam_roller', 'mat'])
      }
    },
    {
      id: 'bedtime',
      icon: 'bedtime',
      iconColor: '#3f51b5',
      title: 'Bedtime',
      subtitle: '10 min relaxing',
      preset: () => {
        setGoals([GOALS.BEDTIME_RELAX])
        setBodyParts([BODY_PARTS.FULL_BODY])
        setEnergyLevel('low')
        setDuration(10)
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
    } catch (error) {
      console.error('Error generating routine:', error)
      alert('Failed to generate routine. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const durationOptions = [5, 10, 15, 20, 30]

  return (
    <form onSubmit={handleSubmit} className="preferences-form">
      {/* Stats Summary */}
      {stats.totalSessions > 0 && (
        <div className="stats-summary">
          <p>Welcome back! You've completed {stats.totalSessions} sessions 🎉</p>
        </div>
      )}

      {/* Quick Start Section */}
      <section>
        <h2 className="section-title">Quick Start (Optional)</h2>
        <div className="quick-start-grid">
          {quickStartOptions.map(option => (
            <div
              key={option.id}
              className="quick-start-tag"
              onClick={option.preset}
            >
              <EvaIcon name={quickStartEvaIcons[option.id]} fill={option.iconColor} width={24} height={24} />
              <div>
                <p style={{ fontWeight: 500, marginBottom: '0.125rem' }}>{option.title}</p>
                <p style={{ fontSize: '0.75rem', color: '#64748b' }}>{option.subtitle}</p>
              </div>
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
            <label key={part.value} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#1e293b', borderRadius: '6px', padding: '0.5rem' }}>
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
          onClick={() => setBodyParts([...bodyParts])}
        >
          Save Selection
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
    </form>
  )
}

export default PreferencesForm