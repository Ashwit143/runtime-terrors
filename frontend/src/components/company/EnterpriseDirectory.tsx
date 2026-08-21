import React, { useMemo } from 'react';
import { Listing } from '../../types/index.js';
import { CompanyCard } from './CompanyCard.js';

interface EnterpriseDirectoryProps {
  listings: Listing[];
  onSelectCompany: (id: string) => void;
}

export function EnterpriseDirectory({ listings, onSelectCompany }: EnterpriseDirectoryProps) {
  const suppliers = useMemo(() => listings.filter((l) => l.type === 'SUPPLIER'), [listings]);
  const receivers = useMemo(() => listings.filter((l) => l.type === 'RECEIVER'), [listings]);

  return (
    <div>
      {/* 1. Page Header */}
      <div className="page-header">
        <div className="page-header-container">
          <div>
            <p className="label-caps">Network Registry</p>
            <h1 className="page-header-title">Enterprise Directory</h1>
            <p className="page-header-desc">
              Browse verified industrial waste suppliers and manufacturing material receivers active across Indian industrial corridors.
            </p>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
        {/* Section 1: Waste Suppliers */}
        <section>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 600 }}>Waste Suppliers</h2>
            <span style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>
              {suppliers.length} Registered Facilities
            </span>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '1rem',
            }}
          >
            {suppliers.map((company) => (
              <CompanyCard
                key={company.id}
                company={company}
                onClick={onSelectCompany}
              />
            ))}
          </div>
        </section>

        {/* Section 2: Material Receivers */}
        <section>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 600 }}>Material Receivers</h2>
            <span style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>
              {receivers.length} Registered Facilities
            </span>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '1rem',
            }}
          >
            {receivers.map((company) => (
              <CompanyCard
                key={company.id}
                company={company}
                onClick={onSelectCompany}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
