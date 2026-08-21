import React from 'react';
import { Menu } from 'lucide-react';

interface HeaderProps {
  activeTab?: string;
  onNavigateTab: (tab: string) => void;
  onOpenAuth: (mode: 'login' | 'signup') => void;
  onToggleMobileSidebar: () => void;
}

const marketingLinks = [
  { id: 'ABOUT', label: 'About Us' },
  { id: 'FAQS', label: 'FAQs' },
  { id: 'CONTACT', label: 'Contact Us' },
] as const;

export function Header({
  activeTab,
  onNavigateTab,
  onOpenAuth,
  onToggleMobileSidebar,
}: HeaderProps) {
  return (
    <header className="top-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={onToggleMobileSidebar}
          aria-label="Open navigation"
          style={{
            display: 'none',
            padding: '0.375rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border)',
            background: 'var(--surface)',
            color: 'var(--muted-foreground)',
          }}
          className="mobile-nav-toggle"
        >
          <Menu size={18} />
        </button>

        {/* Brand Logo & Title */}
        <button
          type="button"
          onClick={() => onNavigateTab('OVERVIEW')}
          className="top-header-brand"
          style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
        >
          <span className="brand-badge">
            W<span style={{ color: 'var(--primary)' }}>2</span>
          </span>
          <span>
            Waste<span style={{ color: 'var(--primary)' }}> 2 </span>Worth
          </span>
        </button>
      </div>

      {/* Center / Right Marketing Navigation Links */}
      <nav className="top-header-nav" aria-label="Company">
        {marketingLinks.map((link) => (
          <button
            key={link.id}
            type="button"
            onClick={() => onNavigateTab(link.id)}
            className={`top-nav-link ${activeTab === link.id ? 'active' : ''}`}
          >
            {link.label}
          </button>
        ))}
      </nav>

      {/* Demo Auth Action Buttons */}
      <div className="top-header-actions">
        <button
          type="button"
          onClick={() => onOpenAuth('login')}
          className="btn-header-login"
        >
          Log In
        </button>
        <button
          type="button"
          onClick={() => onOpenAuth('signup')}
          className="btn-header-signup"
        >
          Sign Up
        </button>
      </div>
    </header>
  );
}
