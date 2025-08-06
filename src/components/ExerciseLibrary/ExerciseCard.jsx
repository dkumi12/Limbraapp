import React from 'react';
import { getYouTubeEmbedUrl } from '../../routineGenerator';

const ExerciseCard = ({ exercise, onClick }) => {
  const getDifficultyColor = (level) => {
    switch (level.toLowerCase()) {
      case 'beginner': return '#22c55e'; // Green
      case 'intermediate': return '#f59e0b'; // Yellow
      case 'advanced': return '#ef4444'; // Red
      default: return '#6b7280'; // Gray
    }
  };

  return (
    <div 
      className="exercise-card" 
      onClick={onClick}
      style={{
        background: '#23293a',
        padding: '1.25rem',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        color: 'white'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(34, 197, 94, 0.2)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
      }}
    >
      <div style={{ padding: '1rem', flexGrow: 1 }}>
        <h3 style={{ 
          marginBottom: '0.5rem',
          fontSize: '1.125rem',
          fontWeight: '600',
          paddingRight: '2rem',
          color: 'white'
        }}>
          {exercise.name}
        </h3>
        
        <div style={{ 
          display: 'flex', 
          gap: '0.5rem', 
          marginBottom: '0.75rem',
          flexWrap: 'wrap'
        }}>
          <span style={{ 
            padding: '0.25rem 0.75rem',
            borderRadius: '16px',
            fontSize: '0.75rem',
            fontWeight: '500',
            backgroundColor: getDifficultyColor(exercise.difficulty_level),
            color: 'white'
          }}>
            {exercise.difficulty_level}
          </span>
          <span style={{ 
            padding: '0.25rem 0.75rem',
            borderRadius: '16px',
            fontSize: '0.75rem',
            backgroundColor: '#1a2031',
            color: '#b0b8c9'
          }}>
            {exercise.type}
          </span>
        </div>
        
        <div style={{ 
          fontSize: '0.85rem',
          color: '#b0b8c9',
          marginBottom: '0.75rem'
        }}>
          <span style={{ fontWeight: 'bold' }}>Targets:</span>{' '}
          <span>{exercise.primary_muscle_groups.join(', ')}</span>
        </div>
        
        {exercise.equipment_needed && (
          <div style={{ 
            fontSize: '0.85rem',
            color: '#b0b8c9',
            marginBottom: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem'
          }}>
            <span style={{ fontSize: '1rem' }}>⚙️</span>
            <span>
              {exercise.equipment_details && exercise.equipment_details.length > 0 
                ? exercise.equipment_details.join(', ')
                : 'Equipment needed'
              }
            </span>
          </div>
        )}
      </div>
      
      <div style={{ 
        borderTop: '1px solid #1a2031',
        padding: '0.75rem 1rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#1a2031'
      }}>
        <span style={{ 
          fontSize: '0.85rem',
          color: '#b0b8c9'
        }}>
          {exercise.duration_seconds ? `${exercise.duration_seconds}s` : 'Variable duration'}
        </span>
        <button 
          style={{ 
            fontSize: '0.85rem',
            padding: '0.25rem 0.75rem',
            backgroundColor: 'var(--primary-green)',
            color: 'white',
            border: 'none',
            borderRadius: '16px',
            cursor: 'pointer',
            fontWeight: '500'
          }}
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default ExerciseCard;