import React, { useState, useEffect } from 'react';
import { Header } from './components/layout/Header.js';
import { Overview } from './components/home/Overview.js';
import { ListingForm } from './components/listing/ListingForm.js';
import { MatchList } from './components/matches/MatchList.js';
import { ImpactDashboard } from './components/impact/ImpactDashboard.js';
import { CompanyDetailModal } from './components/company/CompanyDetailModal.js';
import { DEMO_SCENARIOS } from './data/presetScenarios.js';
import {
  Listing,
  MatchRecord,
  ImpactSummary,
  DemoScenario,
} from './types/index.js';
import {
  getAllMatches,
  simulateMatches,
} from './api/matches.js';
import { getListings, createListing, resetDatabase } from './api/listings.js';
import { getImpactSummary } from './api/impact.js';
import {
  Home,
  Layers,
  PlusCircle,
  BarChart3,
  Building2,
  Info,
  MapPin,
  ArrowRight,
} from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'MATCHES' | 'LISTING' | 'IMPACT' | 'POOL'>('OVERVIEW');
  const [selectedScenario, setSelectedScenario] = useState<DemoScenario>(DEMO_SCENARIOS[0]);
  const [matches, setMatches] = useState<MatchRecord[]>([]);
  const [listings, setListings] = useState<Listing[]>([]);
  const [impactSummary, setImpactSummary] = useState<ImpactSummary>({
    totalMatchesCount: 0,
    totalWasteDivertedTonnes: 0,
    totalCostSavedINR: 0,
    totalCo2AvoidedTons: 0,
    totalLandfillDivertedTonnes: 0,
  });
  const [selectedMatches, setSelectedMatches] = useState<MatchRecord[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isResetting, setIsResetting] = useState<boolean>(false);
  const [systemMessage, setSystemMessage] = useState<string | null>(null);

  // Load initial data
  const loadPlatformData = async () => {
    try {
      setIsLoading(true);
      const [fetchedMatches, fetchedListings, fetchedImpact] = await Promise.all([
        getAllMatches(),
        getListings(),
        getImpactSummary(),
      ]);
      setMatches(fetchedMatches);
      setListings(fetchedListings);
      setImpactSummary(fetchedImpact);
    } catch (err) {
      console.error('Error fetching initial platform data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPlatformData();
  }, []);

  // Handle Scenario Preset Selection
  const handleSelectScenario = async (scenario: DemoScenario) => {
    setSelectedScenario(scenario);
    try {
      setIsLoading(true);
      const result = await simulateMatches(scenario.targetListing);
      setMatches(result.matches);
      setActiveTab('MATCHES');
      setSystemMessage(`Loaded scenario: "${scenario.name}". Evaluated through Gate 1 & Gate 2.`);
      setTimeout(() => setSystemMessage(null), 5000);
    } catch (err) {
      console.error('Failed to simulate scenario:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Listing Submission
  const handleListingSubmit = async (listingData: Partial<Listing>) => {
    try {
      setIsSubmitting(true);
      // 1. Simulate and get matches for new listing
      const simResult = await simulateMatches(listingData);
      setMatches(simResult.matches);

      // 2. Also register into backend store
      await createListing(listingData);
      const updatedListings = await getListings();
      setListings(updatedListings);

      setActiveTab('MATCHES');
      setSystemMessage(`Listing registered! Found ${simResult.matches.length} qualified matches passing all gates.`);
      setTimeout(() => setSystemMessage(null), 5000);
    } catch (err) {
      console.error('Error submitting listing:', err);
      alert('Failed to process listing. Please verify required fields.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Match Selection for Custom Impact
  const handleToggleSelectMatch = (match: MatchRecord) => {
    const exists = selectedMatches.some(m => m.matchId === match.matchId);
    if (exists) {
      setSelectedMatches(selectedMatches.filter(m => m.matchId !== match.matchId));
    } else {
      setSelectedMatches([...selectedMatches, match]);
    }
  };

  // Reset database
  const handleReset = async () => {
    try {
      setIsResetting(true);
      await resetDatabase();
      await loadPlatformData();
      setSelectedMatches([]);
      setSystemMessage('System restored to default Indian industrial seed dataset.');
      setTimeout(() => setSystemMessage(null), 4000);
    } catch (err) {
      console.error('Reset failed:', err);
    } finally {
      setIsResetting(false);
    }
  };

  const selectedListingObject = selectedCompanyId
    ? listings.find(l => l.id === selectedCompanyId) || null
    : null;

  return (
    <div className="app-container">
      {/* Top Header with Demo Preset Selector & Engine Health */}
      <Header
        selectedScenarioId={selectedScenario.id}
        onSelectScenario={handleSelectScenario}
        onResetData={handleReset}
        isResetting={isResetting}
      />

      {/* Navigation Tabs Bar */}
      <div className="nav-tabs-bar">
        <div className="nav-tabs-inner">
          <button
            className={`nav-tab-btn ${activeTab === 'OVERVIEW' ? 'active' : ''}`}
            onClick={() => setActiveTab('OVERVIEW')}
          >
            <Home size={15} />
            Overview
          </button>

          <button
            className={`nav-tab-btn ${activeTab === 'MATCHES' ? 'active' : ''}`}
            onClick={() => setActiveTab('MATCHES')}
          >
            <Layers size={15} />
            Ranked Matches
            <span className="nav-badge">{matches.length}</span>
          </button>

          <button
            className={`nav-tab-btn ${activeTab === 'LISTING' ? 'active' : ''}`}
            onClick={() => setActiveTab('LISTING')}
          >
            <PlusCircle size={15} />
            Create Waste / Demand Listing
          </button>

          <button
            className={`nav-tab-btn ${activeTab === 'IMPACT' ? 'active' : ''}`}
            onClick={() => setActiveTab('IMPACT')}
          >
            <BarChart3 size={15} />
            Impact Dashboard
            {selectedMatches.length > 0 && (
              <span className="nav-badge" style={{ background: 'var(--brand-gold)', color: '#FFFFFF', borderColor: 'var(--brand-gold)' }}>
                {selectedMatches.length} selected
              </span>
            )}
          </button>

          <button
            className={`nav-tab-btn ${activeTab === 'POOL' ? 'active' : ''}`}
            onClick={() => setActiveTab('POOL')}
          >
            <Building2 size={15} />
            Enterprise Directory
            <span className="nav-badge">{listings.length}</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="main-content">
        {/* System Notification Banner */}
        {systemMessage && (
          <div
            style={{
              background: '#FFFFFF',
              border: '1px solid var(--brand-gold-border)',
              borderRadius: 'var(--radius-sm)',
              padding: '12px 18px',
              marginBottom: '20px',
              fontSize: '13px',
              color: 'var(--brand-gold-dark)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <Info size={16} />
            {systemMessage}
          </div>
        )}

        {/* Tab 0: Overview / Home Page */}
        {activeTab === 'OVERVIEW' && (
          <Overview
            onNavigateToMatches={() => setActiveTab('MATCHES')}
            onNavigateToListing={() => setActiveTab('LISTING')}
            totalListingsCount={listings.length}
            totalMatchesCount={matches.length}
          />
        )}

        {/* Tab 1: Match Results */}
        {activeTab === 'MATCHES' && (
          <div>
            <div className="section-header">
              <div>
                <h2 className="section-title">Ranked Circular Waste Exchanges</h2>
                <div className="section-subtitle">
                  Pre-filtered by Hazard & Material compatibility gates, scored across 5 factors, thresholded (≥ 40).
                </div>
              </div>
            </div>

            <MatchList
              matches={matches}
              onSelectMatch={handleToggleSelectMatch}
              onViewCompanyDetails={id => setSelectedCompanyId(id)}
              selectedMatchIds={selectedMatches.map(m => m.matchId)}
              isLoading={isLoading}
            />
          </div>
        )}

        {/* Tab 2: Listing Form (One form at a time) */}
        {activeTab === 'LISTING' && (
          <div>
            <div className="section-header">
              <div>
                <h2 className="section-title">Industrial Waste & Demand Registration</h2>
                <div className="section-subtitle">
                  Select your mode below to register a byproduct stream or request input raw materials.
                </div>
              </div>
            </div>

            <ListingForm
              initialData={selectedScenario.targetListing}
              onSubmit={handleListingSubmit}
              isLoading={isSubmitting}
            />
          </div>
        )}

        {/* Tab 3: Impact Dashboard */}
        {activeTab === 'IMPACT' && (
          <ImpactDashboard
            summary={impactSummary}
            selectedMatches={selectedMatches}
          />
        )}

        {/* Tab 4: Compact Enterprise Directory (Click for details) */}
        {activeTab === 'POOL' && (
          <div>
            <div className="section-header">
              <div>
                <h2 className="section-title">Registered Enterprise Directory</h2>
                <div className="section-subtitle">
                  Click any facility card below to inspect full technical specifications, logistics parameters, and contact info.
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
              {listings.map(item => (
                <div
                  key={item.id}
                  className="company-card-compact"
                  onClick={() => setSelectedCompanyId(item.id)}
                >
                  <div>
                    <div className="company-card-top">
                      <span
                        className="match-badge"
                        style={{
                          background: item.type === 'SUPPLIER' ? 'var(--brand-gold-bg)' : 'rgba(23, 23, 23, 0.05)',
                          borderColor: item.type === 'SUPPLIER' ? 'var(--brand-gold-border)' : 'var(--border-default)',
                          color: item.type === 'SUPPLIER' ? 'var(--brand-gold-dark)' : 'var(--text-primary)',
                        }}
                      >
                        {item.type === 'SUPPLIER' ? 'Waste Supplier' : 'Material Receiver'}
                      </span>
                      <span style={{ fontSize: '11px', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
                        {item.category}
                      </span>
                    </div>

                    <div className="company-card-name" style={{ marginTop: '8px' }}>
                      {item.companyName}
                    </div>

                    <div className="company-card-city">
                      <MapPin size={12} color="var(--brand-gold-dark)" />
                      <span>{item.city}</span>
                      <span style={{ color: 'var(--border-strong)' }}>·</span>
                      <span>{item.quantity} {item.unit}</span>
                    </div>

                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '6px' }}>
                      {item.materialName}
                    </div>
                  </div>

                  <div className="company-card-footer">
                    <span>{item.qualityGrade} Grade</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                      View details <ArrowRight size={12} />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Progressive Disclosure Company Detail Modal */}
      <CompanyDetailModal
        listing={selectedListingObject}
        onClose={() => setSelectedCompanyId(null)}
      />
    </div>
  );
}
