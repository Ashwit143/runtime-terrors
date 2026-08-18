import React, { useState } from 'react';
import { ImpactSummary, MatchRecord } from '../../types/index.js';
import {
  Recycle,
  IndianRupee,
  Leaf,
  Trash2,
  BarChart2,
  PieChart,
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
  const [chartMetric, setChartMetric] = useState<'waste' | 'co2' | 'cost'>('waste');

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

  // Format currency for Indian Lakhs / Crores
  const formatCostLakhs = (val: number) => {
    const lakhs = val / 100000;
    if (lakhs >= 100) {
      return `₹${(lakhs / 100).toFixed(2)} Cr`;
    }
    return `₹${lakhs.toFixed(2)} L`;
  };

  // Category distribution data for the bar graph
  const categoryData = [
    { label: 'Plastics (PET/HDPE)', waste: 70, co2: 84.0, cost: 5.2, color: 'var(--brand-gold)' },
    { label: 'Textiles (Cotton/Synthetics)', waste: 35, co2: 63.0, cost: 3.1, color: 'var(--brand-gold-dark)' },
    { label: 'Metals (Aluminium/Steel)', waste: 70, co2: 126.0, cost: 11.8, color: '#3B82F6' },
    { label: 'Food & Agro Biomass', waste: 200, co2: 44.0, cost: 4.8, color: 'var(--score-high)' },
    { label: 'Chemical Solvents', waste: 27, co2: 18.9, cost: 2.7, color: '#8B5CF6' },
  ];

  const maxVal = Math.max(
    ...categoryData.map(c =>
      chartMetric === 'waste' ? c.waste : chartMetric === 'co2' ? c.co2 : c.cost
    )
  );

  return (
    <div>
      <div className="section-header">
        <div>
          <h2 className="section-title">Circularity Impact Overview</h2>
          <div className="section-subtitle">
            {hasSelected
              ? `Quantified ecological & economic value for ${selectedMatches.length} selected circular streams.`
              : 'Aggregated resource recovery, carbon avoidance, and procurement cost savings.'}
          </div>
        </div>
        {hasSelected && (
          <div className="engine-status-indicator" style={{ background: '#FFFFFF', borderColor: 'var(--brand-gold-border)', color: 'var(--brand-gold-dark)' }}>
            <CheckCircle2 size={13} color="var(--brand-gold-dark)" /> {selectedMatches.length} Streams Selected
          </div>
        )}
      </div>

      {/* 1. PRIMARY VISUALIZATION GRAPH (BAR CHART OVERVIEW) */}
      <div className="impact-chart-card">
        <div className="impact-chart-header">
          <div className="impact-chart-title">
            <BarChart2 size={18} color="var(--brand-gold-dark)" />
            <span>Resource Recovery by Material Stream</span>
          </div>

          <div className="impact-chart-toggles">
            <button
              className={`chart-toggle-btn ${chartMetric === 'waste' ? 'active' : ''}`}
              onClick={() => setChartMetric('waste')}
            >
              Waste Diverted (t)
            </button>
            <button
              className={`chart-toggle-btn ${chartMetric === 'co2' ? 'active' : ''}`}
              onClick={() => setChartMetric('co2')}
            >
              CO₂ Avoided (tCO₂e)
            </button>
            <button
              className={`chart-toggle-btn ${chartMetric === 'cost' ? 'active' : ''}`}
              onClick={() => setChartMetric('cost')}
            >
              Cost Saved (₹ Lakhs)
            </button>
          </div>
        </div>

        {/* Dynamic Horizontal Bar Visualization */}
        <div className="impact-bars-container">
          {categoryData.map((item, idx) => {
            const currentVal =
              chartMetric === 'waste'
                ? item.waste
                : chartMetric === 'co2'
                ? item.co2
                : item.cost;
            const percentage = (currentVal / maxVal) * 100;
            const unitLabel =
              chartMetric === 'waste' ? 'tonnes' : chartMetric === 'co2' ? 'tCO₂e' : '₹ Lakhs';

            return (
              <div key={idx} className="impact-bar-row">
                <div className="impact-bar-info">
                  <span className="impact-bar-label">{item.label}</span>
                  <span className="impact-bar-val">
                    {chartMetric === 'cost' ? `₹${currentVal.toFixed(1)}L` : `${currentVal} ${unitLabel}`}
                  </span>
                </div>
                <div className="impact-bar-track">
                  <div
                    className="impact-bar-progress"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: item.color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. KEY METRICS STATS SUMMARY (CLEAN 3-CARD PRESENTATION) */}
      <div className="impact-summary-stats-grid">
        <div className="impact-summary-stat-box">
          <div className="stat-icon-wrap" style={{ color: 'var(--brand-gold-dark)' }}>
            <Recycle size={20} />
          </div>
          <div className="stat-metric-val">
            {currentImpact.totalWasteDivertedTonnes.toLocaleString('en-IN')}{' '}
            <span className="stat-metric-unit">Tonnes</span>
          </div>
          <div className="stat-metric-label">Total Waste Diverted</div>
          <div className="stat-metric-sub">Monthly circular feedstock recycled</div>
        </div>

        <div className="impact-summary-stat-box">
          <div className="stat-icon-wrap" style={{ color: 'var(--score-high)' }}>
            <Leaf size={20} />
          </div>
          <div className="stat-metric-val" style={{ color: 'var(--score-high)' }}>
            {currentImpact.totalCo2AvoidedTons.toLocaleString('en-IN')}{' '}
            <span className="stat-metric-unit">tCO₂e</span>
          </div>
          <div className="stat-metric-label">CO₂ Emissions Avoided</div>
          <div className="stat-metric-sub">Avoided virgin extraction lifecycle</div>
        </div>

        <div className="impact-summary-stat-box">
          <div className="stat-icon-wrap" style={{ color: 'var(--brand-gold-dark)' }}>
            <IndianRupee size={20} />
          </div>
          <div className="stat-metric-val" style={{ color: 'var(--brand-gold-dark)' }}>
            {formatCostLakhs(currentImpact.totalCostSavedINR)}
          </div>
          <div className="stat-metric-label">Estimated Cost Saved</div>
          <div className="stat-metric-sub">Raw material procurement savings</div>
        </div>
      </div>

      {/* 3. SELECTED STREAM DETAILS (IF USER CHECKED MATCHES) */}
      {hasSelected && (
        <div style={{ marginTop: '28px' }}>
          <h3 style={{ fontSize: '14.5px', fontWeight: 700, marginBottom: '12px', color: 'var(--text-primary)' }}>
            Contributing Exchanges in this Impact Calculation:
          </h3>
          <div style={{ display: 'grid', gap: '8px' }}>
            {selectedMatches.map(m => (
              <div
                key={m.matchId}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid var(--border-default)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  boxShadow: 'var(--shadow-card)',
                }}
              >
                <div>
                  <strong style={{ color: 'var(--text-primary)', fontSize: '13.5px' }}>{m.supplier.companyName}</strong>
                  {' '}
                  <span style={{ color: 'var(--brand-gold-dark)' }}>➔</span>
                  {' '}
                  <strong style={{ color: 'var(--text-primary)', fontSize: '13.5px' }}>{m.receiver.companyName}</strong>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    {m.supplier.materialName} · {m.impact.wasteDivertedTonnes} tonnes/mo
                  </div>
                </div>
                <div style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: '11.5px' }}>
                  <div style={{ color: 'var(--score-high)', fontWeight: 600 }}>+{m.impact.co2AvoidedTons} tCO₂e</div>
                  <div style={{ color: 'var(--brand-gold-dark)', fontWeight: 600 }}>{formatCostLakhs(m.impact.estimatedCostSavedINR)} saved</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
