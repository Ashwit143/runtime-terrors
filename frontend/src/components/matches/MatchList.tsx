import React, { useState, useMemo } from 'react';
import { MatchRecord } from '../../types/index.js';
import { MatchCard } from './MatchCard.js';

interface MatchListProps {
  matches: MatchRecord[];
  onSelectMatch?: (match: MatchRecord) => void;
  onViewCompanyDetails?: (companyId: string) => void;
  selectedMatchIds?: string[];
  isLoading?: boolean;
}

type FilterBand = 'ALL' | 'TOP_RANKED' | 'MODERATE';

export function MatchList({
  matches,
  onViewCompanyDetails,
  isLoading = false,
}: MatchListProps) {
  const [filterBand, setFilterBand] = useState<FilterBand>('ALL');

  // Filter matches based on clean tabs
  const filteredMatches = useMemo(() => {
    return matches.filter((m) => {
      const score = m.score.overallScore;
      if (filterBand === 'TOP_RANKED') return score >= 70;
      if (filterBand === 'MODERATE') return score >= 40 && score < 70;
      return true;
    });
  }, [matches, filterBand]);

  if (isLoading) {
    return (
      <div style={{ padding: '3rem 1.5rem', textAlign: 'center', color: 'var(--muted-foreground)' }}>
        <p style={{ fontSize: '0.875rem' }}>Evaluating candidate pairings across 5-factor deterministic model...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1.5rem' }}>
      {/* Filter Bar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          marginBottom: '1.5rem',
          paddingBottom: '1rem',
          borderBottom: '1px solid var(--border)',
        }}
      >
        {/* Score Band Tabs */}
        <div
          role="group"
          aria-label="Filter by score band"
          style={{
            display: 'inline-flex',
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            padding: '0.1875rem',
          }}
        >
          {(
            [
              { key: 'ALL', label: 'All' },
              { key: 'TOP_RANKED', label: 'Top Ranked' },
              { key: 'MODERATE', label: '40–69' },
            ] as const
          ).map((tab) => {
            const isSelected = filterBand === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                aria-pressed={isSelected}
                onClick={() => setFilterBand(tab.key)}
                style={{
                  padding: '0.375rem 0.875rem',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  backgroundColor: isSelected ? 'var(--brand-blue-soft)' : 'transparent',
                  color: isSelected ? 'var(--brand-blue)' : 'var(--muted-foreground)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>
          Showing {filteredMatches.length} qualified exchange{filteredMatches.length === 1 ? '' : 's'}
        </div>
      </div>

      {/* Matches List */}
      {filteredMatches.length === 0 ? (
        <div
          className="card-soft"
          style={{ padding: '3rem 1.5rem', textAlign: 'center', color: 'var(--muted-foreground)' }}
        >
          <p style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--navy)' }}>
            No matches found in this score range.
          </p>
          <p style={{ fontSize: '0.8125rem', marginTop: '0.25rem' }}>
            Try switching to 'All' or register a new waste/demand listing.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {filteredMatches.map((match, index) => (
            <MatchCard
              key={match.matchId || `${match.supplier.id}-${match.receiver.id}`}
              match={match}
              rank={index + 1}
              onViewCompanyDetails={onViewCompanyDetails}
            />
          ))}
        </div>
      )}
    </div>
  );
}
