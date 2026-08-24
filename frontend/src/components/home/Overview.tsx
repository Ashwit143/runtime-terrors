import React from 'react';
import { ArrowRight, Factory, ScanSearch, Route as RouteIcon, Recycle } from 'lucide-react';
import { ColumnChart } from '../common/ColumnChart.js';

interface OverviewProps {
  onNavigateToMatches: () => void;
  onNavigateToListing: () => void;
  onNavigateToImpact?: () => void;
}

const steps = [
  {
    icon: Factory,
    title: '1. Register Stream',
    body: 'Suppliers list by-products; manufacturers list raw material demand with quantities, quality grades, and specs.',
  },
  {
    icon: ScanSearch,
    title: '2. Deterministic Filtering',
    body: 'Hazard checks ensure hazardous waste only pairs with licensed recyclers; material compatibility gates eliminate non-viable pairings.',
  },
  {
    icon: RouteIcon,
    title: '3. 5-Factor Scoring',
    body: 'Each viable pair receives a transparent score across compatibility, transport, quantity fit, quality, and availability.',
  },
  {
    icon: Recycle,
    title: '4. Execute & Divert',
    body: 'Enterprises review the Match DNA, establish direct supply agreements, and track diverted landfill tonnage and cost savings.',
  },
];

export function Overview({
  onNavigateToMatches,
  onNavigateToListing,
  onNavigateToImpact,
}: OverviewProps) {
  return (
    <div>
      {/* 1. Hero / Banner Section */}
      <section
        style={{
          position: 'relative',
          overflow: 'hidden',
          borderBottom: '1px solid var(--border)',
          backgroundColor: 'var(--surface)',
        }}
      >
        {/* Background Refinery Image */}
        <img
          src="/assets/hero-refinery.jpg"
          alt="Industrial refinery and manufacturing landscape"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: 0.18,
          }}
          onError={(e) => {
            // Fallback if image path differs
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(90deg, var(--background) 0%, rgba(247, 248, 245, 0.92) 55%, rgba(247, 248, 245, 0.70) 100%)',
          }}
        />

        <div style={{ position: 'relative', maxWidth: '1200px', margin: '0 auto', padding: '4.5rem 1.5rem' }}>
          <p className="label-caps" style={{ color: 'var(--brand-blue)' }}>
            Industrial Circular Economy Platform
          </p>
          <h1
            style={{
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              lineHeight: 1.15,
              fontWeight: 700,
              maxWidth: '48rem',
              marginTop: '0.75rem',
            }}
          >
            One plant's waste stream is another plant's{' '}
            <span style={{ color: 'var(--primary)' }}>raw material</span>.
          </h1>
          <p
            style={{
              marginTop: '1rem',
              maxWidth: '38rem',
              fontSize: '1rem',
              lineHeight: 1.6,
              color: 'var(--muted-foreground)',
            }}
          >
            Waste 2 Worth connects industries to exchange, reuse, and create value from industrial by-products with transparent, 100% explainable 5-factor matching.
          </p>

          <div style={{ marginTop: '2rem', display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            <button
              type="button"
              onClick={onNavigateToMatches}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: 'var(--primary)',
                color: 'var(--primary-foreground)',
                fontWeight: 600,
                fontSize: '0.875rem',
                padding: '0.6875rem 1.25rem',
                borderRadius: 'var(--radius-md)',
                border: 'none',
                transition: 'background-color 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--primary-hover)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--primary)')}
            >
              Find Qualified Matches <ArrowRight size={16} />
            </button>
            <button
              type="button"
              onClick={onNavigateToListing}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                backgroundColor: 'var(--surface)',
                color: 'var(--navy)',
                fontWeight: 600,
                fontSize: '0.875rem',
                padding: '0.6875rem 1.25rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-strong)',
                transition: 'background-color 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--surface-2)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--surface)')}
            >
              Create a Listing
            </button>
          </div>
        </div>
      </section>

      {/* 2. Simple 4-Step Workflow */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '3.5rem 1.5rem', borderBottom: '1px solid var(--border)' }}>
        <p className="label-caps">How it works</p>
        <h2 style={{ fontSize: '1.375rem', marginTop: '0.25rem' }}>
          Four steps from by-product listing to verified circular exchange
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1rem',
            marginTop: '1.5rem',
          }}
        >
          {steps.map(({ icon: Icon, title, body }) => (
            <div key={title} className="card-soft" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Icon size={20} style={{ color: 'var(--brand-blue)' }} />
              </div>
              <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, marginTop: '0.875rem' }}>{title}</h3>
              <p style={{ fontSize: '0.8125rem', color: 'var(--muted-foreground)', marginTop: '0.375rem', lineHeight: 1.5 }}>
                {body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Concise Impact Preview & Primary CTA */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '3.5rem 1.5rem' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2rem',
            alignItems: 'center',
          }}
        >
          <div>
            <p className="label-caps">Measurable Industrial Impact</p>
            <h2 style={{ fontSize: '1.375rem', marginTop: '0.25rem' }}>
              Turn disposal liabilities into secondary raw material assets
            </h2>
            <p style={{ marginTop: '0.75rem', fontSize: '0.875rem', lineHeight: 1.6, color: 'var(--muted-foreground)' }}>
              Indian manufacturing clusters generate millions of tonnes of clean by-products annually. Waste 2 Worth eliminates the information gap, allowing production facilities to divert material from landfills while cutting procurement costs.
            </p>
            <div style={{ marginTop: '1.5rem' }}>
              <button
                type="button"
                onClick={onNavigateToMatches}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  color: 'var(--brand-blue)',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                }}
              >
                Explore Active Exchange Pairings <ArrowRight size={16} />
              </button>
            </div>
          </div>

          <div className="card-soft" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <p className="label-caps">Waste Diverted by Material Stream (Tonnes)</p>
              {onNavigateToImpact && (
                <button
                  type="button"
                  onClick={onNavigateToImpact}
                  style={{
                    fontSize: '0.75rem',
                    color: 'var(--brand-blue)',
                    background: 'none',
                    border: 'none',
                    fontWeight: 600,
                  }}
                >
                  Full Dashboard →
                </button>
              )}
            </div>
            <ColumnChart metric="diverted" height={220} />
          </div>
        </div>
      </section>
    </div>
  );
}
