import React from 'react';

const RoutineCard = ({ routine, onClick }) => {
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
      className="routine-card" 
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
      onMouseLeave={(e) => {
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
          {routine.name}
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
            backgroundColor: getDifficultyColor(routine.difficulty_level),
            color: 'white'
          }}>
            {routine.difficulty_level}
          </span>
          <span style={{ 
            padding: '0.25rem 0.75rem',
            borderRadius: '16px',
            fontSize: '0.75rem',
            backgroundColor: '#1a2031',
            color: '#b0b8c9'
          }}>
            {routine.estimated_duration_minutes} min
          </span>
        </div>
        
        <p style={{ 
          fontSize: '0.85rem',
          color: '#b0b8c9',
          marginBottom: '0.75rem',
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          lineHeight: '1.4'
        }}>
          {routine.description}
        </p>
        
        <div style={{ 
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.3rem',
          marginBottom: '0.5rem'
        }}>
          {routine.purpose && routine.purpose.map(purpose => (
            <span 
              key={purpose}
              style={{
                padding: '0.15rem 0.5rem',
                borderRadius: '16px',
                fontSize: '0.75rem',
                fontWeight: '500',
                backgroundColor: 'rgba(34, 197, 94, 0.2)',
                color: '#22c55e',
                border: '1px solid rgba(34, 197, 94, 0.3)'
              }}
            >
              {purpose}
            </span>
          ))}
        </div>
        
        {routine.tags && routine.tags.length > 0 && (
          <div style={{ 
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.3rem'
          }}>
            {routine.tags.map(tag => (
              <span 
                key={tag}
                style={{
                  padding: '0.15rem 0.5rem',
                  borderRadius: '16px',
                  fontSize: '0.75rem',
                  fontWeight: '500',
                  backgroundColor: '#1a2031',
                  color: '#b0b8c9'
                }}
              >
                {tag}
              </span>
            ))}
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
          {routine.exercises ? `${routine.exercises.length} exercises` : ''}
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
          View Routine
        </button>
      </div>
    </div>
  );
};

export default RoutineCard;