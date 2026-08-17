import React from 'react';
import { ArrowRight, PlusCircle, Layers, Sparkles, ShieldCheck, Scale, Leaf } from 'lucide-react';
import { ImpactSummary } from '../../types/index.js';

interface OverviewProps {
  onNavigateToMatches: () => void;
  onNavigateToListing: () => void;
  totalListingsCount: number;
  totalMatchesCount: number;
}

export const Overview: React.FC<OverviewProps> = ({
  onNavigateToMatches,
  onNavigateToListing,
  totalListingsCount,
  totalMatchesCount,
}) => {
  return (
    <div className="overview-container">
      {/* Hero Product Statement */}
      <div className="overview-hero">
        <div className="overview-badge">
          <Sparkles size={13} color="var(--brand-gold-dark)" />
          <span>Industrial Resource Circularity</span>
        </div>

        <h1 className="overview-headline">
          Turn industrial waste into <span className="highlight-gold">productive resources</span>.
        </h1>

        <p className="overview-description">
          CircularMatch AI connects enterprises producing industrial byproducts with facilities that require those materials — powered by a transparent, 100% explainable 5-factor matching engine.
        </p>

        {/* Primary Entry Actions */}
        <div className="overview-actions">
          <button className="btn-gold" onClick={onNavigateToListing} style={{ padding: '13px 26px', fontSize: '14px' }}>
            <PlusCircle size={17} />
            Create a Listing
          </button>

          <button className="btn-secondary" onClick={onNavigateToMatches} style={{ padding: '13px 26px', fontSize: '14px' }}>
            <Layers size={17} />
            Find Matches
            <ArrowRight size={15} />
          </button>
        </div>
      </div>

      {/* High-Level Platform Statistics (Clean & Minimal) */}
      <div className="overview-stats-grid">
        <div className="overview-stat-card">
          <div className="stat-num">{totalListingsCount || 16}+</div>
          <div className="stat-label">Enterprises Onboarded</div>
          <div className="stat-subtext">Across Gujarat, Maharashtra, NCR & Tamil Nadu hubs</div>
        </div>

        <div className="overview-stat-card">
          <div className="stat-num">340+ <span style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-secondary)' }}>Tonnes/mo</span></div>
          <div className="stat-label">Circular Materials Listed</div>
          <div className="stat-subtext">Polymers, textile yarn waste, metals & biomass</div>
        </div>

        <div className="overview-stat-card">
          <div className="stat-num">{totalMatchesCount || 24}</div>
          <div className="stat-label">Viable Matches Identified</div>
          <div className="stat-subtext">Pre-filtered and scored above 40 threshold</div>
        </div>
      </div>

      {/* Value Pillars (Clean 3-column overview) */}
      <div className="overview-pillars-grid">
        <div className="pillar-card">
          <div className="pillar-icon">
            <ShieldCheck size={20} color="var(--brand-gold-dark)" />
          </div>
          <div className="pillar-title">Deterministic Scoring</div>
          <div className="pillar-desc">
            No black-box recommendations. Every match score is calculated from 5 mathematical factors with full auditability.
          </div>
        </div>

        <div className="pillar-card">
          <div className="pillar-icon">
            <Scale size={20} color="var(--brand-gold-dark)" />
          </div>
          <div className="pillar-title">Hard Compatibility Gates</div>
          <div className="pillar-desc">
            Hazardous waste compliance and material compatibility are evaluated before scoring to prevent unviable exchanges.
          </div>
        </div>

        <div className="pillar-card">
          <div className="pillar-icon">
            <Leaf size={20} color="var(--score-high)" />
          </div>
          <div className="pillar-title">Quantified Impact</div>
          <div className="pillar-desc">
            Instantly measure landfill diversion in tonnes, carbon avoided in tCO₂e, and procurement cost savings in INR.
          </div>
        </div>
      </div>
    </div>
  );
};
