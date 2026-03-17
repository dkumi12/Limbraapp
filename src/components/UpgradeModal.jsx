import React from 'react';
import EvaIcon from './EvaIcon';

const UpgradeModal = ({ onClose }) => {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1100,
        padding: '1rem',
        backdropFilter: 'blur(4px)',
      }}
    >
      <div
        style={{
          background: 'white',
          borderRadius: '1.5rem',
          width: '100%',
          maxWidth: '400px',
          overflow: 'hidden',
          boxShadow:
            '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        }}
      >
        <div
          style={{
            background: 'var(--primary-green)',
            padding: '2rem 1.5rem',
            textAlign: 'center',
            color: 'white',
            position: 'relative',
          }}
        >
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            <EvaIcon name="close-outline" width={24} height={24} fill="white" />
          </button>
          <div
            style={{
              background: 'rgba(255,255,255,0.2)',
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
            }}
          >
            <EvaIcon name="star" width={32} height={32} fill="white" />
          </div>
          <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>
            Limbra Pro
          </h2>
          <p style={{ margin: '0.5rem 0 0', opacity: 0.9 }}>
            Unlock unlimited AI wellness routines
          </p>
        </div>

        <div style={{ padding: '1.5rem' }}>
          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.5rem' }}>
            {[
              'Unlimited AI routine generations',
              'Advanced targeted injury recovery',
              'Save unlimited routines to library',
              'Premium stretching animations',
            ].map((feature, i) => (
              <li
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  marginBottom: '0.75rem',
                  color: '#334155',
                }}
              >
                <EvaIcon
                  name="checkmark-circle-2"
                  width={20}
                  height={20}
                  fill="var(--primary-green)"
                />
                {feature}
              </li>
            ))}
          </ul>

          <div
            style={{
              border: '2px solid var(--primary-green)',
              borderRadius: '1rem',
              padding: '1rem',
              marginBottom: '1.5rem',
              cursor: 'pointer',
              background: '#f0fdf4',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <h3 style={{ margin: 0, color: '#166534', fontSize: '1.1rem' }}>
                  Monthly Plan
                </h3>
                <p
                  style={{
                    margin: 0,
                    color: '#166534',
                    opacity: 0.8,
                    fontSize: '0.85rem',
                  }}
                >
                  Cancel anytime
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: 'bold',
                    color: '#166534',
                  }}
                >
                  $4.99
                </div>
                <div
                  style={{
                    fontSize: '0.75rem',
                    color: '#166534',
                    opacity: 0.8,
                  }}
                >
                  /month
                </div>
              </div>
            </div>
          </div>

          <button
            className="btn"
            style={{ width: '100%', marginBottom: '0.75rem' }}
            onClick={() =>
              alert('Payment integration (e.g. Stripe) would open here!')
            }
          >
            Upgrade Now
          </button>
          <button
            className="btn btn-secondary"
            style={{ width: '100%', border: 'none', background: 'transparent' }}
            onClick={onClose}
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpgradeModal;
