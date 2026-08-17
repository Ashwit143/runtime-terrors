import React from 'react';
import { DEMO_SCENARIOS } from '../../data/presetScenarios.js';
import { DemoScenario } from '../../types/index.js';
import { ShieldCheck, Cpu, PlayCircle, RefreshCw } from 'lucide-react';

interface HeaderProps {
  selectedScenarioId: string;
  onSelectScenario: (scenario: DemoScenario) => void;
  onResetData: () => void;
  isResetting?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  selectedScenarioId,
  onSelectScenario,
  onResetData,
  isResetting = false,
}) => {
  return (
    <header className="app-header">
      <div className="header-inner">
        {/* Brand */}
        <div className="brand-section">
          <div className="brand-logo-icon">
            <Cpu size={18} />
          </div>
          <div className="brand-title-wrap">
            <div className="brand-title">
              CircularMatch AI
              <span className="brand-badge">IIC 3.0 Demo</span>
            </div>
            <div className="brand-subtitle">
              Explainable Industrial Waste-Exchange Platform
            </div>
          </div>
        </div>

        {/* Right side controls */}
        <div className="header-actions">
          {/* Subtle Judge Demo Scenario Selector */}
          <div className="scenario-selector-wrap">
            <span className="scenario-label">Judge Scenario:</span>
            <select
              className="scenario-select"
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

          {/* Engine Status */}
          <div className="engine-status-indicator" title="5-Factor Deterministic Algorithm: 35% Mat, 25% Trans, 15% Qty, 15% Qlty, 10% Freq">
            <span className="status-dot" />
            <span>5-Factor Engine Active</span>
          </div>

          {/* Reset DB Button */}
          <button
            className="btn-secondary"
            onClick={onResetData}
            disabled={isResetting}
            style={{ fontSize: '11px', padding: '5px 10px' }}
            title="Reset to default Indian industrial seed data"
          >
            <RefreshCw size={12} className={isResetting ? 'spin' : ''} />
            {isResetting ? 'Resetting...' : 'Reset Data'}
          </button>
        </div>
      </div>
    </header>
  );
};
