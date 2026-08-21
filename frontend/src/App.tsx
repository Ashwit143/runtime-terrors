import React, { useState, useEffect } from 'react';
import { Header } from './components/layout/Header.js';
import { Sidebar } from './components/layout/Sidebar.js';
import { Footer } from './components/layout/Footer.js';
import { Overview } from './components/home/Overview.js';
import { MatchList } from './components/matches/MatchList.js';
import { ListingForm } from './components/listing/ListingForm.js';
import { ImpactDashboard } from './components/impact/ImpactDashboard.js';
import { EnterpriseDirectory } from './components/company/EnterpriseDirectory.js';
import { CompanyDetailModal } from './components/company/CompanyDetailModal.js';
import { AboutPage } from './components/marketing/AboutPage.js';
import { FaqsPage } from './components/marketing/FaqsPage.js';
import { ContactPage } from './components/marketing/ContactPage.js';
import { AuthDemo } from './components/auth/AuthDemo.js';
import { Listing, MatchRecord, ImpactSummary } from './types/index.js';
import { getAllMatches, simulateMatches } from './api/matches.js';
import { getListings, createListing } from './api/listings.js';
import { getImpactSummary } from './api/impact.js';
import { CheckCircle2 } from 'lucide-react';

export type AppTab =
  | 'OVERVIEW'
  | 'MATCHES'
  | 'LISTING'
  | 'IMPACT'
  | 'DIRECTORY'
  | 'ABOUT'
  | 'FAQS'
  | 'CONTACT'
  | 'AUTH';

export function App() {
  const [activeTab, setActiveTab] = useState<AppTab>('OVERVIEW');
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Platform Data from Real Backend
  const [matches, setMatches] = useState<MatchRecord[]>([]);
  const [listings, setListings] = useState<Listing[]>([]);
  const [impactSummary, setImpactSummary] = useState<ImpactSummary>({
    totalMatchesCount: 0,
    totalWasteDivertedTonnes: 0,
    totalCostSavedINR: 0,
    totalCo2AvoidedTons: 0,
    totalLandfillDivertedTonnes: 0,
  });

  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load platform data on mount
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
      console.error('Failed to load platform data from backend:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPlatformData();
  }, []);

  // Handle new listing registration and live simulation
  const handleListingSubmit = async (listingData: Partial<Listing>) => {
    try {
      setIsSubmitting(true);
      
      // 1. Simulate matches with real 5-factor backend engine
      const simResult = await simulateMatches(listingData);
      setMatches(simResult.matches);

      // 2. Persist listing to backend database
      await createListing(listingData);
      const updatedListings = await getListings();
      setListings(updatedListings);

      // 3. Switch to Ranked Matches and alert user
      setActiveTab('MATCHES');
      setToastMessage(`Listing published! Found ${simResult.matches.length} qualified exchange matches.`);
      setTimeout(() => setToastMessage(null), 5000);
    } catch (err) {
      console.error('Error processing listing:', err);
      alert('Failed to process listing. Please check the required fields.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Navigate tab & scroll top
  const handleNavigateTab = (tabId: string) => {
    setActiveTab(tabId as AppTab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Open Auth demo
  const handleOpenAuth = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setActiveTab('AUTH');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Selected company object for modal
  const selectedListingObject = selectedCompanyId
    ? listings.find((l) => l.id === selectedCompanyId) || null
    : null;

  return (
    <div className="app-layout">
      {/* 1. Sidebar Navigation (Pure B2B Platform) */}
      <Sidebar
        activeTab={activeTab === 'AUTH' ? 'OVERVIEW' : activeTab}
        onSelectTab={handleNavigateTab}
        matchesCount={matches.length}
        listingsCount={listings.length}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* 2. Main Area */}
      <div className="app-main-wrapper">
        <Header
          activeTab={activeTab}
          onNavigateTab={handleNavigateTab}
          onOpenAuth={handleOpenAuth}
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        />

        <main className="main-content-area">
          {/* Toast Notification */}
          {toastMessage && (
            <div
              style={{
                margin: '1rem 1.5rem 0 1.5rem',
                backgroundColor: 'var(--surface)',
                border: '1px solid var(--border-strong)',
                borderLeft: '4px solid var(--primary)',
                borderRadius: 'var(--radius-md)',
                padding: '0.75rem 1rem',
                fontSize: '0.8125rem',
                color: 'var(--navy)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <CheckCircle2 size={16} style={{ color: 'var(--primary)' }} />
              {toastMessage}
            </div>
          )}

          {/* View: Auth Demo */}
          {activeTab === 'AUTH' && (
            <AuthDemo
              mode={authMode}
              onBack={() => setActiveTab('OVERVIEW')}
              onEnterWorkspace={() => setActiveTab('MATCHES')}
            />
          )}

          {/* View: Home / Overview */}
          {activeTab === 'OVERVIEW' && (
            <Overview
              onNavigateToMatches={() => handleNavigateTab('MATCHES')}
              onNavigateToListing={() => handleNavigateTab('LISTING')}
              onNavigateToImpact={() => handleNavigateTab('IMPACT')}
            />
          )}

          {/* View: Ranked Matches */}
          {activeTab === 'MATCHES' && (
            <div>
              <div className="page-header">
                <div className="page-header-container">
                  <div>
                    <p className="label-caps">Deterministic Matching Engine</p>
                    <h1 className="page-header-title">Ranked Circular Waste Exchanges</h1>
                    <p className="page-header-desc">
                      Pairings sorted by weighted score across 5 deterministic factors. Hazardous streams without licensed receivers and incompatible materials are pre-filtered; scores below 40 are excluded.
                    </p>
                  </div>
                </div>
              </div>

              <MatchList
                matches={matches}
                onViewCompanyDetails={(id) => setSelectedCompanyId(id)}
                isLoading={isLoading}
              />
            </div>
          )}

          {/* View: Create Listing */}
          {activeTab === 'LISTING' && (
            <div>
              <div className="page-header">
                <div className="page-header-container">
                  <div>
                    <p className="label-caps">By-Product & Material Registry</p>
                    <h1 className="page-header-title">Create Industrial Listing</h1>
                    <p className="page-header-desc">
                      Select your mode below to register a by-product stream or request secondary raw materials.
                    </p>
                  </div>
                </div>
              </div>

              <ListingForm
                onSubmit={handleListingSubmit}
                isLoading={isSubmitting}
              />
            </div>
          )}

          {/* View: Impact Dashboard */}
          {activeTab === 'IMPACT' && (
            <ImpactDashboard
              summary={impactSummary}
            />
          )}

          {/* View: Enterprise Directory */}
          {activeTab === 'DIRECTORY' && (
            <EnterpriseDirectory
              listings={listings}
              onSelectCompany={(id) => setSelectedCompanyId(id)}
            />
          )}

          {/* View: About Us */}
          {activeTab === 'ABOUT' && <AboutPage />}

          {/* View: FAQs */}
          {activeTab === 'FAQS' && <FaqsPage />}

          {/* View: Contact Us */}
          {activeTab === 'CONTACT' && <ContactPage />}
        </main>

        {/* 3. Global Footer (Excluded on Auth Demo) */}
        {activeTab !== 'AUTH' && (
          <Footer onNavigateTab={handleNavigateTab} />
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
