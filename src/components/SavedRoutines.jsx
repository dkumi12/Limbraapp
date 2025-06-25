import React, { useState, useEffect } from 'react'
import EvaIcon from './EvaIcon';

const SavedRoutines = ({ onSelectRoutine, onClose }) => {
  const [savedRoutines, setSavedRoutines] = useState([])
  const [filterGoal, setFilterGoal] = useState('all')
  const [sortBy, setSortBy] = useState('date') // date, duration, name

  useEffect(() => {
    loadSavedRoutines()
  }, [])

  const loadSavedRoutines = () => {
    const routines = JSON.parse(localStorage.getItem('saved_routines') || '[]')
    setSavedRoutines(routines)
  }

  const deleteRoutine = (id) => {
    if (window.confirm('Are you sure you want to delete this routine?')) {
      const updatedRoutines = savedRoutines.filter(r => r.id !== id)
      localStorage.setItem('saved_routines', JSON.stringify(updatedRoutines))
      setSavedRoutines(updatedRoutines)
    }
  }

  const getAllGoals = () => {
    const goals = new Set(['all'])
    savedRoutines.forEach(routine => {
      routine.goals?.forEach(goal => goals.add(goal))
    })
    return Array.from(goals)
  }
  const getFilteredAndSortedRoutines = () => {
    let filtered = savedRoutines
    
    // Filter by goal
    if (filterGoal !== 'all') {
      filtered = filtered.filter(routine => 
        routine.goals?.includes(filterGoal)
      )
    }
    
    // Sort
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.savedDate) - new Date(a.savedDate)
        case 'duration':
          return b.duration - a.duration
        case 'name':
          return (a.name || '').localeCompare(b.name || '')
        default:
          return 0
      }
    })
    
    return sorted
  }

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now - date)
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    
    return date.toLocaleDateString()
  }

  const displayRoutines = getFilteredAndSortedRoutines()

  return (
    <div className="saved-routines-page">
      <header className="header">
        <button 
          className="back-button"
          onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'home' }))}
          style={{ 
            position: 'absolute', 
            left: '1rem', 
            top: '1rem',
            background: 'none',
            border: 'none',
            fontSize: '1.5rem',
            cursor: 'pointer'
          }}
        >
          ←
        </button>
        <h1 className="header-text">Saved Routines</h1>
        <p className="subheader-text">Your personalized stretching library</p>
      </header>
      <nav className="nav-bar">
        <button className={`nav-item`} onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'home' }))}>
          <EvaIcon name="home-outline" width={24} height={24} fill="#b0b8c9" />
          <span style={{ color: '#b0b8c9' }}>Home</span>
        </button>
        <button className={`nav-item nav-item-active`} disabled>
          <EvaIcon name="bookmark-outline" width={24} height={24} fill="#22c55e" />
          <span style={{ color: '#22c55e' }}>Saved</span>
        </button>
        <button className={`nav-item`} onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'profile' }))}>
          <EvaIcon name="person-outline" width={24} height={24} fill="#b0b8c9" />
          <span style={{ color: '#b0b8c9' }}>Profile</span>
        </button>
        <button className={`nav-item`} onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'settings' }))}>
          <EvaIcon name="settings-outline" width={24} height={24} fill="#b0b8c9" />
          <span style={{ color: '#b0b8c9' }}>Settings</span>
        </button>
      </nav>
      <div className="saved-content" style={{ padding: '1.5rem', maxWidth: '800px', margin: '0 auto' }}>
        {/* Filters and Sorting */}
        <div className="filters-row" style={{ 
          display: 'flex', 
          gap: '1rem', 
          marginBottom: '1.5rem',
          flexWrap: 'wrap'
        }}>
          <select
            className="form-input"
            value={filterGoal}
            onChange={(e) => setFilterGoal(e.target.value)}
            style={{ flex: 1, minWidth: '150px' }}
          >
            {getAllGoals().map(goal => (
              <option key={goal} value={goal}>
                {goal === 'all' ? 'All Goals' : goal}
              </option>
            ))}
          </select>
          
          <select
            className="form-input"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{ flex: 1, minWidth: '150px' }}
          >
            <option value="date">Sort by Date</option>
            <option value="duration">Sort by Duration</option>
            <option value="name">Sort by Name</option>
          </select>
        </div>

        {/* Routines List */}
        {displayRoutines.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '3rem',
            color: '#64748b'
          }}>
            <p style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No saved routines yet</p>
            <p>Complete a routine and save it to build your library</p>
          </div>
        ) : (
          <div className="routines-grid" style={{ 
            display: 'grid', 
            gap: '1rem',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))'
          }}>
            {displayRoutines.map(routine => (
              <div 
                key={routine.id} 
                className="routine-card"
                style={{
                  background: 'white',
                  padding: '1.25rem',
                  borderRadius: '12px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  cursor: 'pointer',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  position: 'relative'
                }}
                onClick={() => onSelectRoutine(routine)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)'
                }}
              >
                <button
                  className="delete-button"
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteRoutine(routine.id)
                  }}
                  style={{
                    position: 'absolute',
                    top: '0.75rem',
                    right: '0.75rem',
                    background: 'none',
                    border: 'none',
                    color: '#ef4444',
                    cursor: 'pointer',
                    fontSize: '1.25rem',
                    padding: '0.25rem',
                    lineHeight: 1
                  }}
                >
                  ×
                </button>
                
                <h3 style={{ 
                  marginBottom: '0.5rem',
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  paddingRight: '2rem'
                }}>
                  {routine.name || 'Untitled Routine'}
                </h3>
                
                <div style={{ 
                  display: 'flex', 
                  gap: '0.5rem', 
                  marginBottom: '0.75rem',
                  flexWrap: 'wrap'
                }}>
                  {routine.goals?.map(goal => (
                    <span 
                      key={goal}
                      style={{
                        background: 'var(--primary-green)',
                        color: 'white',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '16px',
                        fontSize: '0.75rem',
                        fontWeight: '500'
                      }}
                    >
                      {goal}
                    </span>
                  ))}
                </div>
                
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  color: '#64748b',
                  fontSize: '0.875rem'
                }}>
                  <span>
                    <span className="material-icons" style={{ fontSize: '1rem', verticalAlign: 'middle' }}>
                      timer
                    </span>{' '}
                    {formatDuration(routine.duration)}
                  </span>
                  <span>{formatDate(routine.savedDate)}</span>
                </div>
                
                {routine.exercises && (
                  <div style={{ 
                    marginTop: '0.75rem',
                    fontSize: '0.875rem',
                    color: '#475569'
                  }}>
                    {routine.exercises.length} exercises
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default SavedRoutines