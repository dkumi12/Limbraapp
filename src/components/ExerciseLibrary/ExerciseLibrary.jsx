import React, { useState, useEffect } from 'react';
import { stretchingDatabase } from '../../services/database/stretchingDatabase';
import ExerciseCard from './ExerciseCard';
import ExerciseDetail from './ExerciseDetail';
import '../../theme.css';

const ExerciseLibrary = () => {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [filters, setFilters] = useState({
    type: '',
    difficulty: '',
    muscleGroup: '',
    purpose: '',
    equipment: ''
  });
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    loadExercises();
  }, [filters, searchQuery]);
  
  const loadExercises = async () => {
    setLoading(true);
    try {
      const exerciseData = await stretchingDatabase.getAllExercises({
        ...filters,
        search: searchQuery
      });
      setExercises(exerciseData);
      setError(null);
    } catch (err) {
      console.error('Error loading exercises:', err);
      setError('Failed to load exercises. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSearch = (e) => {
    e.preventDefault();
    // Search is triggered by the effect
  };
  
  const handleSelectExercise = (exercise) => {
    setSelectedExercise(exercise);
  };
  
  const handleCloseDetail = () => {
    setSelectedExercise(null);
  };
  
  return (
    <div className="exercise-library-container" style={{ padding: '0 1.5rem', maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ color: 'var(--primary-green)', margin: '0 0 1rem 0', fontSize: '1.5rem' }}>Exercise Library</h2>
      
      <div className="exercise-filters" style={{ marginBottom: '1.5rem' }}>
        <form onSubmit={handleSearch} style={{ marginBottom: '1rem' }}>
          <input
            type="text"
            placeholder="Search exercises..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ 
              padding: '0.75rem', 
              borderRadius: '12px',
              border: 'none',
              width: '100%',
              maxWidth: '400px',
              background: '#1a2031',
              color: '#e2e8f0'
            }}
          />
          <button 
            type="submit" 
            style={{ 
              marginLeft: '0.5rem',
              backgroundColor: 'var(--primary-green)',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.25rem',
              borderRadius: '12px',
              cursor: 'pointer'
            }}
          >
            Search
          </button>
        </form>
        
        <div className="filter-controls" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
          <select 
            name="type" 
            value={filters.type}
            onChange={handleFilterChange}
            style={{ 
              padding: '0.75rem', 
              borderRadius: '12px',
              border: 'none',
              backgroundColor: '#1a2031',
              color: '#e2e8f0'
            }}
          >
            <option value="">All Types</option>
            <option value="Static">Static</option>
            <option value="Dynamic">Dynamic</option>
            <option value="PNF">PNF</option>
            <option value="Ballistic">Ballistic</option>
            <option value="Isometric">Isometric</option>
          </select>
          
          <select 
            name="difficulty" 
            value={filters.difficulty}
            onChange={handleFilterChange}
            style={{ 
              padding: '0.75rem', 
              borderRadius: '12px',
              border: 'none',
              backgroundColor: '#1a2031',
              color: '#e2e8f0'
            }}
          >
            <option value="">All Difficulties</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
          
          <select 
            name="muscleGroup" 
            value={filters.muscleGroup}
            onChange={handleFilterChange}
            style={{ 
              padding: '0.75rem', 
              borderRadius: '12px',
              border: 'none',
              backgroundColor: '#1a2031',
              color: '#e2e8f0'
            }}
          >
            <option value="">All Muscle Groups</option>
            <option value="Neck">Neck</option>
            <option value="Shoulders">Shoulders</option>
            <option value="Upper Back">Upper Back</option>
            <option value="Lower Back">Lower Back</option>
            <option value="Chest">Chest</option>
            <option value="Arms">Arms</option>
            <option value="Hips">Hips</option>
            <option value="Legs">Legs</option>
            <option value="Calves">Calves</option>
          </select>
          
          <select 
            name="purpose" 
            value={filters.purpose}
            onChange={handleFilterChange}
            style={{ 
              padding: '0.75rem', 
              borderRadius: '12px',
              border: 'none',
              backgroundColor: '#1a2031',
              color: '#e2e8f0'
            }}
          >
            <option value="">All Purposes</option>
            <option value="Warm-up">Warm-up</option>
            <option value="Cool-down">Cool-down</option>
            <option value="Flexibility">Flexibility</option>
            <option value="Rehabilitation">Rehabilitation</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Sport-Specific">Sport-Specific</option>
          </select>
          
          <select 
            name="equipment" 
            value={filters.equipment}
            onChange={handleFilterChange}
            style={{ 
              padding: '0.75rem', 
              borderRadius: '12px',
              border: 'none',
              backgroundColor: '#1a2031',
              color: '#e2e8f0'
            }}
          >
            <option value="">All Equipment</option>
            <option value="false">No Equipment</option>
            <option value="true">With Equipment</option>
          </select>
        </div>
      </div>
      
      {error && <div style={{ color: '#ef4444', marginBottom: '1rem' }}>{error}</div>}
      
      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#b0b8c9' }}>Loading exercises...</div>
      ) : (
        <>
          <div style={{ marginBottom: '1rem', fontSize: '0.9rem', color: '#b0b8c9' }}>
            Found {exercises.length} exercises
          </div>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '1rem'
          }}>
            {exercises.map(exercise => (
              <ExerciseCard 
                key={exercise.exercise_id} 
                exercise={exercise}
                onClick={() => handleSelectExercise(exercise)}
              />
            ))}
          </div>
          
          {exercises.length === 0 && !loading && (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#b0b8c9' }}>
              No exercises found matching your criteria. Try adjusting your filters.
            </div>
          )}
        </>
      )}
      
      {selectedExercise && (
        <ExerciseDetail 
          exercise={selectedExercise}
          onClose={handleCloseDetail}
        />
      )}
    </div>
  );
};

export default ExerciseLibrary;