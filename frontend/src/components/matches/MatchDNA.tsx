import React from 'react';
import { MatchScoreResult, FactorBreakdown } from '../../types/index.js';
import { ShieldCheck, Cpu } from 'lucide-react';

interface MatchDNAProps {
  scoreResult: MatchScoreResult;
}

export const MatchDNA: React.FC<MatchDNAProps> = ({ scoreResult }) => {
  const { factors, overallScore } = scoreResult;

  return (
    <div className="match-dna-container">
      <div className="dna-header">
        <div className="dna-title">
          <Cpu size={16} color="var(--color-primary)" />
          Match DNA — Explainable 5-Factor Scoring Breakdown
        </div>
        <div className="engine-status-indicator" style={{ fontSize: '11px', background: '#FFFFFF', borderColor: 'var(--border-default)', color: 'var(--text-secondary)' }}>
          <ShieldCheck size={14} color="var(--color-primary)" />
          100% Deterministic & Mathematically Auditable
        </div>
      </div>

      <div className="factor-grid">
        {factors.map((factor: FactorBreakdown) => {
          const scorePercent = Math.max(0, Math.min(100, factor.rawScore));
          const weightPercent = Math.round(factor.weight * 100);

          return (
            <div key={factor.key} className="factor-row">
              <div className="factor-top">
                <div className="factor-name">{factor.name}</div>
                <div className="factor-stats-group">
                  <div className="factor-stat">
                    Score: <span>{factor.rawScore.toFixed(0)}</span>
                  </div>
                  <div className="factor-stat">
                    Weight: <span>{weightPercent}%</span>
                  </div>
                  <div className="factor-stat contribution">
                    Contribution: <span>+{factor.contribution.toFixed(1)} pts</span>
                  </div>
                </div>
              </div>

              {/* Progress Meter */}
              <div className="factor-bar-bg">
                <div
                  className="factor-bar-fill"
                  style={{
                    width: `${scorePercent}%`,
                    backgroundColor:
                      factor.rawScore >= 70
                        ? 'var(--color-secondary)'
                        : factor.rawScore >= 40
                        ? 'var(--score-moderate)'
                        : 'var(--score-low)',
                  }}
                />
              </div>

              {/* Plain-English rationale */}
              <div className="factor-explanation">
                {factor.explanation}
              </div>
            </div>
          );
        })}
      </div>

      {/* Mathematical Aggregation Summary Box */}
      <div className="math-summary-box">
        <div className="math-title">Weighted Mathematical Sum Verification</div>
        <div className="math-lines">
          {factors.map(f => (
            <div key={f.key} style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 0' }}>
              <span>
                {Math.round(f.weight * 100)}% × {f.rawScore.toFixed(0)} ({f.name})
              </span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>= {f.contribution.toFixed(1)} pts</span>
            </div>
          ))}
          <div className="math-divider" />
          <div className="math-total-line">
            <span>Overall Calculated Match Score</span>
            <span className="score-val">{overallScore.toFixed(1)} / 100</span>
          </div>
        </div>
      </div>
    </div>
  );
};
