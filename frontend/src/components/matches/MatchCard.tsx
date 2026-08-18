import React, { useState } from 'react';
import { MatchRecord } from '../../types/index.js';
import { ScoreIndicator } from './ScoreIndicator.js';
import { MatchDNA } from './MatchDNA.js';
import {
  MapPin,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  Package,
  Layers,
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
  const { supplier, receiver, score } = match;

  // Semantic quality badge styling
  const getQualityBadgeClass = (grade: string) => {
    if (grade === 'HIGH') return 'quality-badge-high';
    if (grade === 'MEDIUM') return 'quality-badge-medium';
    return 'quality-badge-low';
  };

  return (
    <div className={`match-card ${isSelected ? 'selected-border' : ''}`}>
      <div className="match-card-main">
        {/* Scannable Match Information */}
        <div className="match-entity-details">
          {/* Top Row: Supplier ➔ Receiver & Category */}
          <div className="match-company-name">
            <span
              className="match-company-link"
              onClick={() => onViewCompanyDetails && onViewCompanyDetails(supplier.id)}
              title="Click to view supplier profile"
            >
              {supplier.companyName}
            </span>
            <span className="match-arrow">➔</span>
            <span
              className="match-company-link"
              onClick={() => onViewCompanyDetails && onViewCompanyDetails(receiver.id)}
              title="Click to view receiver profile"
            >
              {receiver.companyName}
            </span>
            <span className="match-badge">{supplier.category}</span>
          </div>

          {/* Material Name */}
          <div className="match-material-name">
            {supplier.materialName}
          </div>

          {/* Scannable Essential Attributes: Location, Distance, Quantity, Quality, Availability */}
          <div className="match-meta-grid">
            <div className="match-meta-item">
              <MapPin size={13} color="var(--brand-gold-dark)" />
              <span>{supplier.city} to {receiver.city} · <strong>{score.distanceKm} km</strong></span>
            </div>

            <div className="match-meta-item">
              <Package size={13} color="var(--text-secondary)" />
              <span>{supplier.quantity} {supplier.unit}</span>
            </div>

            <div className="match-meta-item">
              <span className={`quality-badge ${getQualityBadgeClass(supplier.qualityGrade)}`}>
                {supplier.qualityGrade} Grade
              </span>
            </div>

            <div className="match-meta-item">
              <span className="availability-tag">
                {supplier.frequency.toLowerCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Right side: Score Block & Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <ScoreIndicator score={score.overallScore} />

          <div className="match-card-actions">
            {onSelectMatch && (
              <button
                className={`btn-secondary ${isSelected ? 'btn-primary' : ''}`}
                onClick={() => onSelectMatch(match)}
                style={{ fontSize: '11.5px', padding: '6px 12px' }}
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
                padding: '6px 12px',
                background: isExpanded ? 'var(--brand-gold-bg)' : '#FFFFFF',
                borderColor: isExpanded ? 'var(--brand-gold)' : 'var(--border-default)',
                color: isExpanded ? 'var(--brand-gold-dark)' : 'var(--text-primary)',
              }}
            >
              {isExpanded ? (
                <>
                  Hide Match DNA <ChevronUp size={13} />
                </>
              ) : (
                <>
                  Why this match? <ChevronDown size={13} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Expandable Match DNA Section (Hidden initially, revealed on demand) */}
      {isExpanded && <MatchDNA scoreResult={score} />}
    </div>
  );
};
