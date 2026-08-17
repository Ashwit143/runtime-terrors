import React, { useState } from 'react';
import { MatchRecord } from '../../types/index.js';
import { ScoreIndicator } from './ScoreIndicator.js';
import { MatchDNA } from './MatchDNA.js';
import {
  MapPin,
  Scale,
  ChevronDown,
  ChevronUp,
  Leaf,
  IndianRupee,
  CheckCircle,
  Building,
} from 'lucide-react';

interface MatchCardProps {
  match: MatchRecord;
  onSelectMatch?: (match: MatchRecord) => void;
  onViewCompanyDetails?: (companyId: string) => void;
  isSelected?: boolean;
}

export const MatchCard: React.FC<MatchCardProps> = ({
  match,
  onSelectMatch,
  onViewCompanyDetails,
  isSelected = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { supplier, receiver, score, impact } = match;

  // Format currency for Indian INR
  const formattedINR = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(impact.estimatedCostSavedINR);

  return (
    <div className={`match-card ${isSelected ? 'selected-border' : ''}`}>
      <div className="match-card-main">
        {/* Entity details & exchange stream */}
        <div className="match-entity-details">
          {/* Top Row: Supplier ➔ Receiver */}
          <div className="match-company-name">
            <span
              style={{ cursor: onViewCompanyDetails ? 'pointer' : 'default', textDecoration: onViewCompanyDetails ? 'underline text-decoration-color: var(--border-strong)' : 'none' }}
              onClick={() => onViewCompanyDetails && onViewCompanyDetails(supplier.id)}
              title="Click to view company profile"
            >
              {supplier.companyName}
            </span>
            <span style={{ color: 'var(--brand-gold-dark)', fontSize: '13px' }}>➔</span>
            <span
              style={{ cursor: onViewCompanyDetails ? 'pointer' : 'default', textDecoration: onViewCompanyDetails ? 'underline text-decoration-color: var(--border-strong)' : 'none' }}
              onClick={() => onViewCompanyDetails && onViewCompanyDetails(receiver.id)}
              title="Click to view company profile"
            >
              {receiver.companyName}
            </span>
            <span className="match-badge">{supplier.category}</span>
          </div>

          {/* Material & Specification */}
          <div className="match-material-name">
            <strong>{supplier.materialName}</strong> · {supplier.qualityGrade} Grade · {supplier.frequency.toLowerCase()} stream
          </div>

          {/* Clean scannable meta attributes */}
          <div className="match-meta-grid">
            <div className="match-meta-item">
              <MapPin size={13} color="var(--brand-gold-dark)" />
              <span>
                {supplier.city} to {receiver.city} ({score.distanceKm} km)
              </span>
            </div>

            <div className="match-meta-item">
              <Scale size={13} color="var(--text-secondary)" />
              <span>
                {supplier.quantity} {supplier.unit} (Ratio: {score.quantityRatio}x)
              </span>
            </div>

            <div className="match-meta-item">
              <Leaf size={13} color="var(--score-high)" />
              <span>{impact.co2AvoidedTons} tCO₂e avoided</span>
            </div>

            <div className="match-meta-item">
              <IndianRupee size={13} color="var(--brand-gold-dark)" />
              <span>{formattedINR} est. savings</span>
            </div>
          </div>
        </div>

        {/* Right side: Structured score indicator & primary actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <ScoreIndicator score={score.overallScore} />

          <div className="match-card-actions">
            {onSelectMatch && (
              <button
                className={`btn-secondary ${isSelected ? 'btn-primary' : ''}`}
                onClick={() => onSelectMatch(match)}
                style={{ fontSize: '12px', padding: '6px 12px' }}
              >
                {isSelected ? (
                  <>
                    <CheckCircle size={13} color="var(--brand-gold-light)" /> In Impact
                  </>
                ) : (
                  'Add to Impact'
                )}
              </button>
            )}

            <button
              className="btn-secondary"
              onClick={() => setIsExpanded(!isExpanded)}
              style={{
                fontSize: '12px',
                padding: '6px 14px',
                background: isExpanded ? 'var(--brand-gold-bg)' : 'var(--bg-surface-1)',
                borderColor: isExpanded ? 'var(--brand-gold)' : 'var(--border-default)',
                color: isExpanded ? 'var(--brand-gold-dark)' : 'var(--text-primary)',
              }}
            >
              {isExpanded ? (
                <>
                  Hide Match DNA <ChevronUp size={14} />
                </>
              ) : (
                <>
                  Why this match? <ChevronDown size={14} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Expandable Match DNA Section (Revealed on Demand) */}
      {isExpanded && <MatchDNA scoreResult={score} />}
    </div>
  );
};
