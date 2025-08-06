import React, { useState, useEffect } from 'react';
import { stretchingDatabase } from '../../services/database/stretchingDatabase';
import RoutineCard from './RoutineCard';
import RoutineDetail from './RoutineDetail';
import '../../theme.css';

const DatabaseRoutines = () => {
  const [routines, setRoutines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRoutine, setSelectedRoutine] = useState(null);
  const [filters, setFilters] = useState({
    difficulty: '',
    purpose: '',
    duration: ''
  });
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    loadRoutines();
  }, [filters, searchQuery]);
  
  const loadRoutines = async () => {
    setLoading(true);
    try {
      const routineData = await stretchingDatabase.getAllRoutines({
        ...filters,
        search: searchQuery
      });
      setRoutines(routineData);
      setError(null);
    } catch (err) {
      console.error('Error loading routines:', err);
      setError('Failed to load routines. Please try again later.');
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
  
  const handleSelectRoutine = async (routineId) => {
    setLoading(true);
    try {
      const detailedRoutine = await stretchingDatabase.getDetailedRoutine(routineId);
      setSelectedRoutine(detailedRoutine);
    } catch (err) {
      console.error('Error loading routine details:', err);
      setError('Failed to load routine details. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleCloseDetail = () => {
    setSelectedRoutine(null);
  };
  
  return (
    <div className="database-routines-container" style={{ padding: '0 1.5rem', maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ color: 'var(--primary-green)', margin: '0 0 1rem 0', fontSize: '1.5rem' }}>Browse Routines</h2>
      
      <div className="routine-filters" style={{ marginBottom: '1.5rem' }}>
        <form onSubmit={handleSearch} style={{ marginBottom: '1rem' }}>
          <input
            type="text"
            placeholder="Search routines..."
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
            <option value="Daily Flexibility">Daily Flexibility</option>
            <option value="Sport-Specific">Sport-Specific</option>
          </select>
          
          <select 
            name="duration" 
            value={filters.duration}
            onChange={handleFilterChange}
            style={{ 
              padding: '0.75rem', 
              borderRadius: '12px',
              border: 'none',
              backgroundColor: '#1a2031',
              color: '#e2e8f0'
            }}
          >
            <option value="">Any Duration</option>
            <option value="5">5 minutes or less</option>
            <option value="10">10 minutes or less</option>
            <option value="15">15 minutes or less</option>
            <option value="20">20 minutes or less</option>
            <option value="30">30 minutes or less</option>
          </select>
        </div>
      </div>
      
      {error && <div style={{ color: '#ef4444', marginBottom: '1rem' }}>{error}</div>}
      
      {loading && !selectedRoutine ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#b0b8c9' }}>Loading routines...</div>
      ) : (
        <>
          <div style={{ marginBottom: '1rem', fontSize: '0.9rem', color: '#b0b8c9' }}>
            Found {routines.length} routines
          </div>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '1rem'
          }}>
            {routines.map(routine => (
              <RoutineCard 
                key={routine.routine_id} 
                routine={routine}
                onClick={() => handleSelectRoutine(routine.routine_id)}
              />
            ))}
          </div>
          
          {routines.length === 0 && !loading && (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#b0b8c9' }}>
              No routines found matching your criteria. Try adjusting your filters.
            </div>
          )}
        </>
      )}
      
      {selectedRoutine && (
        <RoutineDetail 
          routine={selectedRoutine}
          onClose={handleCloseDetail}
        />
      )}
    </div>
  );
};

export default DatabaseRoutines;