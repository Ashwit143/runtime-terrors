import React, { useState, useEffect } from 'react';
import { Header } from './components/layout/Header.js';
import { Sidebar } from './components/layout/Sidebar.js';
import { Footer } from './components/layout/Footer.js';
import { Overview } from './components/home/Overview.js';
import { ListingForm } from './components/listing/ListingForm.js';
import { MatchList } from './components/matches/MatchList.js';
import { ImpactDashboard } from './components/impact/ImpactDashboard.js';
import { EnterpriseDirectory } from './components/company/EnterpriseDirectory.js';
import { CompanyDetailModal } from './components/company/CompanyDetailModal.js';
import { AuthDemo } from './components/auth/AuthDemo.js';
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
import { Info } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'MATCHES' | 'LISTING' | 'IMPACT' | 'POOL' | 'AUTH'>('OVERVIEW');
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
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

  // Load initial platform data
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
      const simResult = await simulateMatches(listingData);
      setMatches(simResult.matches);

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

  // Handle top header section navigation (e.g. #about, #faqs, #contact)
  const handleNavigateToSection = (sectionId: string) => {
    setActiveTab('OVERVIEW');
    setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 50);
  };

  // Handle opening Auth demo page
  const handleOpenAuth = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setActiveTab('AUTH');
  };

  const selectedListingObject = selectedCompanyId
    ? listings.find(l => l.id === selectedCompanyId) || null
    : null;

  return (
    <div className="app-layout">
      {/* 1. Left Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab === 'AUTH' ? 'OVERVIEW' : activeTab}
        onSelectTab={tab => setActiveTab(tab)}
        matchesCount={matches.length}
        listingsCount={listings.length}
        selectedMatchesCount={selectedMatches.length}
        selectedScenarioId={selectedScenario.id}
        onSelectScenario={handleSelectScenario}
        onResetData={handleReset}
        isResetting={isResetting}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* 2. Main Content Wrapper */}
      <div className="app-main-wrapper">
        {/* Top Header */}
        <Header
          onNavigateToSection={handleNavigateToSection}
          onOpenAuth={handleOpenAuth}
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        />

        {/* Content Body */}
        <main className="main-content-area">
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

          {/* View: Auth Demo Notice Page */}
          {activeTab === 'AUTH' && (
            <AuthDemo
              mode={authMode}
              onBack={() => setActiveTab('OVERVIEW')}
            />
          )}

          {/* View: Home / Overview */}
          {activeTab === 'OVERVIEW' && (
            <Overview
              onNavigateToMatches={() => setActiveTab('MATCHES')}
              onNavigateToListing={() => setActiveTab('LISTING')}
              totalListingsCount={listings.length}
              totalMatchesCount={matches.length}
            />
          )}

          {/* View: Ranked Matches */}
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

          {/* View: Create Listing */}
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

          {/* View: Impact Dashboard */}
          {activeTab === 'IMPACT' && (
            <ImpactDashboard
              summary={impactSummary}
              selectedMatches={selectedMatches}
            />
          )}

          {/* View: Enterprise Directory (Two-Section Industrial Cards) */}
          {activeTab === 'POOL' && (
            <EnterpriseDirectory
              listings={listings}
              onSelectCompany={id => setSelectedCompanyId(id)}
            />
          )}
        </main>

        {/* 3. Global Footer (On all pages except AUTH demo) */}
        {activeTab !== 'AUTH' && (
          <Footer
            onNavigateTab={tab => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigateSection={handleNavigateToSection}
          />
        )}
      </div>

      {/* Progressive Disclosure Company Detail Modal */}
      <CompanyDetailModal
        listing={selectedListingObject}
        onClose={() => setSelectedCompanyId(null)}
      />
    </div>
  );
}
