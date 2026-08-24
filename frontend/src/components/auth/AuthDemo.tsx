import React, { useState } from 'react';
import { ArrowLeft, Shield } from 'lucide-react';

interface AuthDemoProps {
  mode: 'login' | 'signup';
  onBack: () => void;
  onEnterWorkspace: () => void;
}

export function AuthDemo({ mode, onBack, onEnterWorkspace }: AuthDemoProps) {
  const [currentMode, setCurrentMode] = useState<'login' | 'signup'>(mode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [company, setCompany] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onEnterWorkspace();
  };

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        minHeight: 'calc(100vh - 3.5rem)',
        backgroundColor: 'var(--background)',
      }}
    >
      {/* Left Dark Industrial Graphic Column */}
      <div
        className="grid-industrial"
        style={{
          backgroundColor: 'var(--navy)',
          color: 'var(--navy-foreground)',
          padding: '3.5rem 2.5rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <button
          type="button"
          onClick={onBack}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'none',
            border: 'none',
            color: 'rgba(247, 248, 245, 0.75)',
            fontSize: '0.8125rem',
            cursor: 'pointer',
            alignSelf: 'flex-start',
          }}
        >
          <ArrowLeft size={16} /> Return to Platform
        </button>

        <div style={{ maxWidth: '24rem', margin: '2rem 0' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <img
              src="/logo-white.png"
              alt="Waste 2 Worth Logo"
              style={{
                height: '44px',
                width: 'auto',
                maxWidth: '100%',
                objectFit: 'contain',
                display: 'inline-block',
              }}
            />
          </div>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.75rem',
              fontWeight: 700,
              lineHeight: 1.25,
              color: 'var(--navy-foreground)',
            }}
          >
            Transparent matching for industrial by-products.
          </h2>
          <p style={{ marginTop: '1rem', fontSize: '0.875rem', lineHeight: 1.6, color: 'rgba(247, 248, 245, 0.7)' }}>
            Five weighted factors, two hard compliance gates, one auditable score.
          </p>
        </div>

        <div style={{ fontSize: '0.75rem', color: 'rgba(247, 248, 245, 0.5)' }}>
          Waste 2 Worth — Industrial Circularity Prototype
        </div>
      </div>

      {/* Right Form Column */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2.5rem 1.5rem',
        }}
      >
        <div style={{ maxWidth: '24rem', width: '100%' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--navy)' }}>
            {currentMode === 'login' ? 'Demo Log In' : 'Demo Create Account'}
          </h1>
          <p style={{ fontSize: '0.8125rem', color: 'var(--muted-foreground)', marginTop: '0.25rem' }}>
            Demo access — any credentials open the workspace.
          </p>

          <form onSubmit={handleSubmit} style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {currentMode === 'signup' && (
              <div className="form-field">
                <label className="label-caps" style={{ marginBottom: '0.375rem' }}>Enterprise / Plant Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Deccan Alloys Ltd."
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                />
              </div>
            )}

            <div className="form-field">
              <label className="label-caps" style={{ marginBottom: '0.375rem' }}>Work Email</label>
              <input
                type="email"
                required
                className="form-input"
                placeholder="ops@plant.example"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-field">
              <label className="label-caps" style={{ marginBottom: '0.375rem' }}>Password</label>
              <input
                type="password"
                required
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              style={{
                marginTop: '0.5rem',
                backgroundColor: 'var(--primary)',
                color: 'var(--primary-foreground)',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                padding: '0.6875rem',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'background-color 0.15s ease',
              }}
            >
              {currentMode === 'login' ? 'Enter Demo Workspace' : 'Create Demo Account'}
            </button>
          </form>

          {/* Prototype Notice Box */}
          <div
            style={{
              marginTop: '1.5rem',
              padding: '0.75rem',
              backgroundColor: 'var(--surface-2)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.75rem',
              color: 'var(--muted-foreground)',
              lineHeight: 1.4,
              display: 'flex',
              gap: '0.5rem',
            }}
          >
            <Shield size={16} style={{ color: 'var(--brand-blue)', flexShrink: 0, marginTop: '0.125rem' }} />
            <div>
              <strong>Prototype Note:</strong> This is a demonstration interface. Authentication backend will be introduced in future releases.
            </div>
          </div>

          <div style={{ marginTop: '1.25rem', fontSize: '0.75rem', color: 'var(--muted-foreground)', textAlign: 'center' }}>
            {currentMode === 'login' ? (
              <>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setCurrentMode('signup')}
                  style={{ color: 'var(--brand-blue)', background: 'none', border: 'none', fontWeight: 600, cursor: 'pointer' }}
                >
                  Create one
                </button>
              </>
            ) : (
              <>
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => setCurrentMode('login')}
                  style={{ color: 'var(--brand-blue)', background: 'none', border: 'none', fontWeight: 600, cursor: 'pointer' }}
                >
                  Log in
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
