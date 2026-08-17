import { Listing } from '../types/index.js';
import { MATCHING_CONFIG } from '../config/matchingConfig.js';

export interface GateEvaluationResult {
  isEligible: boolean;
  exclusionReason?: string;
  gate?: 'HAZARD_GATE' | 'MATERIAL_GATE';
}

/**
 * Gate 1 — Hazard Check:
 * If waste is hazardous AND receiver is NOT hazmat-licensed -> exclude match entirely.
 */
export function evaluateHazardGate(supplier: Listing, receiver: Listing): GateEvaluationResult {
  if (supplier.isHazardous && !receiver.isHazmatLicensed) {
    return {
      isEligible: false,
      gate: 'HAZARD_GATE',
      exclusionReason: 'Hazardous waste cannot be supplied to a receiver without verified Hazmat handling license.',
    };
  }

  return {
    isEligible: true,
  };
}

/**
 * Gate 2 — Material Compatibility Hard Gate:
 * Exact category -> 100
 * Adjacent category -> 50
 * No category compatibility -> 0 (EXCLUDE MATCH ENTIRELY)
 * Pairs with compatibility === 0 must NEVER reach weighted scoring.
 */
export function evaluateMaterialGate(supplier: Listing, receiver: Listing): GateEvaluationResult {
  const cfg = MATCHING_CONFIG.materialCompatibility;

  if (supplier.category === receiver.category) {
    return { isEligible: true };
  }

  const adjacentList = cfg.adjacencyMap[supplier.category] || [];
  if (adjacentList.includes(receiver.category)) {
    return { isEligible: true };
  }

  return {
    isEligible: false,
    gate: 'MATERIAL_GATE',
    exclusionReason: `Material categories (${supplier.category} vs ${receiver.category}) are incompatible. Hard gate exclusion.`,
  };
}
