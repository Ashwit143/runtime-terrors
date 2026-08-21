import React, { useState } from 'react';
import { ArrowRight, ChevronDown, ShieldCheck, AlertTriangle, MapPin } from 'lucide-react';
import { MatchRecord } from '../../types/index.js';

interface MatchCardProps {
  match: MatchRecord;
  rank: number;
  onViewCompanyDetails?: (companyId: string) => void;
}

export function MatchCard({ match, rank, onViewCompanyDetails }: MatchCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  const overallScore = Math.round(match.score.overallScore);
  const isHighMatch = overallScore >= 70;

  // Factor weights in the 100% deterministic model
  const weights: Record<string, number> = {
    materialCompatibility: 35,
    transportFeasibility: 25,
    quantityFit: 15,
    qualityMatch: 15,
    availabilityFrequency: 10,
  };

  const factorLabels: Record<string, string> = {
    materialCompatibility: 'Material Compatibility',
    transportFeasibility: 'Transport Feasibility',
    quantityFit: 'Quantity Fit',
    qualityMatch: 'Quality Match',
    availabilityFrequency: 'Availability Frequency',
  };

  // Extract factors list from backend score result
  const factorsList = match.score.factors && match.score.factors.length > 0
    ? match.score.factors
    : [
        match.score.materialCompatibility,
        match.score.transportFeasibility,
        match.score.quantityFit,
        match.score.qualityMatch,
        match.score.availabilityFrequency,
      ].filter(Boolean);

  return (
    <article className="match-card">
      <div className="match-card-header">
        {/* Score Tile */}
        <div className={`match-score-tile ${isHighMatch ? 'high' : 'medium'}`}>
          <span className="match-score-num">{overallScore}</span>
          <span className="match-score-label">Score</span>
        </div>

        {/* Primary Information */}
        <div className="match-info">
          {/* Top Rank, Material & Hazard Badges */}
          <div className="match-meta-top">
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--navy)' }}>
              #{rank}
            </span>
            <span style={{ width: '1px', height: '12px', backgroundColor: 'var(--border)' }} />
            <span style={{ fontWeight: 600, color: 'var(--navy)' }}>
              {match.supplier.materialName || match.supplier.category}
            </span>
            {match.supplier.isHazardous && (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  padding: '0.125rem 0.375rem',
                  fontSize: '0.6875rem',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--gold-soft)',
                  color: 'var(--gold-foreground)',
                  border: '1px solid rgba(201, 154, 62, 0.4)',
                }}
              >
                <AlertTriangle size={12} /> Hazardous Stream
              </span>
            )}
          </div>

          {/* Explicit Supplier (Has Material) -> Receiver (Needs Material) Relationship */}
          <div className="match-relation">
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
              <span className="match-party-label">Supplier:</span>
              <button
                type="button"
                onClick={() => onViewCompanyDetails && onViewCompanyDetails(match.supplier.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  cursor: onViewCompanyDetails ? 'pointer' : 'default',
                  textAlign: 'left',
                }}
                className="match-party-name"
              >
                {match.supplier.companyName}
              </button>
            </div>

            <ArrowRight size={14} style={{ color: 'var(--brand-blue)', margin: '0 0.125rem' }} />

            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
              <span className="match-party-label">Receiver:</span>
              <button
                type="button"
                onClick={() => onViewCompanyDetails && onViewCompanyDetails(match.receiver.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  cursor: onViewCompanyDetails ? 'pointer' : 'default',
                  textAlign: 'left',
                }}
                className="match-party-name"
              >
                {match.receiver.companyName}
              </button>
            </div>
          </div>

          {/* Route & Quantity summary */}
          <div className="match-route-line">
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
              <MapPin size={12} /> {match.supplier.city} → {match.receiver.city}
            </span>
            <span style={{ margin: '0 0.375rem' }}>·</span>
            <span>
              {match.supplier.quantity} {match.supplier.unit} available
            </span>
          </div>
        </div>

        {/* Why this match? Action Toggle Button */}
        <div>
          <button
            type="button"
            aria-expanded={isOpen}
            onClick={() => setIsOpen(!isOpen)}
            className="btn-why-match"
          >
            Why this match?
            <ChevronDown
              size={14}
              style={{
                transform: isOpen ? 'rotate(180deg)' : 'none',
                transition: 'transform 0.2s ease',
              }}
            />
          </button>
        </div>
      </div>

      {/* Expanded Match DNA Drawer */}
      {isOpen && (
        <div className="match-dna-drawer">
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
            <p className="label-caps" style={{ color: 'var(--navy)' }}>
              Match DNA — Deterministic 5-Factor Score Breakdown
            </p>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>
              <ShieldCheck size={14} style={{ color: 'var(--primary)' }} />
              {match.receiver.isHazmatLicensed ? 'Receiver Hazmat Authorized' : 'Standard Compliance Verified'}
            </span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="match-dna-table">
              <thead>
                <tr>
                  <th style={{ width: '25%' }}>Evaluation Factor</th>
                  <th style={{ width: '22%' }}>Raw Score</th>
                  <th style={{ width: '12%' }}>Weight</th>
                  <th style={{ width: '15%' }}>Contribution</th>
                  <th style={{ width: '26%' }}>Audit Rationale</th>
                </tr>
              </thead>
              <tbody>
                {factorsList.map((factor) => {
                  const weightPct = factor.weight > 1 ? factor.weight : factor.weight * 100;
                  const factorKey = factor.key || '';
                  const weightDisplay = weights[factorKey] || Math.round(weightPct);
                  const label = factor.name || factorLabels[factorKey] || factorKey;

                  return (
                    <tr key={factorKey || label}>
                      <td style={{ fontWeight: 600, color: 'var(--navy)' }}>{label}</td>
                      <td>
                        <div className="progress-bar-wrap">
                          <span style={{ fontFamily: 'var(--font-mono)', minWidth: '1.75rem' }}>
                            {Math.round(factor.rawScore)}
                          </span>
                          <div className="progress-bar-bg">
                            <div
                              className="progress-bar-fill"
                              style={{ width: `${Math.min(100, Math.max(0, factor.rawScore))}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--muted-foreground)' }}>
                        {weightDisplay}%
                      </td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--navy)' }}>
                        {factor.contribution.toFixed(1)}
                      </td>
                      <td style={{ color: 'var(--muted-foreground)', fontSize: '0.75rem', lineHeight: 1.4 }}>
                        {factor.explanation}
                      </td>
                    </tr>
                  );
                })}

                {/* Total Row */}
                <tr style={{ backgroundColor: 'rgba(255, 255, 255, 0.7)', borderTop: '2px solid var(--border-strong)' }}>
                  <td style={{ fontWeight: 700, color: 'var(--navy)' }}>Total Weighted Score</td>
                  <td />
                  <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--muted-foreground)' }}>100%</td>
                  <td style={{ fontFamily: 'var(--font-display)', fontSize: '0.9375rem', fontWeight: 700, color: 'var(--navy)' }}>
                    {overallScore} / 100
                  </td>
                  <td style={{ fontSize: '0.75rem', color: 'var(--forest)', fontWeight: 500 }}>
                    Passed Hazard Check & Material Gate (≥ 40 threshold)
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </article>
  );
}
