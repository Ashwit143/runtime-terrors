"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.evaluateHazardGate = evaluateHazardGate;
exports.evaluateMaterialGate = evaluateMaterialGate;
const matchingConfig_js_1 = require("../config/matchingConfig.js");
/**
 * Gate 1 — Hazard Check:
 * If waste is hazardous AND receiver is NOT hazmat-licensed -> exclude match entirely.
 */
function evaluateHazardGate(supplier, receiver) {
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
function evaluateMaterialGate(supplier, receiver) {
    const cfg = matchingConfig_js_1.MATCHING_CONFIG.materialCompatibility;
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
//# sourceMappingURL=preFilter.js.map