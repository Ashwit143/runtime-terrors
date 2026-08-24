import React, { useState } from 'react';
import {
  Listing,
  ListingType,
  MaterialCategory,
  QualityGrade,
  AvailabilityFrequency,
} from '../../types/index.js';

interface ListingFormProps {
  initialData?: Partial<Listing>;
  onSubmit: (listing: Partial<Listing>) => Promise<void>;
  isLoading?: boolean;
}

export function ListingForm({
  initialData,
  onSubmit,
  isLoading = false,
}: ListingFormProps) {
  const [formType, setFormType] = useState<ListingType>(initialData?.type || 'SUPPLIER');

  // Form Fields State
  const [companyName, setCompanyName] = useState(initialData?.companyName || '');
  const [city, setCity] = useState(initialData?.city || '');
  const [state, setState] = useState(initialData?.state || '');
  const [contactPerson, setContactPerson] = useState(initialData?.contactPerson || '');
  const [email, setEmail] = useState(initialData?.email || '');
  const [phone, setPhone] = useState(initialData?.phone || '');
  const [category, setCategory] = useState<MaterialCategory>(initialData?.category || 'PLASTIC');
  const [materialName, setMaterialName] = useState(initialData?.materialName || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [quantity, setQuantity] = useState<number>(initialData?.quantity || 100);
  const [unit, setUnit] = useState(initialData?.unit || 't/month');
  const [qualityGrade, setQualityGrade] = useState<QualityGrade>(initialData?.qualityGrade || 'HIGH');
  const [frequency, setFrequency] = useState<AvailabilityFrequency>(
    initialData?.frequency || 'MONTHLY',
  );
  const [isHazardous, setIsHazardous] = useState<boolean>(initialData?.isHazardous || false);
  const [isHazmatLicensed, setIsHazmatLicensed] = useState<boolean>(
    initialData?.isHazmatLicensed || false,
  );
  const [pricePerUnit, setPricePerUnit] = useState<number | undefined>(initialData?.pricePerUnit);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: Partial<Listing> = {
      type: formType,
      companyName,
      city,
      state: state || undefined,
      contactPerson: contactPerson || undefined,
      email: email || undefined,
      phone: phone || undefined,
      category,
      materialName: materialName || (category === 'PLASTIC' ? 'PET Bottle Flakes' : `${category} stream`),
      description: description || undefined,
      quantity: Number(quantity),
      unit,
      qualityGrade,
      frequency,
      isHazardous: formType === 'SUPPLIER' ? isHazardous : false,
      isHazmatLicensed: formType === 'RECEIVER' ? isHazmatLicensed : false,
      pricePerUnit: pricePerUnit ? Number(pricePerUnit) : undefined,
    };

    await onSubmit(payload);
  };

  return (
    <div className="form-container">
      {/* 1. Clear Toggle between Supply and Demand */}
      <div
        role="group"
        aria-label="Listing type"
        className="form-toggle-group"
      >
        <button
          type="button"
          aria-pressed={formType === 'SUPPLIER'}
          onClick={() => setFormType('SUPPLIER')}
          className={`form-toggle-btn ${formType === 'SUPPLIER' ? 'active' : ''}`}
        >
          I Have Waste to Offer
        </button>
        <button
          type="button"
          aria-pressed={formType === 'RECEIVER'}
          onClick={() => setFormType('RECEIVER')}
          className={`form-toggle-btn ${formType === 'RECEIVER' ? 'active' : ''}`}
        >
          I Need Material
        </button>
      </div>

      {/* 2. Single Form Card */}
      <form className="form-card" onSubmit={handleSubmit}>
        <div style={{ paddingBottom: '1rem', borderBottom: '1px solid var(--border)', marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 600 }}>
            {formType === 'SUPPLIER' ? 'Waste Stream Details' : 'Material Requirement Details'}
          </h2>
          <p style={{ fontSize: '0.8125rem', color: 'var(--muted-foreground)', marginTop: '0.25rem' }}>
            {formType === 'SUPPLIER'
              ? 'Register your industrial by-product to match with qualified manufacturing off-takers.'
              : 'Specify your input raw material needs to discover consistent industrial suppliers.'}
          </p>
        </div>

        <div className="form-grid-2">
          {/* Company Name */}
          <div className="form-field">
            <label className="label-caps" style={{ marginBottom: '0.375rem' }}>
              Enterprise / Facility Name *
            </label>
            <input
              type="text"
              required
              className="form-input"
              placeholder="e.g. Deccan Polymers Pvt. Ltd."
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
          </div>

          {/* Location */}
          <div className="form-field">
            <label className="label-caps" style={{ marginBottom: '0.375rem' }}>
              City / Location *
            </label>
            <input
              type="text"
              required
              className="form-input"
              placeholder="e.g. Surat, Gujarat"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>

          {/* Material Category */}
          <div className="form-field">
            <label className="label-caps" style={{ marginBottom: '0.375rem' }}>
              Material Category *
            </label>
            <select
              className="form-select"
              value={category}
              onChange={(e) => setCategory(e.target.value as MaterialCategory)}
            >
              <option value="PLASTIC">Polymers & Plastics</option>
              <option value="TEXTILE">Textiles & Fiber</option>
              <option value="METAL">Metals & Slag</option>
              <option value="FOOD_AGRO">Biomass & Agro-Residue</option>
              <option value="CHEMICAL">Chemicals & Solvents</option>
              <option value="RUBBER_MINERALS">Rubber & Minerals</option>
            </select>
          </div>

          {/* Material Name / Spec */}
          <div className="form-field">
            <label className="label-caps" style={{ marginBottom: '0.375rem' }}>
              {formType === 'SUPPLIER' ? 'Stream / Material Name *' : 'Required Specification *'}
            </label>
            <input
              type="text"
              required
              className="form-input"
              placeholder="e.g. Clean PET Bottle Flakes / Slag 0-10mm"
              value={materialName}
              onChange={(e) => setMaterialName(e.target.value)}
            />
          </div>

          {/* Quantity & Unit */}
          <div className="form-field">
            <label className="label-caps" style={{ marginBottom: '0.375rem' }}>
              Quantity Volume *
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.5rem' }}>
              <input
                type="number"
                min="1"
                required
                className="form-input"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
              />
              <select
                className="form-select"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
              >
                <option value="t/month">t/month</option>
                <option value="kg/month">kg/month</option>
                <option value="kL/month">kL/month</option>
                <option value="m³/month">m³/month</option>
              </select>
            </div>
          </div>

          {/* Quality Grade */}
          <div className="form-field">
            <label className="label-caps" style={{ marginBottom: '0.375rem' }}>
              Quality Grade *
            </label>
            <select
              className="form-select"
              value={qualityGrade}
              onChange={(e) => setQualityGrade(e.target.value as QualityGrade)}
            >
              <option value="HIGH">High Grade (Clean, sorted, uniform)</option>
              <option value="MEDIUM">Medium Grade (Minor trace mix)</option>
              <option value="LOW">Low Grade (Unsorted / high moisture)</option>
            </select>
          </div>

          {/* Frequency */}
          <div className="form-field">
            <label className="label-caps" style={{ marginBottom: '0.375rem' }}>
              Generation / Demand Frequency *
            </label>
            <select
              className="form-select"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value as AvailabilityFrequency)}
            >
              <option value="CONTINUOUS">Continuous Daily</option>
              <option value="WEEKLY">Weekly Batch</option>
              <option value="MONTHLY">Monthly Regular</option>
              <option value="QUARTERLY">Quarterly</option>
              <option value="ONE_TIME">One-Time Lot</option>
            </select>
          </div>

          {/* Contact Person */}
          <div className="form-field">
            <label className="label-caps" style={{ marginBottom: '0.375rem' }}>
              Contact Person / Desk
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Operations Manager"
              value={contactPerson}
              onChange={(e) => setContactPerson(e.target.value)}
            />
          </div>

          {/* Detailed Description */}
          <div className="form-field form-field-full">
            <label className="label-caps" style={{ marginBottom: '0.375rem' }}>
              Material Description & Technical Notes
            </label>
            <textarea
              className="form-textarea"
              placeholder="Particle size, moisture content, packing type (jumbo bags/bulk tanker), contamination notes..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>

        {/* Hazmat & Compliance Checkbox Gate */}
        <div className="form-hazmat-box">
          {formType === 'SUPPLIER' ? (
            <div>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  style={{ marginTop: '0.25rem', accentColor: 'var(--primary)' }}
                  checked={isHazardous}
                  onChange={(e) => setIsHazardous(e.target.checked)}
                />
                <span style={{ fontSize: '0.875rem' }}>
                  <strong>This stream contains classified hazardous waste (CPCB/State PCB).</strong>
                  <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--muted-foreground)', marginTop: '0.125rem' }}>
                    Hazardous streams are automatically gated to receivers possessing valid hazmat handling authorizations.
                  </span>
                </span>
              </label>
            </div>
          ) : (
            <div>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  style={{ marginTop: '0.25rem', accentColor: 'var(--primary)' }}
                  checked={isHazmatLicensed}
                  onChange={(e) => setIsHazmatLicensed(e.target.checked)}
                />
                <span style={{ fontSize: '0.875rem' }}>
                  <strong>Facility holds valid hazardous waste handling authorization.</strong>
                  <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--muted-foreground)', marginTop: '0.125rem' }}>
                    Authorizes this facility to receive and co-process regulated hazardous by-product streams.
                  </span>
                </span>
              </label>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div style={{ marginTop: '1.5rem', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.75rem' }}>
          <button
            type="submit"
            disabled={isLoading}
            style={{
              backgroundColor: 'var(--primary)',
              color: 'var(--primary-foreground)',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              padding: '0.625rem 1.25rem',
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.7 : 1,
              transition: 'background-color 0.15s ease',
            }}
          >
            {isLoading
              ? 'Evaluating Pairs...'
              : formType === 'SUPPLIER'
              ? 'Publish Waste Listing & Find Matches'
              : 'Publish Material Demand & Find Suppliers'}
          </button>
        </div>
      </form>
    </div>
  );
}
