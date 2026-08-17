import React, { useState, useMemo } from 'react';
import { MatchRecord } from '../../types/index.js';
import { MatchCard } from './MatchCard.js';
import { Filter, Inbox } from 'lucide-react';

interface MatchListProps {
  matches: MatchRecord[];
  onSelectMatch?: (match: MatchRecord) => void;
  onViewCompanyDetails?: (companyId: string) => void;
  selectedMatchIds?: string[];
  isLoading?: boolean;
}

export const MatchList: React.FC<MatchListProps> = ({
  matches,
  onSelectMatch,
  onViewCompanyDetails,
  selectedMatchIds = [],
  isLoading = false,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [minScoreFilter, setMinScoreFilter] = useState<number>(40);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredMatches = useMemo(() => {
    return matches.filter(m => {
      // Category filter
      if (selectedCategory !== 'ALL' && m.supplier.category !== selectedCategory) {
        return false;
      }
      // Score filter
      if (m.score.overallScore < minScoreFilter) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const text = `${m.supplier.companyName} ${m.receiver.companyName} ${m.supplier.materialName} ${m.supplier.city} ${m.receiver.city}`.toLowerCase();
        if (!text.includes(q)) return false;
      }
      return true;
    });
  }, [matches, selectedCategory, minScoreFilter, searchQuery]);

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-secondary)' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13px' }}>
          Filtering through Gate 1 (Hazard) & Gate 2 (Material) and computing 5-factor scores...
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Filter & Controls Bar */}
      <div className="filter-bar">
        <div className="filter-group">
          <Filter size={14} color="var(--text-tertiary)" />
          <span className="filter-label">Category:</span>
          <select
            className="form-select"
            style={{ padding: '6px 10px', fontSize: '12px' }}
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
          >
            <option value="ALL">All Categories ({matches.length})</option>
            <option value="PLASTIC">Plastic</option>
            <option value="TEXTILE">Textile</option>
            <option value="METAL">Metal</option>
            <option value="FOOD_AGRO">Food & Agro</option>
            <option value="CHEMICAL">Chemical / Solvents</option>
          </select>
        </div>

        <div className="filter-group">
          <span className="filter-label">Min Score:</span>
          <select
            className="form-select"
            style={{ padding: '6px 10px', fontSize: '12px' }}
            value={minScoreFilter}
            onChange={e => setMinScoreFilter(Number(e.target.value))}
          >
            <option value={40}>All Viable Matches (≥ 40)</option>
            <option value={70}>High Compatibility Only (≥ 70)</option>
            <option value={85}>Top Ranked (≥ 85)</option>
          </select>
        </div>

        <div className="filter-group" style={{ flex: 1, maxWidth: '280px' }}>
          <input
            type="text"
            className="form-input"
            style={{ padding: '6px 10px', fontSize: '12px', width: '100%' }}
            placeholder="Search by city, enterprise, material..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>

        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-secondary)' }}>
          Showing <strong>{filteredMatches.length}</strong> viable matches
        </div>
      </div>

      {/* Match Cards List */}
      {filteredMatches.length === 0 ? (
        <div
          style={{
            background: 'var(--bg-surface-1)',
            border: '1px dashed var(--border-default)',
            borderRadius: 'var(--radius-md)',
            padding: '60px 20px',
            textAlign: 'center',
            color: 'var(--text-tertiary)',
          }}
        >
          <Inbox size={36} style={{ margin: '0 auto 12px auto', opacity: 0.5 }} />
          <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>
            No Matches Found
          </div>
          <div style={{ fontSize: '12px', marginTop: '4px' }}>
            No candidate pairs passed the hazard/material gates and minimum threshold (≥ {minScoreFilter}).
          </div>
        </div>
      ) : (
        filteredMatches.map(match => (
          <MatchCard
            key={match.matchId}
            match={match}
            onSelectMatch={onSelectMatch}
            onViewCompanyDetails={onViewCompanyDetails}
            isSelected={selectedMatchIds.includes(match.matchId)}
          />
        ))
      )}
    </div>
  );
};
