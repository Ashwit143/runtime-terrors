import React from 'react';
import { Cpu, Menu } from 'lucide-react';

interface HeaderProps {
  onNavigateToSection: (sectionId: string) => void;
  onOpenAuth: (mode: 'login' | 'signup') => void;
  onToggleMobileSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onNavigateToSection,
  onOpenAuth,
  onToggleMobileSidebar,
}) => {
  return (
    <header className="app-top-header">
      <div className="top-header-inner">
        {/* Left: Brand / Logo + Mobile Toggle */}
        <div className="top-header-left">
          <button
            className="mobile-menu-toggle"
            onClick={onToggleMobileSidebar}
            aria-label="Toggle navigation menu"
          >
            <Menu size={18} />
          </button>

          <div
            className="top-header-brand"
            onClick={() => onNavigateToSection('hero')}
            role="button"
            tabIndex={0}
          >
            <div className="brand-logo-icon" style={{ width: '28px', height: '28px' }}>
              <Cpu size={15} />
            </div>
            <div className="brand-title" style={{ fontSize: '15.5px' }}>
              CircularMatch AI
              <span className="brand-badge">IIC 3.0</span>
            </div>
          </div>
        </div>

        {/* Right: Informational Links & Demo Auth Actions */}
        <div className="top-header-right">
          <nav className="top-header-links">
            <button
              className="top-nav-link"
              onClick={() => onNavigateToSection('about')}
            >
              About Us
            </button>

            <button
              className="top-nav-link"
              onClick={() => onNavigateToSection('faqs')}
            >
              FAQs
            </button>

            <button
              className="top-nav-link"
              onClick={() => onNavigateToSection('contact')}
            >
              Contact Us
            </button>
          </nav>

          <div className="top-header-auth">
            <button
              className="btn-secondary auth-nav-btn"
              onClick={() => onOpenAuth('login')}
            >
              Log In
            </button>

            <button
              className="btn-primary auth-nav-btn"
              onClick={() => onOpenAuth('signup')}
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
