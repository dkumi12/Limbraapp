import React, { useState } from 'react';
import { supabase } from '../services/supabase';
import EvaIcon from './EvaIcon';

const Auth = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [authState, setAuthState] = useState('signIn'); // 'signIn', 'signUp', 'forgotPassword'
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleAuth = async e => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (authState === 'signUp') {
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
      } else if (authState === 'signIn') {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      } else if (authState === 'forgotPassword') {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: window.location.origin,
        });
        if (error) throw error;
        setMessage('Password reset link has been sent to your email.');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendConfirmation = async () => {
    if (!email) {
      setError('Please enter your email address first.');
      return;
    }
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });
      if (error) throw error;
      setMessage('Confirmation email has been resent!');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <div className="main-container" style={{ paddingBottom: '3rem' }}>
        <header
          className="header"
          style={{
            textAlign: 'center',
            marginTop: '1.5rem',
            marginBottom: '2rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              fontWeight: 'bold',
              fontSize: '2.5rem',
              letterSpacing: '0.04em',
              color: 'var(--primary-green)',
              lineHeight: 1,
            }}
          >
            LIMBRA
          </div>
          <div
            style={{
              fontSize: '0.75rem',
              color: '#b0b8c9',
              marginTop: '0.5rem',
              fontWeight: 500,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            BY EVERBOOMING HEALTH & WELLNESS&reg;
          </div>
        </header>

        <div
          className="auth-card"
          style={{
            background: 'white',
            borderRadius: '1.5rem',
            padding: '2rem 1.5rem',
            boxShadow:
              '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            border: '1px solid #f1f5f9',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2
              style={{
                fontSize: '1.5rem',
                fontWeight: 700,
                color: '#1e293b',
                marginBottom: '0.5rem',
              }}
            >
              {authState === 'signUp'
                ? 'Create your account'
                : authState === 'signIn'
                  ? 'Welcome back'
                  : 'Reset Password'}
            </h2>
            <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
              {authState === 'signUp'
                ? 'Join Limbra to start your personalized wellness journey'
                : authState === 'signIn'
                  ? 'Sign in to access your personalized routines'
                  : 'Enter your email to receive a password reset link'}
            </p>
          </div>

          {message && (
            <div
              style={{
                padding: '1rem',
                backgroundColor: '#f0fdf4',
                color: '#166534',
                borderRadius: '0.75rem',
                marginBottom: '1.5rem',
                fontSize: '0.875rem',
                border: '1px solid #bbf7d0',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <EvaIcon
                name="checkmark-circle-outline"
                width={20}
                height={20}
                fill="#166534"
              />
              {message}
            </div>
          )}

          {error && (
            <div
              style={{
                padding: '1rem',
                backgroundColor: '#fef2f2',
                color: '#991b1b',
                borderRadius: '0.75rem',
                marginBottom: '1.5rem',
                fontSize: '0.875rem',
                border: '1px solid #fecaca',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <EvaIcon
                name="alert-circle-outline"
                width={20}
                height={20}
                fill="#991b1b"
              />
              <div style={{ flex: 1 }}>
                {error}
                {error.includes('Email not confirmed') && (
                  <button
                    onClick={handleResendConfirmation}
                    style={{
                      display: 'block',
                      background: 'none',
                      border: 'none',
                      color: 'var(--primary-green)',
                      padding: '4px 0',
                      fontSize: '0.8rem',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      textDecoration: 'underline',
                    }}
                  >
                    Resend confirmation email?
                  </button>
                )}
              </div>
            </div>
          )}

          <form
            onSubmit={handleAuth}
            style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
          >
            {authState === 'signUp' && (
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: '#64748b',
                    marginBottom: '0.5rem',
                    textTransform: 'uppercase',
                  }}
                >
                  Full Name
                </label>
                <div style={{ position: 'relative' }}>
                  <span
                    style={{
                      position: 'absolute',
                      left: '1rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#94a3b8',
                    }}
                  >
                    <EvaIcon
                      name="person-outline"
                      width={20}
                      height={20}
                      fill="currentColor"
                    />
                  </span>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    required={authState === 'signUp'}
                    className="form-input"
                    style={{ paddingLeft: '2.75rem' }}
                  />
                </div>
              </div>
            )}

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: '#64748b',
                  marginBottom: '0.5rem',
                  textTransform: 'uppercase',
                }}
              >
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <span
                  style={{
                    position: 'absolute',
                    left: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#94a3b8',
                  }}
                >
                  <EvaIcon
                    name="email-outline"
                    width={20}
                    height={20}
                    fill="currentColor"
                  />
                </span>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="form-input"
                  style={{ paddingLeft: '2.75rem' }}
                />
              </div>
            </div>

            {authState !== 'forgotPassword' && (
              <div className="form-group" style={{ marginBottom: 0 }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '0.5rem',
                  }}
                >
                  <label
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: '#64748b',
                      textTransform: 'uppercase',
                    }}
                  >
                    Password
                  </label>
                  {authState === 'signIn' && (
                    <button
                      type="button"
                      onClick={() => setAuthState('forgotPassword')}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--primary-green)',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div style={{ position: 'relative' }}>
                  <span
                    style={{
                      position: 'absolute',
                      left: '1rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#94a3b8',
                    }}
                  >
                    <EvaIcon
                      name="lock-outline"
                      width={20}
                      height={20}
                      fill="currentColor"
                    />
                  </span>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    className="form-input"
                    style={{ paddingLeft: '2.75rem' }}
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              className="btn"
              disabled={loading}
              style={{
                marginTop: '1rem',
                height: '3.5rem',
                borderRadius: '1rem',
                fontSize: '1rem',
                boxShadow: '0 4px 6px -1px rgba(34, 197, 94, 0.4)',
              }}
            >
              {loading ? (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <div
                    className="spinner-small"
                    style={{
                      width: '20px',
                      height: '20px',
                      border: '2px solid rgba(255,255,255,0.3)',
                      borderTopColor: 'white',
                      borderRadius: '50%',
                      animation: 'spin 0.8s linear infinite',
                    }}
                  />
                  Processing...
                </div>
              ) : authState === 'signUp' ? (
                'Create Account'
              ) : authState === 'signIn' ? (
                'Sign In'
              ) : (
                'Send Reset Link'
              )}
            </button>
          </form>

          <div
            style={{
              marginTop: '2rem',
              textAlign: 'center',
              fontSize: '0.875rem',
              color: '#64748b',
              paddingTop: '1.5rem',
              borderTop: '1px solid #f1f5f9',
            }}
          >
            {authState === 'signUp' ? (
              <>
                Already have an account?{' '}
                <button
                  onClick={() => setAuthState('signIn')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--primary-green)',
                    fontWeight: '700',
                    cursor: 'pointer',
                    padding: '0 0.25rem',
                    textDecoration: 'underline',
                  }}
                >
                  Sign In
                </button>
              </>
            ) : authState === 'signIn' ? (
              <>
                Don't have an account?{' '}
                <button
                  onClick={() => setAuthState('signUp')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--primary-green)',
                    fontWeight: '700',
                    cursor: 'pointer',
                    padding: '0 0.25rem',
                    textDecoration: 'underline',
                  }}
                >
                  Sign Up
                </button>
              </>
            ) : (
              <>
                Back to{' '}
                <button
                  onClick={() => setAuthState('signIn')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--primary-green)',
                    fontWeight: '700',
                    cursor: 'pointer',
                    padding: '0 0.25rem',
                    textDecoration: 'underline',
                  }}
                >
                  Sign In
                </button>
              </>
            )}
          </div>
        </div>

        <div
          style={{
            marginTop: '2.5rem',
            textAlign: 'center',
            color: '#94a3b8',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <EvaIcon
              name="shield-outline"
              width={18}
              height={18}
              fill="currentColor"
            />
            <span style={{ fontSize: '0.75rem', fontWeight: 500 }}>
              End-to-end encrypted health data
            </span>
          </div>
          <p style={{ fontSize: '0.7rem', opacity: 0.7 }}>
            &copy; 2026 Limbra Wellness. All rights reserved.
          </p>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .form-input::placeholder {
          color: #cbd5e1;
        }
      `}</style>
    </div>
  );
};

export default Auth;
