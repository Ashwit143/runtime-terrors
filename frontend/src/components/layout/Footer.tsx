import React from 'react';
import { Cpu } from 'lucide-react';

interface FooterProps {
  onNavigateTab: (tab: 'OVERVIEW' | 'MATCHES' | 'LISTING' | 'IMPACT' | 'POOL') => void;
  onNavigateSection: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigateTab,
  onNavigateSection,
}) => {
  return (
    <footer className="global-app-footer">
      <div className="footer-top-grid">
        {/* Brand Column */}
        <div className="footer-brand-col">
          <div className="footer-brand-title">
            <div className="brand-logo-icon" style={{ width: '26px', height: '26px', background: '#33322E' }}>
              <Cpu size={14} color="var(--brand-gold-light)" />
            </div>
            <span>CircularMatch AI</span>
          </div>
          <p className="footer-brand-desc">
            Deterministic, 100% explainable industrial waste-exchange matching platform for the circular economy.
          </p>
          <div className="footer-demo-tag">
            IIC 3.0 Open Innovation Prototype
          </div>
        </div>

        {/* Product Links */}
        <div className="footer-links-col">
          <div className="footer-col-header">Product</div>
          <ul className="footer-links-list">
            <li>
              <button onClick={() => onNavigateTab('LISTING')}>Create Listing</button>
            </li>
            <li>
              <button onClick={() => onNavigateTab('MATCHES')}>Ranked Matches</button>
            </li>
            <li>
              <button onClick={() => onNavigateTab('IMPACT')}>Impact Dashboard</button>
            </li>
            <li>
              <button onClick={() => onNavigateTab('POOL')}>Enterprise Directory</button>
            </li>
          </ul>
        </div>

        {/* Company Links */}
        <div className="footer-links-col">
          <div className="footer-col-header">Platform</div>
          <ul className="footer-links-list">
            <li>
              <button onClick={() => onNavigateSection('about')}>About Us</button>
            </li>
            <li>
              <button onClick={() => onNavigateSection('faqs')}>FAQs</button>
            </li>
            <li>
              <button onClick={() => onNavigateSection('contact')}>Contact Us</button>
            </li>
          </ul>
        </div>
      </div>

      {/* Footer Bottom Bar */}
      <div className="footer-bottom-bar">
        <div>© 2026 CircularMatch AI. Built for hackathon demonstration.</div>
        <div>All seed industrial exchange data is synthetic.</div>
      </div>
    </footer>
  );
};
