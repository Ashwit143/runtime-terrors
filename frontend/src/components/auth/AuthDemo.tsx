import React from 'react';
import { Lock, ArrowLeft, ShieldCheck, Sparkles } from 'lucide-react';

interface AuthDemoProps {
  onBack: () => void;
  mode?: 'login' | 'signup';
}

export const AuthDemo: React.FC<AuthDemoProps> = ({ onBack, mode = 'login' }) => {
  return (
    <div className="auth-demo-container">
      <div className="auth-demo-card">
        <div className="auth-demo-icon">
          <Lock size={26} color="var(--brand-gold-dark)" />
        </div>

        <div className="auth-demo-badge">
          <Sparkles size={12} color="var(--brand-gold-dark)" />
          <span>Prototype Architecture</span>
        </div>

        <h1 className="auth-demo-title">
          This is just a demo
        </h1>

        <p className="auth-demo-subtitle">
          Login and sign up will be added in the future.
        </p>

        <div className="auth-demo-box">
          <div className="auth-demo-box-title">
            <ShieldCheck size={15} color="var(--score-high)" />
            Open Prototype Mode Active
          </div>
          <p className="auth-demo-box-desc">
            For the <strong>IIC 3.0 Open Innovation Hackathon</strong>, all features — including waste listing registration, 2-gate 5-factor matching engine simulation, Match DNA inspection, and impact analytics — are unlocked for immediate evaluation.
          </p>
        </div>

        <div className="auth-demo-actions">
          <button
            className="btn-primary"
            onClick={onBack}
            style={{ width: '100%', padding: '11px 20px', fontSize: '13.5px' }}
          >
            <ArrowLeft size={15} />
            Return to Platform Demo
          </button>
        </div>
      </div>
    </div>
  );
};
