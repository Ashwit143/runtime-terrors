import React, { useState } from 'react';
import { MatchRecord } from '../../types/index.js';
import { ScoreIndicator } from './ScoreIndicator.js';
import { MatchDNA } from './MatchDNA.js';
import {
  ChevronDown,
  ChevronUp,
  CheckCircle,
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

  return (
    <div className={`match-card ${isSelected ? 'selected-border' : ''}`}>
      <div className="match-card-main">
        {/* Scannable Essential Match Information */}
        <div className="match-entity-details">
          {/* Supplier ➔ Receiver */}
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

          {/* Material Name / Stream Description */}
          <div className="match-material-name">
            {supplier.materialName}
          </div>
        </div>

        {/* Right side: Prominent Match Score & Focused Action Controls */}
        <div className="match-card-right-cluster">
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
                    <CheckCircle size={13} color="var(--brand-gold-light)" /> Added to Impact
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

      {/* Progressive Disclosure: Match DNA (Hidden by default, expandable on demand) */}
      {isExpanded && <MatchDNA scoreResult={score} />}
    </div>
  );
};
