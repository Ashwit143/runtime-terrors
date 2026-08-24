import React from 'react';

interface FooterProps {
  onNavigateTab: (tab: string) => void;
}

const groups = [
  {
    title: 'Platform',
    links: [
      { id: 'MATCHES', label: 'Ranked Matches' },
      { id: 'LISTING', label: 'Create Listing' },
      { id: 'IMPACT', label: 'Impact Dashboard' },
      { id: 'DIRECTORY', label: 'Enterprise Directory' },
    ],
  },
  {
    title: 'Company',
    links: [
      { id: 'ABOUT', label: 'About Us' },
      { id: 'FAQS', label: 'FAQs' },
      { id: 'CONTACT', label: 'Contact Us' },
    ],
  },
] as const;

export function Footer({ onNavigateTab }: FooterProps) {
  return (
    <footer className="global-footer">
      <div className="footer-inner">
        <div>
          <div style={{ marginBottom: '0.875rem' }}>
            <img
              src="/logo-white.png"
              alt="Waste 2 Worth Logo"
              style={{
                height: '38px',
                width: 'auto',
                maxWidth: '100%',
                objectFit: 'contain',
                display: 'inline-block',
              }}
            />
          </div>
          <p style={{ marginTop: '0.5rem', maxWidth: '20rem', fontSize: '0.75rem', lineHeight: 1.5, color: 'rgba(247, 248, 245, 0.65)' }}>
            An industrial waste-exchange matching platform connecting enterprises to exchange, reuse, and create value from industrial by-products.
          </p>
        </div>

        {groups.map((group) => (
          <div key={group.title}>
            <p className="label-caps" style={{ color: 'rgba(247, 248, 245, 0.55)' }}>
              {group.title}
            </p>
            <ul style={{ listStyle: 'none', marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {group.links.map((link) => (
                <li key={link.id}>
                  <button
                    type="button"
                    onClick={() => {
                      onNavigateTab(link.id);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'rgba(247, 248, 245, 0.75)',
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                      padding: 0,
                      textAlign: 'left',
                      transition: 'color 0.15s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--primary)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(247, 248, 245, 0.75)')}
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-inner">
          <p>© {new Date().getFullYear()} Waste 2 Worth — Industrial Circularity Platform</p>
          <p style={{ color: 'rgba(247, 248, 245, 0.45)' }}>B2B By-product Exchange</p>
        </div>
      </div>
    </footer>
  );
}
