import React, { useState } from 'react';
import {
  Listing,
  ListingType,
  MaterialCategory,
  QualityGrade,
  AvailabilityFrequency,
} from '../../types/index.js';
import {
  PackagePlus,
  Truck,
  AlertTriangle,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';

interface ListingFormProps {
  initialData?: Partial<Listing>;
  onSubmit: (listing: Partial<Listing>) => Promise<void>;
  isLoading?: boolean;
}

export const ListingForm: React.FC<ListingFormProps> = ({
  initialData,
  onSubmit,
  isLoading = false,
}) => {
  const [type, setType] = useState<ListingType>(initialData?.type || 'SUPPLIER');
  const [companyName, setCompanyName] = useState<string>(initialData?.companyName || '');
  const [category, setCategory] = useState<MaterialCategory>(initialData?.category || 'PLASTIC');
  const [materialName, setMaterialName] = useState<string>(initialData?.materialName || '');
  const [quantity, setQuantity] = useState<number>(initialData?.quantity || 25);
  const [unit, setUnit] = useState<string>(initialData?.unit || 'tonnes/month');
  const [qualityGrade, setQualityGrade] = useState<QualityGrade>(initialData?.qualityGrade || 'HIGH');
  const [city, setCity] = useState<string>(initialData?.city || 'Surat');
  const [frequency, setFrequency] = useState<AvailabilityFrequency>(initialData?.frequency || 'WEEKLY');
  const [isHazardous, setIsHazardous] = useState<boolean>(initialData?.isHazardous || false);
  const [isHazmatLicensed, setIsHazmatLicensed] = useState<boolean>(initialData?.isHazmatLicensed || false);
  const [pricePerUnit, setPricePerUnit] = useState<string>(initialData?.pricePerUnit ? String(initialData.pricePerUnit) : '');

  // Keep form synchronized when preset scenario loads
  React.useEffect(() => {
    if (initialData) {
      if (initialData.type) setType(initialData.type);
      if (initialData.companyName) setCompanyName(initialData.companyName);
      if (initialData.category) setCategory(initialData.category);
      if (initialData.materialName) setMaterialName(initialData.materialName);
      if (initialData.quantity) setQuantity(initialData.quantity);
      if (initialData.unit) setUnit(initialData.unit);
      if (initialData.qualityGrade) setQualityGrade(initialData.qualityGrade);
      if (initialData.city) setCity(initialData.city);
      if (initialData.frequency) setFrequency(initialData.frequency);
      if (initialData.isHazardous !== undefined) setIsHazardous(initialData.isHazardous);
      if (initialData.isHazmatLicensed !== undefined) setIsHazmatLicensed(initialData.isHazmatLicensed);
      if (initialData.pricePerUnit) setPricePerUnit(String(initialData.pricePerUnit));
    }
  }, [initialData]);

  // Mode switcher handler with clean state management
  const handleModeChange = (newType: ListingType) => {
    setType(newType);
    if (newType === 'SUPPLIER') {
      setIsHazmatLicensed(false);
    } else {
      setIsHazardous(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: Partial<Listing> = {
      type,
      companyName: companyName || (type === 'SUPPLIER' ? 'Apex Producer Enterprises' : 'Apex Processing Facility'),
      category,
      materialName: materialName || `${category} Grade Material`,
      quantity: Number(quantity),
      unit,
      qualityGrade,
      city,
      frequency,
      isHazardous: type === 'SUPPLIER' ? isHazardous : false,
      isHazmatLicensed: type === 'RECEIVER' ? isHazmatLicensed : false,
      pricePerUnit: pricePerUnit ? Number(pricePerUnit) : undefined,
    };
    onSubmit(payload);
  };

  const isSupplier = type === 'SUPPLIER';

  return (
    <div className="listing-form-wrapper">
      {/* 1. Segmented Control Mode Toggle */}
      <div className="form-mode-segmented-control">
        <button
          type="button"
          className={`form-mode-toggle-btn ${isSupplier ? 'active' : ''}`}
          onClick={() => handleModeChange('SUPPLIER')}
        >
          <PackagePlus size={15} />
          <span>I Have Waste to Offer</span>
        </button>

        <button
          type="button"
          className={`form-mode-toggle-btn ${!isSupplier ? 'active' : ''}`}
          onClick={() => handleModeChange('RECEIVER')}
        >
          <Truck size={15} />
          <span>I Need Material</span>
        </button>
      </div>

      {/* 2. Structured Form Container */}
      <div className="listing-card-inner">
        <div className="form-header-box">
          <h3 className="form-header-title">
            {isSupplier ? 'Register Industrial Waste Stream' : 'Register Raw Material Feedstock Demand'}
          </h3>
          <p className="form-header-sub">
            {isSupplier
              ? 'List your byproduct volume and quality specs to match with verified industrial receivers.'
              : 'Specify required feedstock parameters to match with certified waste producers.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="structured-listing-form">
          {/* Row 1 (Full): Company Name */}
          <div className="form-field-full">
            <label className="form-field-label">
              {isSupplier ? 'Supplier Enterprise Name' : 'Receiver Enterprise Name'}
            </label>
            <input
              type="text"
              className="form-input"
              placeholder={isSupplier ? 'e.g. Aravalli Polymers Ltd' : 'e.g. Gujarat Circular Fibres Ltd'}
              value={companyName}
              onChange={e => setCompanyName(e.target.value)}
              required
            />
          </div>

          {/* Row 2 (2-Col): Facility Location & Material Category */}
          <div className="form-field-col">
            <label className="form-field-label">Facility Location (Industrial Hub)</label>
            <select
              className="form-select"
              value={city}
              onChange={e => setCity(e.target.value)}
            >
              <option value="Surat">Surat (Gujarat)</option>
              <option value="Ahmedabad">Ahmedabad (Gujarat)</option>
              <option value="Vadodara">Vadodara (Gujarat)</option>
              <option value="Rajkot">Rajkot (Gujarat)</option>
              <option value="Mumbai">Mumbai (Maharashtra)</option>
              <option value="Pune">Pune (Maharashtra)</option>
              <option value="Nagpur">Nagpur (Maharashtra)</option>
              <option value="Delhi">Delhi NCR</option>
              <option value="Jaipur">Jaipur (Rajasthan)</option>
              <option value="Ludhiana">Ludhiana (Punjab)</option>
              <option value="Coimbatore">Coimbatore (Tamil Nadu)</option>
              <option value="Chennai">Chennai (Tamil Nadu)</option>
              <option value="Hyderabad">Hyderabad (Telangana)</option>
              <option value="Bengaluru">Bengaluru (Karnataka)</option>
              <option value="Indore">Indore (Madhya Pradesh)</option>
            </select>
          </div>

          <div className="form-field-col">
            <label className="form-field-label">
              {isSupplier ? 'Waste / Byproduct Category' : 'Material Category'}
            </label>
            <select
              className="form-select"
              value={category}
              onChange={e => setCategory(e.target.value as MaterialCategory)}
            >
              <option value="PLASTIC">Plastic (PET, HDPE, LDPE, PP)</option>
              <option value="TEXTILE">Textile (Cotton yarn, spinning drop, synthetics)</option>
              <option value="METAL">Metal (Aluminium, steel offcuts, copper)</option>
              <option value="FOOD_AGRO">Food & Agro (Paddy husk, straw, shells)</option>
              <option value="CHEMICAL">Chemical (Spent solvents, acids, sludges)</option>
              <option value="RUBBER_MINERALS">Rubber & Minerals (Tire crumb, foundry slag)</option>
            </select>
          </div>

          {/* Row 3 (2-Col): Material Description & Quantity */}
          <div className="form-field-col">
            <label className="form-field-label">
              {isSupplier ? 'Material Description / Stream Name' : 'Required Feedstock Description'}
            </label>
            <input
              type="text"
              className="form-input"
              placeholder={isSupplier ? 'e.g. Hot-washed clear PET bottle flakes' : 'e.g. R-PET flakes for polyester yarn'}
              value={materialName}
              onChange={e => setMaterialName(e.target.value)}
              required
            />
          </div>

          <div className="form-field-col">
            <label className="form-field-label">
              {isSupplier ? 'Offered Quantity' : 'Required Quantity'}
            </label>
            <div className="quantity-input-group">
              <input
                type="number"
                min="0.1"
                step="0.1"
                className="form-input"
                value={quantity}
                onChange={e => setQuantity(Number(e.target.value))}
                required
              />
              <select
                className="form-select qty-unit-select"
                value={unit}
                onChange={e => setUnit(e.target.value)}
              >
                <option value="tonnes/month">tonnes/month</option>
                <option value="tonnes/week">tonnes/week</option>
                <option value="tonnes/year">tonnes/year</option>
                <option value="tonnes (lot)">tonnes (lot)</option>
              </select>
            </div>
          </div>

          {/* Row 4 (2-Col): Quality Grade & Availability */}
          <div className="form-field-col">
            <label className="form-field-label">
              {isSupplier ? 'Offered Quality Grade' : 'Minimum Required Quality Grade'}
            </label>
            <select
              className="form-select"
              value={qualityGrade}
              onChange={e => setQualityGrade(e.target.value as QualityGrade)}
            >
              <option value="HIGH">High Grade (Clean, segregated stream)</option>
              <option value="MEDIUM">Medium Grade (Standard post-industrial byproduct)</option>
              <option value="LOW">Low Grade (Mixed composition, needs pre-treatment)</option>
            </select>
          </div>

          <div className="form-field-col">
            <label className="form-field-label">
              {isSupplier ? 'Availability Schedule' : 'Consumption Schedule'}
            </label>
            <select
              className="form-select"
              value={frequency}
              onChange={e => setFrequency(e.target.value as AvailabilityFrequency)}
            >
              <option value="CONTINUOUS">Continuous (Ongoing output)</option>
              <option value="WEEKLY">Weekly (Regular deliveries)</option>
              <option value="MONTHLY">Monthly (Periodic batch)</option>
              <option value="QUARTERLY">Quarterly (Seasonal campaign)</option>
              <option value="ONE_TIME">One-Time (Spot surplus)</option>
            </select>
          </div>

          {/* Row 5 (2-Col): Target Valuation & Compliance Checkbox */}
          <div className="form-field-col">
            <label className="form-field-label">
              {isSupplier ? 'Target Valuation (₹ / Tonne - Optional)' : 'Budget Ceiling (₹ / Tonne - Optional)'}
            </label>
            <input
              type="number"
              className="form-input"
              placeholder="e.g. 42000"
              value={pricePerUnit}
              onChange={e => setPricePerUnit(e.target.value)}
            />
          </div>

          <div className="form-field-col" style={{ display: 'flex', alignItems: 'flex-end' }}>
            {isSupplier ? (
              <label className={`form-checkbox-card ${isHazardous ? 'hazardous-selected' : ''}`}>
                <input
                  type="checkbox"
                  checked={isHazardous}
                  onChange={e => setIsHazardous(e.target.checked)}
                />
                <div>
                  <div className="checkbox-title">
                    <AlertTriangle size={13} color={isHazardous ? '#9F1239' : 'var(--text-tertiary)'} />
                    <span>Hazardous Material</span>
                  </div>
                  <div className="checkbox-desc">Requires Hazmat license (Gate 1)</div>
                </div>
              </label>
            ) : (
              <label className={`form-checkbox-card ${isHazmatLicensed ? 'hazmat-licensed' : ''}`}>
                <input
                  type="checkbox"
                  checked={isHazmatLicensed}
                  onChange={e => setIsHazmatLicensed(e.target.checked)}
                />
                <div>
                  <div className="checkbox-title">
                    <ShieldCheck size={13} color={isHazmatLicensed ? 'var(--brand-gold-dark)' : 'var(--text-tertiary)'} />
                    <span>SPCB Hazmat Licensed</span>
                  </div>
                  <div className="checkbox-desc">Authorized for hazardous waste</div>
                </div>
              </label>
            )}
          </div>

          {/* Row 6: Submit Action */}
          <div className="form-submit-row">
            <button
              type="submit"
              className="btn-primary form-cta-btn"
              disabled={isLoading}
            >
              {isLoading ? (
                'Processing 5-Factor Pipeline...'
              ) : (
                <>
                  {isSupplier ? 'Find Qualified Receivers' : 'Find Qualified Suppliers'} <ArrowRight size={15} />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
