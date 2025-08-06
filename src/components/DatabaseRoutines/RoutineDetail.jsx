import React, { useState } from 'react';
import { getYouTubeEmbedUrl } from '../../routineGenerator';
import { loadExerciseVideos } from '../../services/api';

const RoutineDetail = ({ routine, onClose }) => {
  const [selectedExerciseIndex, setSelectedExerciseIndex] = useState(0);
  const [loadingVideo, setLoadingVideo] = useState(false);
  
  const handleStartRoutine = () => {
    // This could later be hooked up to the routine display component
    alert('This would start the routine');
    onClose();
  };
  
  const handleExerciseSelect = (index) => {
    setSelectedExerciseIndex(index);
    
    // Load video if not already loaded
    const exercise = routine.exercises[index];
    if (!exercise.videoId && !exercise.video_url) {
      loadExerciseVideo(exercise, index);
    }
  };
  
  const loadExerciseVideo = async (exercise, index) => {
    setLoadingVideo(true);
    try {
      const exerciseWithVideo = await loadExerciseVideos([{
        name: exercise.name,
        videoSearchQuery: `${exercise.name} stretch how to`
      }]);
      
      if (exerciseWithVideo.length > 0 && exerciseWithVideo[0].videoId) {
        // Update exercise with video info
        routine.exercises[index].videoId = exerciseWithVideo[0].videoId;
        setSelectedExerciseIndex(index); // Refresh view
      }
    } catch (error) {
      console.error('Error loading video:', error);
    }
    setLoadingVideo(false);
  };
  
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
  
  // Get the current exercise
  const currentExercise = routine.exercises[selectedExerciseIndex];
  // Get video ID either from stored videoId or from video_url
  const videoId = currentExercise.videoId || (currentExercise.video_url ? extractVideoId(currentExercise.video_url) : null);
  
  const getDifficultyColor = (level) => {
    switch (level.toLowerCase()) {
      case 'beginner': return '#22c55e'; // Green
      case 'intermediate': return '#f59e0b'; // Yellow
      case 'advanced': return '#ef4444'; // Red
      default: return '#6b7280'; // Gray
    }
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
        }} className="no-scrollbar">
          <h2 style={{ 
            color: 'white', 
            marginTop: 0,
            marginBottom: '0.5rem',
            fontSize: '1.4rem'
          }}>
            {routine.name}
          </h2>
          
          <div style={{ 
            display: 'flex',
            gap: '0.5rem',
            marginBottom: '1rem',
            flexWrap: 'wrap'
          }}>
            <span style={{ 
              padding: '0.25rem 0.75rem',
              borderRadius: '4px',
              fontSize: '0.8rem',
              fontWeight: 'bold',
              backgroundColor: getDifficultyColor(routine.difficulty_level),
              color: 'white'
            }}>
              {routine.difficulty_level}
            </span>
            <span style={{ 
              padding: '0.25rem 0.75rem',
              borderRadius: '4px',
              fontSize: '0.8rem',
              backgroundColor: '#1a2031',
              color: '#b0b8c9'
            }}>
              {routine.estimated_duration_minutes} minutes
            </span>
            <span style={{ 
              padding: '0.25rem 0.75rem',
              borderRadius: '4px',
              fontSize: '0.8rem',
              backgroundColor: '#1a2031',
              color: '#b0b8c9'
            }}>
              {routine.exercises.length} exercises
            </span>
          </div>
          
          <p style={{ 
            color: '#b0b8c9',
            marginBottom: '1.5rem',
            lineHeight: '1.5'
          }}>
            {routine.description}
          </p>
          
          <div style={{ 
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.5rem',
            marginBottom: '1.5rem'
          }}>
            {routine.purpose && routine.purpose.map(purpose => (
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
            
            {routine.tags && routine.tags.map(tag => (
              <span 
                key={tag}
                style={{
                  padding: '0.25rem 0.75rem',
                  borderRadius: '4px',
                  fontSize: '0.8rem',
                  backgroundColor: '#1a2031',
                  color: '#b0b8c9'
                }}
              >
                {tag}
              </span>
            ))}
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h3 style={{ color: 'white', margin: 0, fontSize: '1.1rem' }}>Current Exercise</h3>
              
              <div style={{
                marginBottom: '1rem',
                width: '100%',
                height: 0,
                paddingBottom: '56.25%',
                position: 'relative',
                backgroundColor: '#1a2031',
                borderRadius: '0.5rem',
                overflow: 'hidden'
              }}>
                {loadingVideo ? (
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
                    title={currentExercise.name}
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
                      onClick={() => loadExerciseVideo(currentExercise, selectedExerciseIndex)} 
                      disabled={loadingVideo}
                      style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: 'var(--primary-green)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.3rem',
                        cursor: 'pointer'
                      }}
                    >
                      {loadingVideo ? 'Loading...' : 'Try to find video'}
                    </button>
                  </div>
                )}
              </div>
              
              <div style={{ backgroundColor: '#1a2031', padding: '1rem', borderRadius: '0.5rem' }}>
                <h4 style={{ margin: '0 0 0.5rem 0', color: 'white' }}>{currentExercise.name}</h4>
                <p style={{ margin: '0 0 0.5rem 0', color: '#b0b8c9', fontSize: '0.9rem' }}>{currentExercise.description}</p>
                
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '1rem' }}>
                  <div>
                    <span style={{ fontSize: '0.8rem', color: '#b0b8c9' }}>Duration: </span>
                    <span style={{ fontWeight: 'bold', color: 'white' }}>
                      {currentExercise.duration_seconds ? `${currentExercise.duration_seconds}s` : 'N/A'}
                    </span>
                  </div>
                  
                  <div>
                    <span style={{ fontSize: '0.8rem', color: '#b0b8c9' }}>Repetitions: </span>
                    <span style={{ fontWeight: 'bold', color: 'white' }}>
                      {currentExercise.repetitions || 'N/A'}
                    </span>
                  </div>
                  
                  <div>
                    <span style={{ fontSize: '0.8rem', color: '#b0b8c9' }}>Sets: </span>
                    <span style={{ fontWeight: 'bold', color: 'white' }}>
                      {currentExercise.sets || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 style={{ color: 'white', margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>Routine Exercises</h3>
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column',
                gap: '0.5rem',
                maxHeight: '300px',
                overflowY: 'auto',
                padding: '0.5rem',
                backgroundColor: '#1a2031',
                borderRadius: '0.5rem'
              }} className="no-scrollbar">
                {routine.exercises.map((exercise, index) => (
                  <div 
                    key={`${exercise.exercise_id}_${index}`}
                    style={{
                      padding: '0.75rem',
                      borderRadius: '0.3rem',
                      backgroundColor: index === selectedExerciseIndex ? 'rgba(34, 197, 94, 0.15)' : '#23293a',
                      border: `1px solid ${index === selectedExerciseIndex ? 'rgba(34, 197, 94, 0.3)' : '#2d3448'}`,
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                    onClick={() => handleExerciseSelect(index)}
                  >
                    <div>
                      <span style={{ fontWeight: 'bold', color: 'white' }}>{index + 1}. {exercise.name}</span>
                      <div style={{ fontSize: '0.8rem', color: '#b0b8c9', marginTop: '0.2rem' }}>
                        {exercise.duration_seconds ? `${exercise.duration_seconds}s` : ''}
                        {exercise.repetitions ? ` • ${exercise.repetitions} reps` : ''}
                        {exercise.sets ? ` • ${exercise.sets} sets` : ''}
                      </div>
                    </div>
                    
                    {index === selectedExerciseIndex && (
                      <span style={{ 
                        padding: '0.2rem 0.5rem',
                        borderRadius: '4px',
                        fontSize: '0.7rem',
                        backgroundColor: 'var(--primary-green)',
                        color: 'white'
                      }}>
                        Current
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center' }}>
            <button 
              onClick={handleStartRoutine}
              style={{
                padding: '0.75rem 2rem',
                backgroundColor: 'var(--primary-green)',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
              }}
            >
              Start This Routine
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoutineDetail;