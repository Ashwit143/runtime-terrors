import React from 'react';
import { Listing } from '../../types/index.js';
import { X, Building2, MapPin, Scale, Clock, ShieldCheck, AlertTriangle, IndianRupee, Mail, Phone, User } from 'lucide-react';

interface CompanyDetailModalProps {
  listing: Listing | null;
  onClose: () => void;
}

export const CompanyDetailModal: React.FC<CompanyDetailModalProps> = ({ listing, onClose }) => {
  if (!listing) return null;

  const isSupplier = listing.type === 'SUPPLIER';

  const formatINR = (val?: number) => {
    if (!val) return 'Negotiable';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span
              className="match-badge"
              style={{
                background: isSupplier ? 'var(--brand-gold-bg)' : 'rgba(23, 23, 23, 0.05)',
                borderColor: isSupplier ? 'var(--brand-gold-border)' : 'var(--border-default)',
                color: isSupplier ? 'var(--brand-gold-dark)' : 'var(--text-primary)',
              }}
            >
              {isSupplier ? 'Waste Supplier' : 'Material Receiver'}
            </span>
            <span style={{ fontSize: '11px', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
              ID: {listing.id}
            </span>
          </div>

          <button className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Company Title */}
        <div style={{ marginTop: '12px', marginBottom: '18px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            {listing.companyName}
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            <MapPin size={14} color="var(--brand-gold-dark)" />
            <span>{listing.city}{listing.state ? `, ${listing.state}` : ''}</span>
          </div>
        </div>

        {/* Material Stream Card */}
        <div className="modal-section-box">
          <div className="modal-section-label">Material Stream Details</div>
          <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
            {listing.materialName}
          </div>
          {listing.description && (
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              {listing.description}
            </div>
          )}
        </div>

        {/* Attributes Grid */}
        <div className="modal-grid">
          <div className="modal-grid-item">
            <div className="modal-item-label">Stream Category</div>
            <div className="modal-item-value">{listing.category}</div>
          </div>

          <div className="modal-grid-item">
            <div className="modal-item-label">{isSupplier ? 'Offered Quantity' : 'Required Quantity'}</div>
            <div className="modal-item-value" style={{ fontFamily: 'var(--font-mono)' }}>
              {listing.quantity} {listing.unit}
            </div>
          </div>

          <div className="modal-grid-item">
            <div className="modal-item-label">Quality Specification</div>
            <div className="modal-item-value">{listing.qualityGrade} Grade</div>
          </div>

          <div className="modal-grid-item">
            <div className="modal-item-label">Supply Frequency</div>
            <div className="modal-item-value">{listing.frequency.toLowerCase()}</div>
          </div>

          <div className="modal-grid-item">
            <div className="modal-item-label">Estimated Valuation</div>
            <div className="modal-item-value" style={{ color: 'var(--brand-gold-dark)', fontFamily: 'var(--font-mono)' }}>
              {formatINR(listing.pricePerUnit)} {listing.pricePerUnit ? '/ tonne' : ''}
            </div>
          </div>

          <div className="modal-grid-item">
            <div className="modal-item-label">Regulatory Status</div>
            <div className="modal-item-value">
              {listing.isHazardous ? (
                <span style={{ color: 'var(--score-low)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <AlertTriangle size={13} /> Hazardous
                </span>
              ) : listing.isHazmatLicensed ? (
                <span style={{ color: 'var(--score-high)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <ShieldCheck size={13} /> Hazmat Licensed
                </span>
              ) : (
                'Standard Industrial'
              )}
            </div>
          </div>
        </div>

        {/* Contact info if present */}
        {(listing.contactPerson || listing.email || listing.phone) && (
          <div style={{ marginTop: '16px', borderTop: '1px solid var(--border-subtle)', paddingTop: '14px', fontSize: '12px', color: 'var(--text-secondary)' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
              {listing.contactPerson && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <User size={13} color="var(--text-tertiary)" />
                  <span>{listing.contactPerson}</span>
                </div>
              )}
              {listing.email && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Mail size={13} color="var(--text-tertiary)" />
                  <span>{listing.email}</span>
                </div>
              )}
              {listing.phone && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Phone size={13} color="var(--text-tertiary)" />
                  <span>{listing.phone}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
