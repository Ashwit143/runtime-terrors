"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateMaterialCompatibility = calculateMaterialCompatibility;
exports.calculateTransportFeasibility = calculateTransportFeasibility;
exports.calculateQuantityFit = calculateQuantityFit;
exports.calculateQualityMatch = calculateQualityMatch;
exports.calculateAvailabilityFrequency = calculateAvailabilityFrequency;
exports.scorePair = scorePair;
const matchingConfig_js_1 = require("../config/matchingConfig.js");
const indianCities_js_1 = require("../data/indianCities.js");
/**
 * Material Compatibility Factor (Weight: 35%)
 */
function calculateMaterialCompatibility(supplier, receiver) {
    const weight = matchingConfig_js_1.MATCHING_CONFIG.weights.materialCompatibility;
    const cfg = matchingConfig_js_1.MATCHING_CONFIG.materialCompatibility;
    let rawScore = cfg.incompatibleScore;
    let explanation = '';
    if (supplier.category === receiver.category) {
        rawScore = cfg.exactScore;
        explanation = `Exact category match (${supplier.category}): Material streams align directly for closed-loop or secondary circular recycling.`;
    }
    else {
        const adjacentList = cfg.adjacencyMap[supplier.category] || [];
        if (adjacentList.includes(receiver.category)) {
            rawScore = cfg.adjacentScore;
            explanation = `Adjacent category stream (${supplier.category} ↔ ${receiver.category}): Material can be reprocessed with standard pre-treatment or secondary blending.`;
        }
        else {
            rawScore = cfg.incompatibleScore;
            explanation = `Incompatible material categories (${supplier.category} vs ${receiver.category}).`;
        }
    }
    const contribution = Number((rawScore * weight).toFixed(2));
    return {
        name: 'Material Compatibility',
        key: 'materialCompatibility',
        rawScore,
        weight,
        contribution,
        explanation,
        metadata: {
            supplierCategory: supplier.category,
            receiverCategory: receiver.category,
            supplierMaterial: supplier.materialName,
            receiverMaterial: receiver.materialName,
        },
    };
}
/**
 * Transport Feasibility Factor (Weight: 25%)
 * Piecewise linear interpolation based on real distance (km)
 */
function calculateTransportFeasibility(supplier, receiver) {
    const weight = matchingConfig_js_1.MATCHING_CONFIG.weights.transportFeasibility;
    const distanceKm = (0, indianCities_js_1.calculateDistanceKm)(supplier.city, receiver.city);
    const { breakpoints, maxDistanceFloorScore } = matchingConfig_js_1.MATCHING_CONFIG.transportFeasibility;
    let rawScore = maxDistanceFloorScore;
    for (const bp of breakpoints) {
        if (distanceKm >= bp.minKm && distanceKm <= bp.maxKm) {
            const range = bp.maxKm - bp.minKm;
            const progress = (distanceKm - bp.minKm) / range;
            rawScore = bp.startScore - progress * (bp.startScore - bp.endScore);
            break;
        }
    }
    if (distanceKm > breakpoints[breakpoints.length - 1].maxKm) {
        rawScore = maxDistanceFloorScore;
    }
    rawScore = Number(rawScore.toFixed(1));
    const contribution = Number((rawScore * weight).toFixed(2));
    let explanation = '';
    if (distanceKm <= 100) {
        explanation = `Intra-hub transit (${distanceKm} km from ${supplier.city} to ${receiver.city}). Exceptional logistics margin and minimal transit emissions.`;
    }
    else if (distanceKm <= 500) {
        explanation = `Regional transit (${distanceKm} km from ${supplier.city} to ${receiver.city}). Cost-effective road freight route within standard industrial corridors.`;
    }
    else if (distanceKm <= 1500) {
        explanation = `Inter-state haul (${distanceKm} km from ${supplier.city} to ${receiver.city}). Feasible for bulk or high-value circular raw materials.`;
    }
    else {
        explanation = `Long-haul transit (${distanceKm} km from ${supplier.city} to ${receiver.city}). Higher logistics footprint; recommended for specialized consolidation.`;
    }
    return {
        factor: {
            name: 'Transport Feasibility',
            key: 'transportFeasibility',
            rawScore,
            weight,
            contribution,
            explanation,
            metadata: {
                distanceKm,
                supplierCity: supplier.city,
                receiverCity: receiver.city,
            },
        },
        distanceKm,
    };
}
/**
 * Quantity Fit Factor (Weight: 15%)
 * Asymmetric piecewise curve:
 * - ratio 0.4 -> 0
 * - ratio 0.75 -> 50
 * - ratio 1.0 -> 100
 * - ratio 2.0 -> 50
 * - ratio 3.5 -> 0
 */
function calculateQuantityFit(supplier, receiver) {
    const weight = matchingConfig_js_1.MATCHING_CONFIG.weights.quantityFit;
    const cfg = matchingConfig_js_1.MATCHING_CONFIG.quantityFit;
    const offered = supplier.quantity;
    const needed = receiver.quantity;
    const ratio = needed > 0 ? offered / needed : 0;
    let rawScore = 0;
    if (ratio === cfg.idealRatio) {
        rawScore = cfg.idealScore;
    }
    else if (ratio < cfg.idealRatio) {
        // Undersupply side: steep drop from 1.0 down to 0.5
        if (ratio <= cfg.undersupplyCutoffRatio) {
            rawScore = 0;
        }
        else {
            rawScore = ((ratio - cfg.undersupplyCutoffRatio) / (cfg.idealRatio - cfg.undersupplyCutoffRatio)) * cfg.idealScore;
        }
    }
    else {
        // Oversupply side: gradual decay from 1.0 up to 3.0
        if (ratio >= cfg.oversupplyCutoffRatio) {
            rawScore = 0;
        }
        else {
            rawScore = cfg.idealScore - ((ratio - cfg.idealRatio) / (cfg.oversupplyCutoffRatio - cfg.idealRatio)) * cfg.idealScore;
        }
    }
    rawScore = Math.max(0, Math.min(100, Number(rawScore.toFixed(1))));
    const contribution = Number((rawScore * weight).toFixed(2));
    let explanation = '';
    if (ratio === 1.0) {
        explanation = `Perfect 1:1 volume alignment (${offered} ${supplier.unit} offered vs ${needed} ${receiver.unit} needed).`;
    }
    else if (ratio < 1.0) {
        const pct = Math.round(ratio * 100);
        explanation = `Offered volume (${offered} ${supplier.unit}) covers ${pct}% of receiver demand (${needed} ${receiver.unit}) — partial batch fulfillment.`;
    }
    else {
        explanation = `Offered volume (${offered} ${supplier.unit}) is ${ratio.toFixed(1)}x receiver capacity (${needed} ${receiver.unit}) — manageable excess batch.`;
    }
    return {
        factor: {
            name: 'Quantity Fit',
            key: 'quantityFit',
            rawScore,
            weight,
            contribution,
            explanation,
            metadata: {
                ratio: Number(ratio.toFixed(2)),
                offered,
                needed,
                unit: supplier.unit,
            },
        },
        quantityRatio: Number(ratio.toFixed(2)),
    };
}
/**
 * Quality Match Factor (Weight: 15%)
 * Asymmetric quality tiers:
 * - Low = 1, Medium = 2, High = 3
 * - If supplier >= receiver: 100 - diff * 12.5
 * - If supplier < receiver: max(0, 100 - |diff| * 70)
 */
function calculateQualityMatch(supplier, receiver) {
    const weight = matchingConfig_js_1.MATCHING_CONFIG.weights.qualityMatch;
    const cfg = matchingConfig_js_1.MATCHING_CONFIG.qualityMatch;
    const sTier = cfg.tierValues[supplier.qualityGrade] || 1;
    const rTier = cfg.tierValues[receiver.qualityGrade] || 1;
    const tierDiff = sTier - rTier;
    let rawScore = 0;
    let explanation = '';
    if (tierDiff >= 0) {
        // Supplier meets or exceeds required quality
        rawScore = 100 - tierDiff * cfg.overshootPenaltyPerTier;
        if (tierDiff === 0) {
            explanation = `Exact quality grade match (${supplier.qualityGrade}): Meets exact technical specification without processing overhead.`;
        }
        else {
            explanation = `Premium grade offered (${supplier.qualityGrade} vs ${receiver.qualityGrade} required): Readily accepted with higher yield.`;
        }
    }
    else {
        // Supplier undershoots receiver required quality (severe penalty)
        rawScore = Math.max(0, 100 - Math.abs(tierDiff) * cfg.undershootPenaltyPerTier);
        explanation = `Quality deficit (${supplier.qualityGrade} offered vs ${receiver.qualityGrade} required): Requires grading/enrichment or secondary downgrade.`;
    }
    rawScore = Math.max(0, Math.min(100, Number(rawScore.toFixed(1))));
    const contribution = Number((rawScore * weight).toFixed(2));
    return {
        factor: {
            name: 'Quality Match',
            key: 'qualityMatch',
            rawScore,
            weight,
            contribution,
            explanation,
            metadata: {
                supplierQuality: supplier.qualityGrade,
                receiverQuality: receiver.qualityGrade,
                tierDiff,
            },
        },
        qualityTierDiff: tierDiff,
    };
}
/**
 * Availability Frequency Factor (Weight: 10%)
 */
function calculateAvailabilityFrequency(supplier, receiver) {
    const weight = matchingConfig_js_1.MATCHING_CONFIG.weights.availabilityFrequency;
    const cfg = matchingConfig_js_1.MATCHING_CONFIG.availabilityFrequency;
    const rawScore = cfg.frequencyScores[supplier.frequency] ?? 50;
    const contribution = Number((rawScore * weight).toFixed(2));
    let explanation = '';
    switch (supplier.frequency) {
        case 'CONTINUOUS':
        case 'WEEKLY':
            explanation = `Predictable, high-frequency stream (${supplier.frequency.toLowerCase()}): Ideal for continuous production line integration.`;
            break;
        case 'MONTHLY':
            explanation = `Regular periodic batch (${supplier.frequency.toLowerCase()}): Suitable for scheduled campaign production.`;
            break;
        case 'QUARTERLY':
            explanation = `Periodic batch stream (${supplier.frequency.toLowerCase()}): Requires periodic warehousing buffer.`;
            break;
        case 'ONE_TIME':
        default:
            explanation = `Spot / one-time lot (${supplier.frequency.toLowerCase()}): Suitable for ad-hoc spot utilization.`;
            break;
    }
    return {
        name: 'Availability Frequency',
        key: 'availabilityFrequency',
        rawScore,
        weight,
        contribution,
        explanation,
        metadata: {
            frequency: supplier.frequency,
        },
    };
}
/**
 * Master Scoring Function for a Supplier <-> Receiver pair
 */
function scorePair(supplier, receiver) {
    const materialCompatibility = calculateMaterialCompatibility(supplier, receiver);
    const { factor: transportFeasibility, distanceKm } = calculateTransportFeasibility(supplier, receiver);
    const { factor: quantityFit, quantityRatio } = calculateQuantityFit(supplier, receiver);
    const { factor: qualityMatch, qualityTierDiff } = calculateQualityMatch(supplier, receiver);
    const availabilityFrequency = calculateAvailabilityFrequency(supplier, receiver);
    const factors = [
        materialCompatibility,
        transportFeasibility,
        quantityFit,
        qualityMatch,
        availabilityFrequency,
    ];
    // Calculate weighted sum programmatically
    const weightedSum = factors.reduce((acc, f) => acc + f.contribution, 0);
    const overallScore = Number(Math.max(0, Math.min(100, weightedSum)).toFixed(1));
    return {
        overallScore,
        materialCompatibility,
        transportFeasibility,
        quantityFit,
        qualityMatch,
        availabilityFrequency,
        factors,
        distanceKm,
        quantityRatio,
        qualityTierDiff,
    };
}
