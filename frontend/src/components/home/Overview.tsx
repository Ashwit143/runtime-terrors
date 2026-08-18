import React, { useState } from 'react';
import {
  ArrowRight,
  PlusCircle,
  Layers,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Mail,
  MapPin,
  Phone,
} from 'lucide-react';

interface OverviewProps {
  onNavigateToMatches: () => void;
  onNavigateToListing: () => void;
  totalListingsCount: number;
  totalMatchesCount: number;
}

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FAQItem[] = [
  {
    question: 'What is CircularMatch AI?',
    answer:
      'CircularMatch AI is an industrial waste-exchange matching platform that connects enterprises producing secondary byproducts with manufacturing facilities that require circular raw materials.',
  },
  {
    question: 'How are matches ranked?',
    answer:
      'Matches are evaluated through regulatory and material compatibility gates, scored across 5 weighted factors (35% Material Compatibility, 25% Transport Feasibility, 15% Quantity Fit, 15% Quality Match, 10% Availability Frequency), and ranked strictly descending by total score.',
  },
  {
    question: 'What determines the match score?',
    answer:
      'Every match score is calculated deterministically from physical properties, Great-Circle transit distances between industrial hubs, volume ratios, quality grades, and delivery schedules. There are no black-box AI recommendations.',
  },
  {
    question: 'What happens to incompatible materials?',
    answer:
      'Pairs with zero material compatibility or hazardous compliance mismatches are strictly excluded at Gate 1 (Hazard Check) and Gate 2 (Material Compatibility Gate) before any weighted scoring is calculated.',
  },
  {
    question: 'Is the data real?',
    answer:
      'The platform is populated with realistic synthetic Indian industrial data spanning major manufacturing hubs in Gujarat, Maharashtra, Delhi NCR, Tamil Nadu, and Punjab for prototype demonstration purposes.',
  },
  {
    question: 'How is environmental impact estimated?',
    answer:
      'Impact is quantified per tonne of diverted circular material using lifecycle emission offsets (tCO₂e), procurement cost savings (₹ INR), and a 92% direct landfill diversion ratio.',
  },
];

export const Overview: React.FC<OverviewProps> = ({
  onNavigateToMatches,
  onNavigateToListing,
  totalListingsCount,
  totalMatchesCount,
}) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="overview-container">
      {/* 1. HERO SECTION */}
      <section id="hero" className="overview-hero">
        <div className="overview-badge">
          <Sparkles size={13} color="var(--brand-gold-dark)" />
          <span>Industrial Resource Circularity</span>
        </div>

        <h1 className="overview-headline">
          Turn industrial waste into <span className="highlight-gold">productive resources</span>.
        </h1>

        <p className="overview-description">
          CircularMatch AI connects companies that have industrial waste with companies that need those materials using transparent, explainable matching.
        </p>

        <div className="overview-actions">
          <button className="btn-primary hero-btn" onClick={onNavigateToListing}>
            <PlusCircle size={15} />
            Create a Listing
          </button>

          <button className="btn-secondary hero-btn" onClick={onNavigateToMatches}>
            <Layers size={15} />
            Find Matches
            <ArrowRight size={14} />
          </button>
        </div>
      </section>

      {/* 2. SIMPLE PLATFORM STATISTICS */}
      <section className="overview-stats-grid">
        <div className="overview-stat-card">
          <div className="stat-num">{totalListingsCount || 16}+</div>
          <div className="stat-label">Enterprises Onboarded</div>
          <div className="stat-subtext">Across Gujarat, Maharashtra, NCR & Tamil Nadu hubs</div>
        </div>

        <div className="overview-stat-card">
          <div className="stat-num">
            340+ <span style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-secondary)' }}>Tonnes/mo</span>
          </div>
          <div className="stat-label">Circular Materials Listed</div>
          <div className="stat-subtext">Polymers, textile yarn waste, metals & biomass</div>
        </div>

        <div className="overview-stat-card">
          <div className="stat-num">{totalMatchesCount || 24}</div>
          <div className="stat-label">Viable Matches Found</div>
          <div className="stat-subtext">Pre-filtered and scored above 40 threshold</div>
        </div>
      </section>

      {/* 3. HOW CIRCULARMATCH WORKS */}
      <section className="overview-section">
        <div className="overview-section-header">
          <h2 className="overview-section-title">How CircularMatch AI Works</h2>
          <p className="overview-section-subtitle">
            A 3-step transparent matching pipeline designed for industrial precision.
          </p>
        </div>

        <div className="how-it-works-grid">
          <div className="how-step-card">
            <div className="how-step-number">01</div>
            <div className="how-step-title">List Waste or Demand</div>
            <p className="how-step-desc">
              Specify your material category, volume, quality grade, facility location, frequency, and hazmat compliance.
            </p>
          </div>

          <div className="how-step-card">
            <div className="how-step-number">02</div>
            <div className="how-step-title">2-Gate & 5-Factor Scoring</div>
            <p className="how-step-desc">
              Pairs pass Hazard and Material compatibility gates, then receive a deterministic score across 5 weighted factors.
            </p>
          </div>

          <div className="how-step-card">
            <div className="how-step-number">03</div>
            <div className="how-step-title">Inspect & Quantify Impact</div>
            <p className="how-step-desc">
              Explore the explainable Match DNA breakdown and track estimated carbon offsets, landfill diversion, and INR savings.
            </p>
          </div>
        </div>
      </section>

      {/* 4. ABOUT US SECTION */}
      <section id="about" className="overview-section">
        <div className="overview-section-header">
          <h2 className="overview-section-title">About Us</h2>
          <p className="overview-section-subtitle">
            Transparent resource exchange for the modern circular economy.
          </p>
        </div>

        <div className="about-card">
          <p style={{ fontSize: '14.5px', color: 'var(--text-primary)', lineHeight: 1.7, marginBottom: '12px' }}>
            <strong>CircularMatch AI</strong> connects companies that generate industrial waste with companies that can use those materials, creating economically useful and environmentally valuable resource exchanges.
          </p>
          <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Built for the <strong>IIC 3.0 Open Innovation Hackathon</strong>, CircularMatch AI replaces black-box recommendation models with 100% explainable, mathematically auditable scoring across material compatibility, transport logistics, volume ratios, quality grades, and delivery frequency.
          </p>
        </div>
      </section>

      {/* 5. FAQS SECTION (EXPANDABLE ACCORDION) */}
      <section id="faqs" className="overview-section">
        <div className="overview-section-header">
          <h2 className="overview-section-title">Frequently Asked Questions</h2>
          <p className="overview-section-subtitle">
            Common questions about CircularMatch AI, the matching logic, and impact estimation.
          </p>
        </div>

        <div className="faq-accordion-list">
          {FAQ_ITEMS.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div key={index} className={`faq-accordion-item ${isOpen ? 'open' : ''}`}>
                <button
                  className="faq-question-btn"
                  onClick={() => toggleFaq(index)}
                  aria-expanded={isOpen}
                >
                  <span className="faq-question-text">{faq.question}</span>
                  <span className="faq-icon-wrap">
                    {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </span>
                </button>

                {isOpen && (
                  <div className="faq-answer-box">
                    <p className="faq-answer-text">{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. CONTACT US SECTION */}
      <section id="contact" className="overview-section">
        <div className="overview-section-header">
          <h2 className="overview-section-title">Contact Us</h2>
          <p className="overview-section-subtitle">
            Reach out for prototype inquiries or hackathon evaluation support.
          </p>
        </div>

        <div className="contact-grid">
          <div className="contact-card">
            <div className="contact-icon-box">
              <Mail size={18} color="var(--brand-gold-dark)" />
            </div>
            <div className="contact-card-label">Email Support</div>
            <div className="contact-card-value">team@circularmatch.ai</div>
            <div className="contact-card-sub">Demo contact address</div>
          </div>

          <div className="contact-card">
            <div className="contact-icon-box">
              <MapPin size={18} color="var(--brand-gold-dark)" />
            </div>
            <div className="contact-card-label">Hackathon Hub</div>
            <div className="contact-card-value">JKLU Innovation Hub</div>
            <div className="contact-card-sub">Jaipur, Rajasthan, India</div>
          </div>

          <div className="contact-card">
            <div className="contact-icon-box">
              <Phone size={18} color="var(--brand-gold-dark)" />
            </div>
            <div className="contact-card-label">Demo Phone Line</div>
            <div className="contact-card-value">+91 (0141) 710-0100</div>
            <div className="contact-card-sub">Synthetic prototype number</div>
          </div>
        </div>
      </section>
    </div>
  );
};
