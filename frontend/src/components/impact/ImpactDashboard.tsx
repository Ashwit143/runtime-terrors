import React from 'react';
import { ImpactSummary, MatchRecord } from '../../types/index.js';
import {
  Recycle,
  IndianRupee,
  Leaf,
  Trash2,
  CheckCircle2,
} from 'lucide-react';

interface ImpactDashboardProps {
  summary: ImpactSummary;
  selectedMatches: MatchRecord[];
}

export const ImpactDashboard: React.FC<ImpactDashboardProps> = ({
  summary,
  selectedMatches,
}) => {
  // If user selected custom matches from the list, calculate dynamic combined impact
  const hasSelected = selectedMatches.length > 0;

  const currentImpact = hasSelected
    ? {
        totalMatchesCount: selectedMatches.length,
        totalWasteDivertedTonnes: Number(
          selectedMatches.reduce((s, m) => s + m.impact.wasteDivertedTonnes, 0).toFixed(1)
        ),
        totalCostSavedINR: selectedMatches.reduce((s, m) => s + m.impact.estimatedCostSavedINR, 0),
        totalCo2AvoidedTons: Number(
          selectedMatches.reduce((s, m) => s + m.impact.co2AvoidedTons, 0).toFixed(2)
        ),
        totalLandfillDivertedTonnes: Number(
          selectedMatches.reduce((s, m) => s + m.impact.landfillDivertedTonnes, 0).toFixed(1)
        ),
      }
    : summary;

  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div>
      <div className="section-header">
        <div>
          <h2 className="section-title">
            {hasSelected ? 'Custom Selected Match Impact' : 'Industrial Circularity Impact'}
          </h2>
          <div className="section-subtitle">
            {hasSelected
              ? `Real-time quantified metrics for ${selectedMatches.length} selected circular exchange streams.`
              : `Aggregated ecological and economic value generated across all verified high-compatibility matches (≥ 70).`}
          </div>
        </div>
        {hasSelected && (
          <div className="engine-status-indicator" style={{ background: '#FFFFFF', borderColor: 'var(--brand-gold-border)', color: 'var(--brand-gold-dark)' }}>
            <CheckCircle2 size={13} color="var(--brand-gold-dark)" /> {selectedMatches.length} Active Streams Selected
          </div>
        )}
      </div>

      {/* 4 Core Impact Cards */}
      <div className="impact-grid">
        {/* Stat 1: Waste Diverted */}
        <div className="impact-stat-card">
          <div className="impact-card-top">
            <span className="impact-label">Waste Diverted</span>
            <div className="impact-icon-wrap" style={{ color: 'var(--brand-gold-dark)' }}>
              <Recycle size={18} />
            </div>
          </div>
          <div>
            <div className="impact-value">
              {currentImpact.totalWasteDivertedTonnes.toLocaleString('en-IN')}
              <span className="impact-unit">Tonnes / mo</span>
            </div>
            <div className="impact-subtext">
              Direct secondary raw material re-entry into industrial supply chains.
            </div>
          </div>
        </div>

        {/* Stat 2: Estimated Cost Saved */}
        <div className="impact-stat-card">
          <div className="impact-card-top">
            <span className="impact-label">Estimated Cost Saved</span>
            <div className="impact-icon-wrap" style={{ color: 'var(--brand-gold-dark)' }}>
              <IndianRupee size={18} />
            </div>
          </div>
          <div>
            <div className="impact-value" style={{ fontSize: '24px', color: 'var(--brand-gold-dark)' }}>
              {formatINR(currentImpact.totalCostSavedINR)}
            </div>
            <div className="impact-subtext">
              Procurement & landfill tipping savings vs virgin raw materials.
            </div>
          </div>
        </div>

        {/* Stat 3: CO2 Avoided */}
        <div className="impact-stat-card">
          <div className="impact-card-top">
            <span className="impact-label">CO₂ Emissions Avoided</span>
            <div className="impact-icon-wrap" style={{ color: 'var(--score-high)' }}>
              <Leaf size={18} />
            </div>
          </div>
          <div>
            <div className="impact-value" style={{ color: 'var(--score-high)' }}>
              {currentImpact.totalCo2AvoidedTons.toLocaleString('en-IN')}
              <span className="impact-unit">tCO₂e</span>
            </div>
            <div className="impact-subtext">
              Avoided virgin manufacturing & extraction lifecycle carbon.
            </div>
          </div>
        </div>

        {/* Stat 4: Landfill Impact Avoided */}
        <div className="impact-stat-card">
          <div className="impact-card-top">
            <span className="impact-label">Landfill Diverted</span>
            <div className="impact-icon-wrap" style={{ color: 'var(--brand-gold-dark)' }}>
              <Trash2 size={18} />
            </div>
          </div>
          <div>
            <div className="impact-value">
              {currentImpact.totalLandfillDivertedTonnes.toLocaleString('en-IN')}
              <span className="impact-unit">Tonnes</span>
            </div>
            <div className="impact-subtext">
              92% direct diversion from municipal and industrial dump sites.
            </div>
          </div>
        </div>
      </div>

      {/* Selected Match Details if any */}
      {hasSelected && (
        <div style={{ marginTop: '24px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '12px', color: 'var(--text-primary)' }}>
            Contributing Circular Streams in this Calculation:
          </h3>
          <div style={{ display: 'grid', gap: '10px' }}>
            {selectedMatches.map(m => (
              <div
                key={m.matchId}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid var(--border-default)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '14px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  boxShadow: 'var(--shadow-card)',
                }}
              >
                <div>
                  <strong style={{ color: 'var(--text-primary)' }}>{m.supplier.companyName}</strong> ({m.supplier.city})
                  {' '}
                  <span style={{ color: 'var(--brand-gold-dark)' }}>➔</span>
                  {' '}
                  <strong style={{ color: 'var(--text-primary)' }}>{m.receiver.companyName}</strong> ({m.receiver.city})
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    {m.supplier.materialName} — {m.impact.wasteDivertedTonnes} tonnes/mo
                  </div>
                </div>
                <div style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>
                  <div style={{ color: 'var(--score-high)', fontWeight: 600 }}>+{m.impact.co2AvoidedTons} tCO₂e</div>
                  <div style={{ color: 'var(--brand-gold-dark)', fontWeight: 600 }}>{formatINR(m.impact.estimatedCostSavedINR)} saved</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
