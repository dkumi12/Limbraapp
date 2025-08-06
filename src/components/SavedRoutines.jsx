import React, { useState, useEffect } from 'react'
import EvaIcon from './EvaIcon';
import ExerciseLibrary from './ExerciseLibrary/ExerciseLibrary';
import DatabaseRoutines from './DatabaseRoutines/DatabaseRoutines';

const SavedRoutines = ({ onSelectRoutine, onClose }) => {
  const [savedRoutines, setSavedRoutines] = useState([])
  const [filterGoal, setFilterGoal] = useState('all')
  const [sortBy, setSortBy] = useState('date') // date, duration, name
  const [activeTab, setActiveTab] = useState('routines') // routines, exercises, database

  useEffect(() => {
    loadSavedRoutines()
  }, [])

  const loadSavedRoutines = () => {
    const routines = JSON.parse(localStorage.getItem('savedRoutines') || '[]')
    setSavedRoutines(routines)
  }

  const deleteRoutine = (id) => {
    if (window.confirm('Are you sure you want to delete this routine?')) {
      const updatedRoutines = savedRoutines.filter(r => r.id !== id)
      localStorage.setItem('savedRoutines', JSON.stringify(updatedRoutines))
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
          return new Date(b.savedAt) - new Date(a.savedAt)
        case 'duration':
          return b.totalDuration - a.totalDuration
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

  // Tab navigation render
  const renderTabs = () => {
    return (
      <div className="tab-navigation" style={{ 
        display: 'flex', 
        borderBottom: '1px solid #2d3448',
        marginBottom: '1.5rem',
        position: 'sticky',
        top: 0,
        backgroundColor: '#23293a',
        zIndex: 10,
        borderRadius: '0.5rem 0.5rem 0 0',
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
      }}>
        <button 
          className={`tab-button ${activeTab === 'routines' ? 'active-tab' : ''}`}
          onClick={() => setActiveTab('routines')}
          style={{
            padding: '1rem',
            flex: 1,
            border: 'none',
            backgroundColor: activeTab === 'routines' ? 'rgba(34, 197, 94, 0.15)' : 'transparent',
            cursor: 'pointer',
            fontWeight: activeTab === 'routines' ? '600' : '400',
            color: activeTab === 'routines' ? 'var(--primary-green)' : '#b0b8c9',
            borderBottom: activeTab === 'routines' ? '2px solid var(--primary-green)' : 'none'
          }}
        >
          My Routines
        </button>
        <button 
          className={`tab-button ${activeTab === 'exercises' ? 'active-tab' : ''}`}
          onClick={() => setActiveTab('exercises')}
          style={{
            padding: '1rem',
            flex: 1,
            border: 'none',
            backgroundColor: activeTab === 'exercises' ? 'rgba(34, 197, 94, 0.15)' : 'transparent',
            cursor: 'pointer',
            fontWeight: activeTab === 'exercises' ? '600' : '400',
            color: activeTab === 'exercises' ? 'var(--primary-green)' : '#b0b8c9',
            borderBottom: activeTab === 'exercises' ? '2px solid var(--primary-green)' : 'none'
          }}
        >
          Exercise Library
        </button>
        <button 
          className={`tab-button ${activeTab === 'database' ? 'active-tab' : ''}`}
          onClick={() => setActiveTab('database')}
          style={{
            padding: '1rem',
            flex: 1,
            border: 'none',
            backgroundColor: activeTab === 'database' ? 'rgba(34, 197, 94, 0.15)' : 'transparent',
            cursor: 'pointer',
            fontWeight: activeTab === 'database' ? '600' : '400',
            color: activeTab === 'database' ? 'var(--primary-green)' : '#b0b8c9',
            borderBottom: activeTab === 'database' ? '2px solid var(--primary-green)' : 'none'
          }}
        >
          Browse Routines
        </button>
      </div>
    )
  }

  // Tab content render
  const renderTabContent = () => {
    switch (activeTab) {
      case 'exercises':
        return <ExerciseLibraryWrapper />;
      case 'database':
        return <DatabaseRoutinesWrapper />;
      case 'routines':
      default:
        return renderSavedRoutines();
    }
  }
  
  // Wrapper components to ensure consistent styling
  const ExerciseLibraryWrapper = () => {
    return (
      <div className="tab-content-wrapper" style={{ maxWidth: '800px', margin: '0 auto', background: '#23293a', padding: '1rem', borderRadius: '0.75rem', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
        <ExerciseLibrary />
      </div>
    );
  }
  
  const DatabaseRoutinesWrapper = () => {
    return (
      <div className="tab-content-wrapper" style={{ maxWidth: '800px', margin: '0 auto', background: '#23293a', padding: '1rem', borderRadius: '0.75rem', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
        <DatabaseRoutines />
      </div>
    );
  }

  // Saved routines content
  const renderSavedRoutines = () => {
    return (
      <div className="saved-content" style={{ padding: '1rem', maxWidth: '800px', margin: '0 auto', background: '#23293a', borderRadius: '0.75rem', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
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
            style={{ 
              flex: 1, 
              minWidth: '150px', 
              background: '#1a2031', 
              color: '#e2e8f0',
              border: 'none',
              borderRadius: '12px'
            }}
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
            style={{ 
              flex: 1, 
              minWidth: '150px', 
              background: '#1a2031', 
              color: '#e2e8f0',
              border: 'none',
              borderRadius: '12px'
            }}
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
            color: '#b0b8c9'
          }}>
            <p style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No routines yet</p>
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
                  background: '#23293a',
                  padding: '1.25rem',
                  borderRadius: '12px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                  cursor: 'pointer',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  position: 'relative',
                  color: 'white'
                }}
                onClick={() => onSelectRoutine(routine)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(34, 197, 94, 0.2)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)'
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
                  paddingRight: '2rem',
                  color: 'white'
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
                  color: '#b0b8c9',
                  fontSize: '0.875rem'
                }}>
                  <span>
                    <span className="material-icons" style={{ fontSize: '1rem', verticalAlign: 'middle' }}>
                      timer
                    </span>{' '}
                    {formatDuration(routine.totalDuration)}
                  </span>
                  <span>{formatDate(routine.savedAt)}</span>
                </div>
                
                {routine.exercises && (
                  <div style={{ 
                    marginTop: '0.75rem',
                    fontSize: '0.875rem',
                    color: '#b0b8c9'
                  }}>
                    {routine.exercises.length} exercises
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="saved-routines-page" style={{ background: '#23293a', minHeight: '100vh', paddingBottom: '5rem' }}>
      <header className="header" style={{ padding: '1.5rem 1rem 1rem', display: 'flex', alignItems: 'center', gap: '1rem', position: 'relative' }}>
        <button 
          className="settings-back-btn"
          onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'home' }))}
          style={{ 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: '#23293a',
            border: 'none',
            cursor: 'pointer',
            transition: 'background 0.2s, box-shadow 0.2s',
            boxShadow: '0 2px 8px rgba(20,24,31,0.08)'
          }}
          aria-label="Back"
        >
          <EvaIcon name="arrow-back-outline" width={28} height={28} fill="#22c55e" />
        </button>
        <div>
          <h1 className="header-text" style={{ color: 'white', textAlign: 'left', margin: 0 }}>Stretching Library</h1>
          <p className="subheader-text" style={{ color: '#b0b8c9', textAlign: 'left', margin: 0 }}>Browse, save, and discover stretching exercises and routines</p>
        </div>
      </header>
      <nav className="nav-bar">
        <button className={`nav-item`} onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'home' }))}>
          <EvaIcon name="home-outline" width={24} height={24} fill="#b0b8c9" />
          <span style={{ color: '#b0b8c9' }}>Home</span>
        </button>
        <button className={`nav-item nav-item-active`} disabled>
          <EvaIcon name="bookmark-outline" width={24} height={24} fill="#22c55e" />
          <span style={{ color: '#22c55e' }}>Library</span>
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

      {/* Tab Navigation */}
      {renderTabs()}

      {/* Tab Content */}
      {renderTabContent()}
    </div>
  )
}

export default SavedRoutines