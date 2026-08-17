import { MATCHING_CONFIG } from '../config/matchingConfig.js';
import { Listing, MatchRecord } from '../types/index.js';
import { evaluateHazardGate, evaluateMaterialGate } from './preFilter.js';
import { scorePair } from './scoring.js';
import { applyPostFilterAndSort } from './postFilter.js';

export function calculateMatchImpact(supplier: Listing, receiver: Listing) {
  const category = supplier.category;
  const effectiveTonnes = Math.min(supplier.quantity, receiver.quantity);

  const costPerTonne =
    MATCHING_CONFIG.impactFactors.costSavedINRPerTonne[category] || 15000;
  const co2PerTonne =
    MATCHING_CONFIG.impactFactors.co2AvoidedPerTonne[category] || 1.5;
  const landfillRatio = MATCHING_CONFIG.impactFactors.landfillDiversionRatio;

  return {
    wasteDivertedTonnes: Number(effectiveTonnes.toFixed(1)),
    estimatedCostSavedINR: Math.round(effectiveTonnes * costPerTonne),
    co2AvoidedTons: Number((effectiveTonnes * co2PerTonne).toFixed(2)),
    landfillDivertedTonnes: Number((effectiveTonnes * landfillRatio).toFixed(1)),
  };
}

/**
 * Execute the complete matching pipeline for a target listing against a candidate pool:
 * 1. Gate 1: Hazard Check
 * 2. Gate 2: Material Compatibility Hard Gate
 * 3. 5-Factor Weighted Scoring
 * 4. Post-filter (Score >= 40)
 * 5. Rank Descending
 */
export function findMatchesForListing(
  targetListing: Listing,
  candidateListings: Listing[]
): MatchRecord[] {
  const isSupplier = targetListing.type === 'SUPPLIER';
  const matches: MatchRecord[] = [];

  for (const candidate of candidateListings) {
    // Only match supplier with receiver
    if (candidate.type === targetListing.type) {
      continue;
    }

    const supplier = isSupplier ? targetListing : candidate;
    const receiver = isSupplier ? candidate : targetListing;

    // Gate 1: Hazard Check
    const hazardGate = evaluateHazardGate(supplier, receiver);
    if (!hazardGate.isEligible) {
      continue; // Exclude entirely
    }

    // Gate 2: Material Compatibility Hard Gate
    const materialGate = evaluateMaterialGate(supplier, receiver);
    if (!materialGate.isEligible) {
      continue; // Exclude entirely - never calculate weighted score
    }

    // Calculate 5-Factor Scoring (only reached if both Gate 1 and Gate 2 pass)
    const score = scorePair(supplier, receiver);

    // Calculate Impact
    const impact = calculateMatchImpact(supplier, receiver);

    matches.push({
      matchId: `match_${supplier.id}_${receiver.id}`,
      supplier,
      receiver,
      score,
      impact,
    });
  }

  // Post-filter (< 40 exclusion) and sort descending
  return applyPostFilterAndSort(matches);
}
