"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MATCHING_CONFIG = void 0;
exports.MATCHING_CONFIG = {
    // Factor Weights (must sum to 1.0 / 100%)
    weights: {
        materialCompatibility: 0.35,
        transportFeasibility: 0.25,
        quantityFit: 0.15,
        qualityMatch: 0.15,
        availabilityFrequency: 0.10,
    },
    // Minimum overall score threshold to return a match
    thresholds: {
        minPassingScore: 40, // Matches < 40 are excluded
        highCompatibilityThreshold: 70, // >= 70 is High (Green), 40-69 is Moderate (Amber)
    },
    // Material Compatibility Configuration
    materialCompatibility: {
        exactScore: 100,
        adjacentScore: 50,
        incompatibleScore: 0,
        // Adjacency bidirectional map
        adjacencyMap: {
            PLASTIC: ['TEXTILE', 'RUBBER_MINERALS'],
            TEXTILE: ['PLASTIC'],
            METAL: [],
            FOOD_AGRO: ['CHEMICAL'],
            CHEMICAL: ['FOOD_AGRO'],
            RUBBER_MINERALS: ['PLASTIC'],
        },
    },
    // Transport Feasibility Piecewise Breakpoints
    transportFeasibility: {
        breakpoints: [
            { minKm: 0, maxKm: 100, startScore: 100, endScore: 90 },
            { minKm: 100, maxKm: 500, startScore: 90, endScore: 60 },
            { minKm: 500, maxKm: 1500, startScore: 60, endScore: 15 },
        ],
        maxDistanceFloorScore: 5, // For distances > 1500 km
    },
    // Quantity Fit Scoring Curve Constants
    quantityFit: {
        idealRatio: 1.0,
        idealScore: 100,
        undersupplyCutoffRatio: 0.5, // <= 0.5 yields 0
        oversupplyCutoffRatio: 3.0, // >= 3.0 yields 0
    },
    // Quality Tier Mappings and Penalties
    qualityMatch: {
        tierValues: {
            LOW: 1,
            MEDIUM: 2,
            HIGH: 3,
        },
        // When supplier quality >= receiver requirement
        overshootPenaltyPerTier: 12.5,
        // When supplier quality < receiver requirement (severe undershoot penalty)
        undershootPenaltyPerTier: 70.0,
    },
    // Availability Frequency Base Scores
    availabilityFrequency: {
        frequencyScores: {
            CONTINUOUS: 100,
            WEEKLY: 100,
            MONTHLY: 80,
            QUARTERLY: 50,
            ONE_TIME: 20,
        },
    },
    // Environmental & Economic Impact Estimation Constants (per tonne of diverted waste)
    impactFactors: {
        co2AvoidedPerTonne: {
            PLASTIC: 1.85, // tCO2e per tonne of recycled plastic
            TEXTILE: 2.40, // tCO2e per tonne of circular textile
            METAL: 4.10, // tCO2e per tonne of recycled metal (steel/aluminium)
            FOOD_AGRO: 0.95, // tCO2e per tonne of diverted agro/biomass
            CHEMICAL: 1.60, // tCO2e per tonne of re-refined solvents/chemicals
            RUBBER_MINERALS: 1.20,
        },
        costSavedINRPerTonne: {
            PLASTIC: 18500, // ₹ saved per tonne vs virgin resin
            TEXTILE: 24000, // ₹ saved per tonne vs virgin cotton/polyester
            METAL: 42000, // ₹ saved per tonne vs virgin ore/ingots
            FOOD_AGRO: 4500, // ₹ saved per tonne biomass vs fossil fuel
            CHEMICAL: 32000, // ₹ saved per tonne reclaimed solvent
            RUBBER_MINERALS: 9000,
        },
        landfillDiversionRatio: 0.92, // 92% of matched material directly diverted from landfills
    },
};
//# sourceMappingURL=matchingConfig.js.map