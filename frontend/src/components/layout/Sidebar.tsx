import React from 'react';
import {
  LayoutDashboard,
  GitCompareArrows,
  FilePlus2,
  BarChart3,
  Building2,
  Info,
  HelpCircle,
  Mail,
  X,
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  matchesCount?: number;
  listingsCount?: number;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean | 'true' | 'false' }>;
  showBadge?: 'matches' | 'listings';
}

const navItems: NavItem[] = [
  { id: 'OVERVIEW', label: 'Overview', icon: LayoutDashboard },
  { id: 'MATCHES', label: 'Ranked Matches', icon: GitCompareArrows, showBadge: 'matches' },
  { id: 'LISTING', label: 'Create Listing', icon: FilePlus2 },
  { id: 'IMPACT', label: 'Impact Dashboard', icon: BarChart3 },
  { id: 'DIRECTORY', label: 'Enterprise Directory', icon: Building2, showBadge: 'listings' },
];

const infoItems = [
  { id: 'ABOUT', label: 'About Us', icon: Info },
  { id: 'FAQS', label: 'FAQs', icon: HelpCircle },
  { id: 'CONTACT', label: 'Contact Us', icon: Mail },
] as const;

export function Sidebar({
  activeTab,
  onSelectTab,
  matchesCount = 0,
  listingsCount = 0,
  isOpenMobile,
  onCloseMobile,
}: SidebarProps) {
  const handleNav = (tabId: string) => {
    onSelectTab(tabId);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="sidebar-overlay"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      <aside className={`sidebar ${isOpenMobile ? 'open' : ''}`}>
        {/* Sidebar Brand Header */}
        <div className="sidebar-header">
          <div className="sidebar-brand" style={{ width: '100%' }}>
            <img
              src="/logo-white.png"
              alt="Waste 2 Worth Logo"
              style={{
                height: '38px',
                width: 'auto',
                maxWidth: '100%',
                objectFit: 'contain',
                display: 'block',
              }}
            />
          </div>

          {isOpenMobile && (
            <button
              type="button"
              onClick={onCloseMobile}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'rgba(247, 248, 245, 0.7)',
                padding: '0.25rem',
              }}
              aria-label="Close sidebar"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Workspace Navigation */}
        <div className="sidebar-section-title">Workspace</div>
        <nav className="sidebar-nav" aria-label="Product">
          {navItems.map(({ id, label, icon: Icon, showBadge }) => {
            const isActive = activeTab === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => handleNav(id)}
                className={`sidebar-nav-btn ${isActive ? 'active' : ''}`}
              >
                <Icon className="nav-icon" aria-hidden="true" />
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {label}
                </span>
                {showBadge === 'matches' && matchesCount > 0 && (
                  <span className="sidebar-nav-badge">{matchesCount}</span>
                )}
                {showBadge === 'listings' && listingsCount > 0 && (
                  <span className="sidebar-nav-badge">{listingsCount}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Company & Support Navigation */}
        <div className="sidebar-section-title">Company</div>
        <nav className="sidebar-nav" aria-label="Company">
          {infoItems.map(({ id, label, icon: Icon }) => {
            const isActive = activeTab === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => handleNav(id)}
                className={`sidebar-nav-btn ${isActive ? 'active' : ''}`}
              >
                <Icon className="nav-icon" aria-hidden="true" />
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {label}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Subtle Prototype Footnote */}
        <div className="sidebar-footer">
          <div className="sidebar-prototype-card">
            <div className="sidebar-prototype-tag">Enterprise Exchange</div>
            <div className="sidebar-prototype-text">
              Deterministic 5-factor scoring model for verified industrial by-product streams.
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
