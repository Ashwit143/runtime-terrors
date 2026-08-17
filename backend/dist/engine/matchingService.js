"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateMatchImpact = calculateMatchImpact;
exports.findMatchesForListing = findMatchesForListing;
const matchingConfig_js_1 = require("../config/matchingConfig.js");
const preFilter_js_1 = require("./preFilter.js");
const scoring_js_1 = require("./scoring.js");
const postFilter_js_1 = require("./postFilter.js");
function calculateMatchImpact(supplier, receiver) {
    const category = supplier.category;
    const effectiveTonnes = Math.min(supplier.quantity, receiver.quantity);
    const costPerTonne = matchingConfig_js_1.MATCHING_CONFIG.impactFactors.costSavedINRPerTonne[category] || 15000;
    const co2PerTonne = matchingConfig_js_1.MATCHING_CONFIG.impactFactors.co2AvoidedPerTonne[category] || 1.5;
    const landfillRatio = matchingConfig_js_1.MATCHING_CONFIG.impactFactors.landfillDiversionRatio;
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
function findMatchesForListing(targetListing, candidateListings) {
    const isSupplier = targetListing.type === 'SUPPLIER';
    const matches = [];
    for (const candidate of candidateListings) {
        // Only match supplier with receiver
        if (candidate.type === targetListing.type) {
            continue;
        }
        const supplier = isSupplier ? targetListing : candidate;
        const receiver = isSupplier ? candidate : targetListing;
        // Gate 1: Hazard Check
        const hazardGate = (0, preFilter_js_1.evaluateHazardGate)(supplier, receiver);
        if (!hazardGate.isEligible) {
            continue; // Exclude entirely
        }
        // Gate 2: Material Compatibility Hard Gate
        const materialGate = (0, preFilter_js_1.evaluateMaterialGate)(supplier, receiver);
        if (!materialGate.isEligible) {
            continue; // Exclude entirely - never calculate weighted score
        }
        // Calculate 5-Factor Scoring (only reached if both Gate 1 and Gate 2 pass)
        const score = (0, scoring_js_1.scorePair)(supplier, receiver);
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
    return (0, postFilter_js_1.applyPostFilterAndSort)(matches);
}
//# sourceMappingURL=matchingService.js.map