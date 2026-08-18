import React from 'react';
import {
  Home,
  Layers,
  PlusCircle,
  BarChart3,
  Building2,
  Cpu,
  RefreshCw,
  X,
} from 'lucide-react';
import { DEMO_SCENARIOS } from '../../data/presetScenarios.js';
import { DemoScenario } from '../../types/index.js';

interface SidebarProps {
  activeTab: 'OVERVIEW' | 'MATCHES' | 'LISTING' | 'IMPACT' | 'POOL';
  onSelectTab: (tab: 'OVERVIEW' | 'MATCHES' | 'LISTING' | 'IMPACT' | 'POOL') => void;
  matchesCount: number;
  listingsCount: number;
  selectedMatchesCount: number;
  selectedScenarioId: string;
  onSelectScenario: (scenario: DemoScenario) => void;
  onResetData: () => void;
  isResetting?: boolean;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  matchesCount,
  listingsCount,
  selectedMatchesCount,
  selectedScenarioId,
  onSelectScenario,
  onResetData,
  isResetting = false,
  isOpenMobile = false,
  onCloseMobile,
}) => {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div className="sidebar-backdrop" onClick={onCloseMobile} />
      )}

      <aside className={`app-sidebar ${isOpenMobile ? 'mobile-open' : ''}`}>
        {/* Sidebar Header / Brand */}
        <div className="sidebar-brand">
          <div className="sidebar-brand-left">
            <div className="brand-logo-icon">
              <Cpu size={18} />
            </div>
            <div className="brand-title-wrap">
              <div className="brand-title" style={{ fontSize: '15px' }}>
                CircularMatch
              </div>
              <div className="brand-subtitle" style={{ fontSize: '10px' }}>
                AI Matching Platform
              </div>
            </div>
          </div>

          {/* Mobile close button */}
          {onCloseMobile && (
            <button className="sidebar-mobile-close" onClick={onCloseMobile}>
              <X size={18} />
            </button>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="sidebar-nav">
          <div className="sidebar-section-title">Navigation</div>

          <button
            className={`sidebar-nav-item ${activeTab === 'OVERVIEW' ? 'active' : ''}`}
            onClick={() => {
              onSelectTab('OVERVIEW');
              if (onCloseMobile) onCloseMobile();
            }}
          >
            <div className="sidebar-nav-item-left">
              <Home size={17} />
              <span>Overview</span>
            </div>
          </button>

          <button
            className={`sidebar-nav-item ${activeTab === 'MATCHES' ? 'active' : ''}`}
            onClick={() => {
              onSelectTab('MATCHES');
              if (onCloseMobile) onCloseMobile();
            }}
          >
            <div className="sidebar-nav-item-left">
              <Layers size={17} />
              <span>Ranked Matches</span>
            </div>
            {matchesCount > 0 && (
              <span className="sidebar-nav-badge">{matchesCount}</span>
            )}
          </button>

          <button
            className={`sidebar-nav-item ${activeTab === 'LISTING' ? 'active' : ''}`}
            onClick={() => {
              onSelectTab('LISTING');
              if (onCloseMobile) onCloseMobile();
            }}
          >
            <div className="sidebar-nav-item-left">
              <PlusCircle size={17} />
              <span>Create Listing</span>
            </div>
          </button>

          <button
            className={`sidebar-nav-item ${activeTab === 'IMPACT' ? 'active' : ''}`}
            onClick={() => {
              onSelectTab('IMPACT');
              if (onCloseMobile) onCloseMobile();
            }}
          >
            <div className="sidebar-nav-item-left">
              <BarChart3 size={17} />
              <span>Impact Dashboard</span>
            </div>
            {selectedMatchesCount > 0 && (
              <span className="sidebar-nav-badge active-badge">{selectedMatchesCount}</span>
            )}
          </button>

          <button
            className={`sidebar-nav-item ${activeTab === 'POOL' ? 'active' : ''}`}
            onClick={() => {
              onSelectTab('POOL');
              if (onCloseMobile) onCloseMobile();
            }}
          >
            <div className="sidebar-nav-item-left">
              <Building2 size={17} />
              <span>Enterprise Directory</span>
            </div>
            {listingsCount > 0 && (
              <span className="sidebar-nav-badge">{listingsCount}</span>
            )}
          </button>
        </nav>

        {/* Sidebar Bottom Controls */}
        <div className="sidebar-footer">
          {/* Judge Scenario Preset Selector */}
          <div className="sidebar-scenario-box">
            <div className="sidebar-scenario-label">Judge Scenario:</div>
            <select
              className="sidebar-scenario-select"
              value={selectedScenarioId}
              onChange={e => {
                const found = DEMO_SCENARIOS.find(s => s.id === e.target.value);
                if (found) onSelectScenario(found);
              }}
            >
              {DEMO_SCENARIOS.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Engine Status Indicator */}
          <div className="sidebar-engine-status">
            <span className="status-dot" />
            <span>5-Factor Engine Active</span>
          </div>

          {/* Reset Seed Data Button */}
          <button
            className="sidebar-reset-btn"
            onClick={onResetData}
            disabled={isResetting}
            title="Reset to default synthetic Indian seed data"
          >
            <RefreshCw size={12} className={isResetting ? 'spin' : ''} />
            <span>{isResetting ? 'Resetting...' : 'Reset Seed Data'}</span>
          </button>
        </div>
      </aside>
    </>
  );
};
