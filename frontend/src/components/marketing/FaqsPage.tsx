import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FaqItem {
  q: string;
  a: string;
}

const faqs: FaqItem[] = [
  {
    q: 'How is the match score calculated?',
    a: 'Every pairing is scored on five factors with fixed weights: Material Compatibility (35%), Transport Feasibility (25%), Quantity Fit (15%), Quality Match (15%), and Availability Frequency (10%). The weighted sum produces a transparent score from 0 to 100.',
  },
  {
    q: 'Why do some pairings never appear in the ranked list?',
    a: 'Two hard filters run before scoring: Gate 1 excludes any hazardous waste stream if the candidate receiver lacks a valid hazmat authorization. Gate 2 excludes material pairings with zero physical compatibility. Post-filter excludes pairings with total weighted scores under 40.',
  },
  {
    q: 'What do the score bands and colors indicate?',
    a: 'Scores of 70+ (Green/Forest) represent highly viable exchanges ready for direct commercial off-take. Scores of 40–69 (Amber/Blue) represent viable streams requiring minor logistics or volume adjustments. Scores below 40 are excluded.',
  },
  {
    q: 'How are hazardous and regulated by-products handled?',
    a: 'Suppliers explicitly flag hazardous classification codes upon listing. The matching engine strictly validates candidate receivers against statutory authorization requirements before computing any match score.',
  },
  {
    q: 'How does the platform handle quantity differences?',
    a: 'The quantity fit factor scores ratios of supply volume to demand capacity. Perfect parity (1.0x) yields 100 points, while under-supply or over-supply degrades smoothly based on buffer handling margins.',
  },
  {
    q: 'What datasets are included in this demonstration?',
    a: 'This prototype features real-world calibrated industrial listings modeled after major Indian manufacturing hubs (Surat, Ludhiana, Pune, Vapi, Salem, Ahmedabad) spanning plastics, metals, textiles, agro-biomass, and chemical sectors.',
  },
];

export function FaqsPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-header-container">
          <div>
            <p className="label-caps">Knowledge Base</p>
            <h1 className="page-header-title">Frequently Asked Questions</h1>
            <p className="page-header-desc">
              Understand the deterministic 5-factor scoring engine, compliance gates, and industrial exchange mechanics.
            </p>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '48rem', margin: '0 auto', padding: '2rem 1.5rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {faqs.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={item.q}
                className="card-soft"
                style={{ overflow: 'hidden' }}
              >
                <button
                  type="button"
                  onClick={() => toggle(index)}
                  style={{
                    width: '100%',
                    padding: '1rem 1.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem',
                    background: 'transparent',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                  }}
                >
                  <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--navy)' }}>
                    {item.q}
                  </span>
                  <ChevronDown
                    size={16}
                    style={{
                      color: 'var(--muted-foreground)',
                      transform: isOpen ? 'rotate(180deg)' : 'none',
                      transition: 'transform 0.2s ease',
                      flexShrink: 0,
                    }}
                  />
                </button>

                {isOpen && (
                  <div
                    style={{
                      padding: '0 1.25rem 1.25rem 1.25rem',
                      borderTop: '1px solid var(--border)',
                      fontSize: '0.8125rem',
                      lineHeight: 1.6,
                      color: 'var(--muted-foreground)',
                      backgroundColor: 'rgba(239, 242, 244, 0.3)',
                    }}
                  >
                    <p style={{ marginTop: '0.75rem' }}>{item.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
