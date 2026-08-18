import React from 'react';
import { Listing } from '../../types/index.js';
import { getCompanyImage, FALLBACK_INDUSTRIAL_IMAGE } from '../../data/companyImages.js';
import { MapPin, ArrowRight, Package, Truck } from 'lucide-react';

interface EnterpriseDirectoryProps {
  listings: Listing[];
  onSelectCompany: (companyId: string) => void;
}

export const EnterpriseDirectory: React.FC<EnterpriseDirectoryProps> = ({
  listings,
  onSelectCompany,
}) => {
  const suppliers = listings.filter(l => l.type === 'SUPPLIER');
  const receivers = listings.filter(l => l.type === 'RECEIVER');

  // Semantic Quality Badge Class
  const getQualityBadgeClass = (grade: string) => {
    if (grade === 'HIGH') return 'quality-badge-high';
    if (grade === 'MEDIUM') return 'quality-badge-medium';
    return 'quality-badge-low';
  };

  const renderCompanyCard = (item: Listing) => {
    const imageUrl = getCompanyImage(item.id, item.category);

    return (
      <div
        key={item.id}
        className="company-image-card"
        onClick={() => onSelectCompany(item.id)}
      >
        {/* Real Industrial Facility Image with Fallback */}
        <div className="company-card-image-wrap">
          <img
            src={imageUrl}
            alt={item.companyName}
            className="company-card-img"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = FALLBACK_INDUSTRIAL_IMAGE;
            }}
          />
          <div className="company-card-badge-overlay">
            <span className="company-card-category">{item.category}</span>
          </div>
        </div>

        {/* Card Body */}
        <div className="company-card-body">
          <div>
            <h4 className="company-card-title">{item.companyName}</h4>
            <div className="company-card-location">
              <MapPin size={12} color="var(--brand-gold-dark)" />
              <span>{item.city}{item.state ? `, ${item.state}` : ''}</span>
            </div>
          </div>

          <div className="company-card-material-info">
            <div className="company-card-material-name">{item.materialName}</div>
            <div className="company-card-specs-row">
              <span className={`quality-badge ${getQualityBadgeClass(item.qualityGrade)}`}>
                {item.qualityGrade} Grade
              </span>
              <span className="company-card-qty">
                {item.quantity} {item.unit}
              </span>
            </div>
          </div>

          <div className="company-card-action-bar">
            <span className="company-card-action-text">
              View Details <ArrowRight size={12} />
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="enterprise-directory-wrap">
      {/* SECTION 1: WASTE SUPPLIERS */}
      <section className="directory-section">
        <div className="directory-section-header">
          <div className="directory-section-title-wrap">
            <div className="directory-section-icon supplier-icon">
              <Package size={16} />
            </div>
            <div>
              <h2 className="directory-section-title">Waste Suppliers</h2>
              <p className="directory-section-subtitle">
                Manufacturing facilities offering industrial byproducts, scrap, and circular feedstocks.
              </p>
            </div>
          </div>
          <span className="directory-count-badge">{suppliers.length} Enterprises</span>
        </div>

        <div className="directory-cards-grid">
          {suppliers.map(renderCompanyCard)}
        </div>
      </section>

      {/* SECTION 2: MATERIAL RECEIVERS */}
      <section className="directory-section" style={{ marginTop: '36px' }}>
        <div className="directory-section-header">
          <div className="directory-section-title-wrap">
            <div className="directory-section-icon receiver-icon">
              <Truck size={16} />
            </div>
            <div>
              <h2 className="directory-section-title">Material Receivers</h2>
              <p className="directory-section-subtitle">
                Recycling & reprocessing facilities procuring secondary materials for circular manufacturing.
              </p>
            </div>
          </div>
          <span className="directory-count-badge">{receivers.length} Enterprises</span>
        </div>

        <div className="directory-cards-grid">
          {receivers.map(renderCompanyCard)}
        </div>
      </section>
    </div>
  );
};
