import React from 'react';
import EvaIcon from './EvaIcon';

const ShareStreak = ({ streak, onClose }) => {
  const handleShare = async () => {
    const shareText = `I just hit a ${streak}-day wellness streak on Limbra! 🔥 Join me in building healthy habits.`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Limbra Wellness Streak',
          text: shareText,
          url: window.location.origin
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback to copy to clipboard
      navigator.clipboard.writeText(shareText + ' ' + window.location.origin);
      alert('Copied to clipboard!');
    }
  };

  return (
    <div style={{ 
      position: 'fixed', 
      top: 0, left: 0, right: 0, bottom: 0, 
      background: 'rgba(0,0,0,0.5)', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      zIndex: 1100,
      padding: '1rem',
      backdropFilter: 'blur(4px)'
    }}>
      <div style={{ 
        background: 'white', 
        borderRadius: '1.5rem', 
        width: '100%', 
        maxWidth: '350px', 
        overflow: 'hidden',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        textAlign: 'center',
        padding: '2rem',
        position: 'relative'
      }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔥</div>
        <button 
          onClick={onClose}
          style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          <EvaIcon name="close-outline" width={24} height={24} fill="#64748b" />
        </button>
        <h2 style={{ margin: '0 0 0.5rem', fontSize: '1.5rem', fontWeight: 'bold' }}>You're on Fire!</h2>
        <p style={{ margin: '0 0 1.5rem', color: '#64748b' }}>You've reached a <strong>{streak}-day streak</strong>! Consistency is the key to lasting wellness.</p>
        
        <button 
          className="btn" 
          style={{ width: '100%', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }} 
          onClick={handleShare}
        >
          Share Milestone
        </button>
        <button 
          className="btn btn-secondary" 
          style={{ width: '100%', border: 'none', background: 'transparent' }} 
          onClick={onClose}
        >
          Keep Going
        </button>
      </div>
    </div>
  );
};

export default ShareStreak;