import React, { useState } from 'react';
import { supabase } from '../services/supabase';
import EvaIcon from './EvaIcon';

const Auth = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
          },
        });
        if (error) throw error;
        setMessage('Check your email for the confirmation link!');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container" style={{ padding: '2rem', maxWidth: '400px', margin: '0 auto', textAlign: 'center' }}>
      <header className="header" style={{ marginBottom: '2rem' }}>
        <div style={{ fontWeight: 'bold', fontSize: '2.5rem', letterSpacing: '0.02em', color: 'var(--primary-green)' }}>LIMBRA</div>
        <div style={{ fontSize: '0.8rem', color: '#b0b8c9', marginTop: '0.2rem', textTransform: 'uppercase' }}>
          Personalized Wellness
        </div>
      </header>

      <div className="card" style={{ padding: '2rem', borderRadius: '1.5rem', background: 'white', boxShadow: 'var(--shadow-lg)' }}>
        <h2 style={{ marginBottom: '1.5rem' }}>{isSignUp ? 'Create Account' : 'Welcome Back'}</h2>
        
        {message && (
          <div style={{ padding: '1rem', backgroundColor: '#dcfce7', color: '#166534', borderRadius: '0.5rem', marginBottom: '1rem', fontSize: '0.9rem' }}>
            {message}
          </div>
        )}

        {error && (
          <div style={{ padding: '1rem', backgroundColor: '#fee2e2', color: '#991b1b', borderRadius: '0.5rem', marginBottom: '1rem', fontSize: '0.9rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {isSignUp && (
            <div className="input-group">
              <input
                type="text"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required={isSignUp}
                style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}
              />
            </div>
          )}
          
          <div className="input-group">
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}
            />
          </div>

          <button 
            type="submit" 
            className="btn" 
            disabled={loading}
            style={{ marginTop: '1rem', width: '100%' }}
          >
            {loading ? 'Processing...' : isSignUp ? 'Sign Up' : 'Sign In'}
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', fontSize: '0.9rem', color: '#64748b' }}>
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button 
            onClick={() => setIsSignUp(!isSignUp)}
            style={{ background: 'none', border: 'none', color: 'var(--primary-green)', fontWeight: 'bold', cursor: 'pointer', padding: 0 }}
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </div>
      </div>
      
      <div style={{ marginTop: '3rem', opacity: 0.6 }}>
        <EvaIcon name="shield-outline" width={24} height={24} fill="#64748b" />
        <p style={{ fontSize: '0.75rem', marginTop: '0.5rem' }}>Secure Health Data Storage</p>
      </div>
    </div>
  );
};

export default Auth;
