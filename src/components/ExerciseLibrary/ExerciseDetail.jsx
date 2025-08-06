import React, { useState, useEffect } from 'react';
import { getYouTubeEmbedUrl } from '../../routineGenerator';
import { loadExerciseVideos } from '../../services/api';

const ExerciseDetail = ({ exercise, onClose }) => {
  const [videoId, setVideoId] = useState(null);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if (exercise.video_url) {
      const extractedId = extractVideoId(exercise.video_url);
      if (extractedId) {
        setVideoId(extractedId);
      } else {
        loadVideo();
      }
    } else {
      loadVideo();
    }
  }, [exercise]);
  
  const extractVideoId = (url) => {
    if (!url) return null;
    
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\?\/]+)/,
      /youtube\.com\/watch\?.*v=([^&]+)/
    ];
    
    for (const pattern of patterns) {
      const match = url?.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
    
    return null;
  };
  
  const loadVideo = async () => {
    setLoading(true);
    try {
      const exerciseWithVideo = await loadExerciseVideos([{
        name: exercise.name,
        videoSearchQuery: `${exercise.name} stretch how to`
      }]);
      
      if (exerciseWithVideo.length > 0 && exerciseWithVideo[0].videoId) {
        setVideoId(exerciseWithVideo[0].videoId);
      }
    } catch (error) {
      console.error('Error loading video:', error);
    }
    setLoading(false);
  };
  
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
      padding: 0
    }}>
      <div style={{
        backgroundColor: '#23293a',
        width: '100%',
        maxWidth: '448px', 
        height: '100vh',
        overflow: 'hidden',
        position: 'relative',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
      }}>
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'none',
            border: 'none',
            fontSize: '1.5rem',
            cursor: 'pointer',
            color: '#fff',
            zIndex: 1
          }}
        >
          ×
        </button>
        
        <div style={{ 
          padding: '1.5rem', 
          height: '100%', 
          overflow: 'auto'
        }} className="no-scrollbar">>
          <h2 style={{ 
            color: 'white', 
            marginTop: 0,
            marginBottom: '0.5rem',
            fontSize: '1.4rem'
          }}>
            {exercise.name}
          </h2>
          
          <div style={{ 
            display: 'flex',
            gap: '0.5rem',
            marginBottom: '1.5rem',
            flexWrap: 'wrap'
          }}>
            <span style={{ 
              padding: '0.25rem 0.75rem',
              borderRadius: '4px',
              fontSize: '0.8rem',
              fontWeight: 'bold',
              backgroundColor: exercise.difficulty_level.toLowerCase() === 'beginner' ? '#22c55e' : 
                               exercise.difficulty_level.toLowerCase() === 'intermediate' ? '#f59e0b' : '#ef4444',
              color: 'white'
            }}>
              {exercise.difficulty_level}
            </span>
            <span style={{ 
              padding: '0.25rem 0.75rem',
              borderRadius: '4px',
              fontSize: '0.8rem',
              backgroundColor: '#1a2031',
              color: '#b0b8c9'
            }}>
              {exercise.type}
            </span>
            {exercise.duration_seconds && (
              <span style={{ 
                padding: '0.25rem 0.75rem',
                borderRadius: '4px',
                fontSize: '0.8rem',
                backgroundColor: '#1a2031',
                color: '#b0b8c9'
              }}>
                {exercise.duration_seconds}s
              </span>
            )}
          </div>
          
          <div style={{
            marginBottom: '1.5rem',
            width: '100%',
            height: 0,
            paddingBottom: '56.25%',
            position: 'relative',
            backgroundColor: '#1a2031',
            borderRadius: '0.5rem',
            overflow: 'hidden'
          }}>
            {loading ? (
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                color: '#b0b8c9'
              }}>
                Loading video...
              </div>
            ) : videoId ? (
              <iframe
                src={getYouTubeEmbedUrl(videoId)}
                title={exercise.name}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  border: 'none'
                }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            ) : (
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                color: '#b0b8c9'
              }}>
                <p>No video available for this exercise</p>
                <button 
                  onClick={loadVideo} 
                  disabled={loading}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: 'var(--primary-green)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.3rem',
                    cursor: 'pointer'
                  }}
                >
                  {loading ? 'Loading...' : 'Try to find video'}
                </button>
              </div>
            )}
          </div>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ color: 'white', marginBottom: '0.5rem', fontSize: '1.1rem' }}>Instructions</h3>
            <p style={{ color: '#b0b8c9', lineHeight: '1.6' }}>{exercise.description}</p>
          </div>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ color: 'white', marginBottom: '0.5rem', fontSize: '1.1rem' }}>Target Muscles</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {exercise.primary_muscle_groups.map(muscle => (
                <span 
                  key={muscle} 
                  style={{
                    padding: '0.25rem 0.75rem',
                    borderRadius: '4px',
                    fontSize: '0.8rem',
                    backgroundColor: 'rgba(34, 197, 94, 0.15)',
                    color: '#22c55e',
                    border: '1px solid rgba(34, 197, 94, 0.3)'
                  }}
                >
                  {muscle}
                </span>
              ))}
              {exercise.secondary_muscle_groups && exercise.secondary_muscle_groups.map(muscle => (
                <span 
                  key={muscle} 
                  style={{
                    padding: '0.25rem 0.75rem',
                    borderRadius: '4px',
                    fontSize: '0.8rem',
                    backgroundColor: '#1a2031',
                    color: '#b0b8c9',
                    border: '1px solid #2d3448'
                  }}
                >
                  {muscle}
                </span>
              ))}
            </div>
          </div>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ color: 'white', marginBottom: '0.5rem', fontSize: '1.1rem' }}>Purpose</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {exercise.purpose.map(purpose => (
                <span 
                  key={purpose} 
                  style={{
                    padding: '0.25rem 0.75rem',
                    borderRadius: '4px',
                    fontSize: '0.8rem',
                    backgroundColor: 'rgba(34, 197, 94, 0.15)',
                    color: '#22c55e',
                    border: '1px solid rgba(34, 197, 94, 0.3)'
                  }}
                >
                  {purpose}
                </span>
              ))}
            </div>
          </div>
          
          {exercise.equipment_needed && (
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ color: 'white', marginBottom: '0.5rem', fontSize: '1.1rem' }}>Equipment</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {exercise.equipment_details && exercise.equipment_details.map(equipment => (
                  <span 
                    key={equipment} 
                    style={{
                      padding: '0.25rem 0.75rem',
                      borderRadius: '4px',
                      fontSize: '0.8rem',
                      backgroundColor: '#1a2031',
                      color: '#b0b8c9',
                      border: '1px solid #2d3448'
                    }}
                  >
                    {equipment}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {exercise.cautions && (
            <div style={{ 
              marginBottom: '1.5rem',
              padding: '1rem',
              borderRadius: '0.5rem',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.2)'
            }}>
              <h3 style={{ color: '#ef4444', marginTop: 0, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem' }}>
                ⚠️ Cautions
              </h3>
              <p style={{ color: '#ef4444', margin: 0 }}>{exercise.cautions}</p>
            </div>
          )}
          
          <button 
            style={{
              display: 'block',
              width: '100%',
              padding: '0.75rem',
              backgroundColor: 'var(--primary-green)',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              textAlign: 'center',
              marginTop: '2rem'
            }}
          >
            Start Exercise
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExerciseDetail;