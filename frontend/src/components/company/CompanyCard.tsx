import React from 'react';
import { MapPin, Package, ShieldCheck } from 'lucide-react';
import { Listing } from '../../types/index.js';
import { GradeTag } from '../common/GradeTag.js';
import { getCompanyImage } from '../../data/companyImages.js';

interface CompanyCardProps {
  company: Listing;
  onClick: (id: string) => void;
}

export function CompanyCard({ company, onClick }: CompanyCardProps) {
  // Map appropriate facility image based on category / id
  const imgUrl = getCompanyImage(company.id, company.category);

  return (
    <button
      type="button"
      onClick={() => onClick(company.id)}
      className="company-card"
    >
      <div className="company-card-img-wrap">
        <img
          src={imgUrl}
          alt={`${company.companyName} facility`}
          loading="lazy"
          className="company-card-img"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/companies/aravalli-polymers.svg';
          }}
        />
        <div style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', zIndex: 2 }}>
          <GradeTag grade={company.qualityGrade} />
        </div>
      </div>

      <div className="company-card-body">
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem' }}>
          <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--navy)' }}>
            {company.companyName}
          </h3>
        </div>

        <p style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: 'var(--muted-foreground)', marginTop: '0.25rem' }}>
          <MapPin size={12} /> {company.city}{company.state ? `, ${company.state}` : ''}
        </p>

        <p style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--foreground)', marginTop: '0.625rem' }}>
          {company.materialName || company.category}
        </p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.375rem', fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Package size={12} /> {company.quantity} {company.unit}
          </span>
          {company.isHazmatLicensed && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--primary)', fontWeight: 600, fontSize: '0.6875rem' }}>
              <ShieldCheck size={12} /> Licensed
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
