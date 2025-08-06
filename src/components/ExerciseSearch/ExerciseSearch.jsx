import React, { useState } from 'react';
import { generateRoutineFromSearch } from '../../services/api';
import EvaIcon from '../EvaIcon';

const ExerciseSearch = ({ onGenerateRoutine, defaultDuration = 10, defaultDifficulty = 'intermediate' }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [duration, setDuration] = useState(defaultDuration);
  const [difficulty, setDifficulty] = useState(defaultDifficulty);

  // Popular searches to suggest to users
  const popularSearches = [
    'lower back pain',
    'shoulder tension',
    'hip mobility',
    'neck stiffness',
    'hamstring flexibility',
    'posture improvement',
    'ankle mobility',
    'wrist pain',
    'sciatica relief'
  ];

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setSearchError('Please enter a search term');
      return;
    }

    setIsGenerating(true);
    setSearchError('');
    
    try {
      const routine = await generateRoutineFromSearch(searchTerm, {
        duration: duration * 60, // Convert to seconds
        difficulty
      });
      
      // Format the routine to match the expected structure from routineGenerator
      const formattedRoutine = {
        name: routine.routineName,
        exercises: routine.exercises.map(ex => ({
          name: ex.name,
          duration: ex.duration_seconds,
          description: ex.description,
          equipment: ex.equipment_details || [],
          targetMuscles: ex.primary_muscle_groups,
          benefits: ex.purpose.map(p => `Improves ${p}`),
          tips: ex.cautions,
          videoSearchQuery: ex.name
        })),
        totalDuration: routine.exercises.reduce((sum, ex) => sum + ex.duration_seconds, 0),
        difficulty: difficulty,
        benefits: [...new Set(routine.exercises.flatMap(ex => ex.purpose))].map(p => `Improves ${p}`),
        tips: routine.warmupTips,
        cooldownAdvice: routine.cooldownAdvice,
        isFallback: false,
        source: 'search',
        searchTerm: searchTerm
      };
      
      onGenerateRoutine(formattedRoutine);
    } catch (error) {
      console.error('Error generating routine from search:', error);
      setSearchError('Failed to generate routine. Please try again or check your API key.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePopularSearch = (term) => {
    setSearchTerm(term);
    // Auto-search after a short delay to give user time to see what was selected
    setTimeout(() => {
      handleSearch();
    }, 300);
  };

  return (
    <div className="exercise-search" style={{ padding: '1rem 0' }}>
      <h2 className="section-title">Search for Specific Stretches</h2>
      <p style={{ marginBottom: '1rem', color: '#b0b8c9', fontSize: '0.9rem' }}>
        Enter a body part, condition, or specific goal to get a customized routine
      </p>
      
      <div style={{ position: 'relative', marginBottom: '1rem' }}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="e.g., lower back pain, neck tension, hip mobility..."
          className="form-input"
          style={{ paddingRight: '3rem' }}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button
          onClick={handleSearch}
          style={{
            position: 'absolute',
            right: '0.5rem',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'none',
            border: 'none',
            color: 'var(--primary-green)',
            cursor: 'pointer',
            fontSize: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          aria-label="Search"
        >
          <EvaIcon name="search-outline" width={24} height={24} fill="var(--primary-green)" />
        </button>
      </div>
      
      {searchError && (
        <div style={{ color: '#ef4444', marginBottom: '1rem', fontSize: '0.9rem' }}>
          {searchError}
        </div>
      )}
      
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <label style={{ fontSize: '0.9rem', color: '#e2e8f0' }}>Duration: {duration} min</label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            style={{ padding: '0.25rem 0.5rem', background: '#1a2031', color: '#e2e8f0', border: 'none', borderRadius: '4px' }}
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
        <input
          type="range"
          min="5"
          max="30"
          step="5"
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
          style={{ width: '100%', accentColor: 'var(--primary-green)' }}
        />
      </div>
      
      <div>
        <h3 style={{ fontSize: '0.9rem', color: '#e2e8f0', marginBottom: '0.5rem' }}>Popular Searches:</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {popularSearches.map((term) => (
            <button
              key={term}
              onClick={() => handlePopularSearch(term)}
              style={{
                background: '#1a2031',
                border: 'none',
                padding: '0.5rem 0.75rem',
                borderRadius: '999px',
                fontSize: '0.8rem',
                color: '#b0b8c9',
                cursor: 'pointer',
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
              {term}
            </button>
          ))}
        </div>
      </div>
      
      <button
        onClick={handleSearch}
        className="btn"
        style={{ marginTop: '1.5rem' }}
        disabled={isGenerating || !searchTerm.trim()}
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
            Generating...
          </>
        ) : (
          <span>Generate Routine</span>
        )}
      </button>
    </div>
  );
};

export default ExerciseSearch;