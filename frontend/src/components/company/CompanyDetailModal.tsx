import React from 'react';
import { X, MapPin, Package, ShieldCheck, Mail, Phone, Calendar } from 'lucide-react';
import { Listing } from '../../types/index.js';
import { GradeTag } from '../common/GradeTag.js';
import { getCompanyImage } from '../../data/companyImages.js';

interface CompanyDetailModalProps {
  listing: Listing | null;
  onClose: () => void;
}

export function CompanyDetailModal({ listing, onClose }: CompanyDetailModalProps) {
  if (!listing) return null;

  const isSupplier = listing.type === 'SUPPLIER';
  const imgUrl = getCompanyImage(listing.id, listing.category);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--navy)' }}>
                {listing.companyName}
              </h2>
              <GradeTag grade={listing.qualityGrade} />
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', marginTop: '0.125rem' }}>
              {listing.city}{listing.state ? `, ${listing.state}` : ''} ·{' '}
              <span style={{ fontWeight: 600, color: isSupplier ? 'var(--brand-blue)' : 'var(--primary)' }}>
                {isSupplier ? 'Industrial Waste Supplier' : 'Material Off-taker / Receiver'}
              </span>
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--muted-foreground)',
              padding: '0.25rem',
              cursor: 'pointer',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          {/* Facility Banner Image */}
          <div
            style={{
              height: '10rem',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              marginBottom: '1.25rem',
              backgroundColor: 'var(--surface-2)',
              border: '1px solid var(--border)',
            }}
          >
            <img
              src={imgUrl}
              alt={listing.companyName}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/companies/aravalli-polymers.svg';
              }}
            />
          </div>

          {/* Specifications Grid */}
          <dl
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1rem',
              fontSize: '0.8125rem',
              marginBottom: '1.25rem',
            }}
          >
            <div>
              <dt className="label-caps">Material Stream</dt>
              <dd style={{ fontWeight: 600, color: 'var(--navy)', marginTop: '0.125rem' }}>
                {listing.materialName || listing.category}
              </dd>
            </div>
            <div>
              <dt className="label-caps">Available Quantity</dt>
              <dd style={{ fontWeight: 600, color: 'var(--navy)', marginTop: '0.125rem' }}>
                {listing.quantity} {listing.unit}
              </dd>
            </div>
            <div>
              <dt className="label-caps">Frequency</dt>
              <dd style={{ marginTop: '0.125rem' }}>{listing.frequency}</dd>
            </div>
            <div>
              <dt className="label-caps">Hazmat Compliance</dt>
              <dd style={{ marginTop: '0.125rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                {listing.isHazmatLicensed || !listing.isHazardous ? (
                  <>
                    <ShieldCheck size={14} style={{ color: 'var(--primary)' }} />
                    {listing.isHazmatLicensed ? 'Authorized Recycler' : 'Non-Hazardous Clean'}
                  </>
                ) : (
                  <span style={{ color: 'var(--gold-foreground)' }}>Regulated Stream</span>
                )}
              </dd>
            </div>
          </dl>

          {/* Technical Description */}
          {listing.description && (
            <div style={{ backgroundColor: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '0.875rem', fontSize: '0.75rem', lineHeight: 1.5, color: 'var(--muted-foreground)' }}>
              <p className="label-caps" style={{ marginBottom: '0.25rem' }}>Technical Specification</p>
              {listing.description}
            </div>
          )}

          {/* Contact Details */}
          {(listing.contactPerson || listing.email || listing.phone) && (
            <div style={{ marginTop: '1rem', borderTop: '1px solid var(--border)', paddingTop: '0.75rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>
              {listing.contactPerson && (
                <span><strong>Desk:</strong> {listing.contactPerson}</span>
              )}
              {listing.email && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Mail size={12} /> {listing.email}
                </span>
              )}
              {listing.phone && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Phone size={12} /> {listing.phone}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
