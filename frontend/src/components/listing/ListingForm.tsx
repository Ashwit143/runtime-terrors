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
    <div className="listing-card">
      {/* Top Distinct Mode Switcher */}
      <div className="mode-toggle-group">
        <button
          type="button"
          className={`mode-toggle-btn ${isSupplier ? 'active-supplier' : ''}`}
          onClick={() => handleModeChange('SUPPLIER')}
        >
          <div className="mode-icon-box">
            <PackagePlus size={20} />
          </div>
          <div>
            <div className="mode-title">I Have Waste to Offer</div>
            <div className="mode-desc">List industrial byproduct or secondary material streams</div>
          </div>
        </button>

        <button
          type="button"
          className={`mode-toggle-btn ${!isSupplier ? 'active-receiver' : ''}`}
          onClick={() => handleModeChange('RECEIVER')}
        >
          <div className="mode-icon-box">
            <Truck size={20} />
          </div>
          <div>
            <div className="mode-title">I Need Material</div>
            <div className="mode-desc">Specify input raw material or secondary feedstock demand</div>
          </div>
        </button>
      </div>

      {/* Form Header */}
      <div style={{ marginBottom: '22px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
        <h3 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          {isSupplier ? 'Register Waste / Byproduct Offering' : 'Register Raw Material Demand'}
        </h3>
        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
          {isSupplier
            ? 'Provide specifications of your waste stream to identify qualified processing receivers.'
            : 'Specify required feedstock volumes and quality tolerances to match with certified suppliers.'}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          {/* Company Name */}
          <div className="form-group">
            <label className="form-label">{isSupplier ? 'Supplier Enterprise Name' : 'Receiver Enterprise Name'}</label>
            <input
              type="text"
              className="form-input"
              placeholder={isSupplier ? 'e.g. Aravalli Polymers Ltd' : 'e.g. Gujarat Circular Fibres Ltd'}
              value={companyName}
              onChange={e => setCompanyName(e.target.value)}
              required
            />
          </div>

          {/* Location */}
          <div className="form-group">
            <label className="form-label">Facility Location (Industrial Hub)</label>
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

          {/* Material Category */}
          <div className="form-group">
            <label className="form-label">{isSupplier ? 'Waste / Byproduct Category' : 'Required Material Category'}</label>
            <select
              className="form-select"
              value={category}
              onChange={e => setCategory(e.target.value as MaterialCategory)}
            >
              <option value="PLASTIC">Plastic (PET, HDPE, LDPE, PP Regrind)</option>
              <option value="TEXTILE">Textile (Cotton yarn drop, comber noil, synthetic fiber)</option>
              <option value="METAL">Metal (Aluminium extrusion, MS trimmings, copper)</option>
              <option value="FOOD_AGRO">Food & Agro (Paddy husk, bagasse, groundnut shells)</option>
              <option value="CHEMICAL">Chemical (Spent solvents, acids, industrial sludges)</option>
              <option value="RUBBER_MINERALS">Rubber & Minerals (Tire crumb, foundry slag)</option>
            </select>
          </div>

          {/* Specific Material Specification */}
          <div className="form-group">
            <label className="form-label">{isSupplier ? 'Material Name / Stream Description' : 'Required Feedstock Specification'}</label>
            <input
              type="text"
              className="form-input"
              placeholder={isSupplier ? 'e.g. Clean washed PET bottle flakes' : 'e.g. R-PET flakes for polyester staple yarn'}
              value={materialName}
              onChange={e => setMaterialName(e.target.value)}
              required
            />
          </div>

          {/* Quantity & Unit */}
          <div className="form-group">
            <label className="form-label">{isSupplier ? 'Offered Quantity' : 'Required Quantity'}</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 140px', gap: '8px' }}>
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
                className="form-select"
                value={unit}
                onChange={e => setUnit(e.target.value)}
              >
                <option value="tonnes/month">tonnes/month</option>
                <option value="tonnes/week">tonnes/week</option>
                <option value="tonnes/year">tonnes/year</option>
                <option value="tonnes (one-time)">tonnes (lot)</option>
              </select>
            </div>
          </div>

          {/* Quality Grade */}
          <div className="form-group">
            <label className="form-label">{isSupplier ? 'Offered Quality Grade' : 'Minimum Required Quality Grade'}</label>
            <select
              className="form-select"
              value={qualityGrade}
              onChange={e => setQualityGrade(e.target.value as QualityGrade)}
            >
              <option value="HIGH">High Grade (Pure segregated stream, minimal contamination)</option>
              <option value="MEDIUM">Medium Grade (Standard post-industrial byproduct)</option>
              <option value="LOW">Low Grade (Mixed composition, requires pre-treatment)</option>
            </select>
          </div>

          {/* Availability Frequency */}
          <div className="form-group">
            <label className="form-label">{isSupplier ? 'Availability Frequency' : 'Consumption Schedule'}</label>
            <select
              className="form-select"
              value={frequency}
              onChange={e => setFrequency(e.target.value as AvailabilityFrequency)}
            >
              <option value="CONTINUOUS">Continuous (Continuous production flow)</option>
              <option value="WEEKLY">Weekly (Regular scheduled deliveries)</option>
              <option value="MONTHLY">Monthly (Periodic batch lots)</option>
              <option value="QUARTERLY">Quarterly (Seasonal campaign)</option>
              <option value="ONE_TIME">One-Time (Spot surplus lot)</option>
            </select>
          </div>

          {/* Estimated Valuation */}
          <div className="form-group">
            <label className="form-label">{isSupplier ? 'Target Valuation (₹ INR / Tonne - Optional)' : 'Budget Ceiling (₹ INR / Tonne - Optional)'}</label>
            <input
              type="number"
              className="form-input"
              placeholder="e.g. 42000"
              value={pricePerUnit}
              onChange={e => setPricePerUnit(e.target.value)}
            />
          </div>

          {/* Conditional Compliance Controls */}
          {isSupplier ? (
            <div className="form-grid-full">
              <label className={`checkbox-group ${isHazardous ? 'danger-highlight' : ''}`}>
                <input
                  type="checkbox"
                  checked={isHazardous}
                  onChange={e => setIsHazardous(e.target.checked)}
                />
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <AlertTriangle size={14} color={isHazardous ? 'var(--score-low)' : 'var(--text-tertiary)'} />
                    Hazardous Waste Material (Class-A / Toxics)
                  </div>
                  <div className="form-hint">
                    Enforces Gate 1: Match will ONLY be evaluated against verified Hazmat-licensed receivers.
                  </div>
                </div>
              </label>
            </div>
          ) : (
            <div className="form-grid-full">
              <label className="checkbox-group">
                <input
                  type="checkbox"
                  checked={isHazmatLicensed}
                  onChange={e => setIsHazmatLicensed(e.target.checked)}
                />
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <ShieldCheck size={14} color={isHazmatLicensed ? 'var(--brand-gold-dark)' : 'var(--text-tertiary)'} />
                    Verified Hazmat Handling License (State Pollution Control Board)
                  </div>
                  <div className="form-hint">
                    Authorizes this facility to receive and process hazardous industrial chemicals/byproducts.
                  </div>
                </div>
              </label>
            </div>
          )}
        </div>

        {/* Action Button */}
        <div style={{ marginTop: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
            * Evaluates Gate 1 (Hazard), Gate 2 (Material Hard Gate), 5-factor scoring & threshold ≥ 40.
          </div>
          <button
            type="submit"
            className="btn-gold"
            disabled={isLoading}
            style={{ padding: '12px 24px' }}
          >
            {isLoading ? (
              'Processing Pipeline...'
            ) : (
              <>
                {isSupplier ? 'Find Qualified Receivers' : 'Find Qualified Suppliers'} <ArrowRight size={16} />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
