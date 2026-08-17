"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.matchesRouter = void 0;
const express_1 = require("express");
const listings_routes_js_1 = require("./listings.routes.js");
const matchingService_js_1 = require("../engine/matchingService.js");
exports.matchesRouter = (0, express_1.Router)();
// GET all active pairs in the system (Top matches across all listings)
exports.matchesRouter.get('/', (req, res) => {
    const store = (0, listings_routes_js_1.getStoreListings)();
    const suppliers = store.filter(l => l.type === 'SUPPLIER');
    const receivers = store.filter(l => l.type === 'RECEIVER');
    const allMatches = [];
    const seenPairs = new Set();
    for (const supplier of suppliers) {
        const matches = (0, matchingService_js_1.findMatchesForListing)(supplier, receivers);
        for (const m of matches) {
            if (!seenPairs.has(m.matchId)) {
                seenPairs.add(m.matchId);
                allMatches.push(m);
            }
        }
    }
    // Sort descending by overallScore
    allMatches.sort((a, b) => b.score.overallScore - a.score.overallScore);
    res.json({
        success: true,
        count: allMatches.length,
        data: allMatches,
    });
});
// GET matches for a specific existing listing
exports.matchesRouter.get('/:listingId', (req, res) => {
    const { listingId } = req.params;
    const store = (0, listings_routes_js_1.getStoreListings)();
    const targetListing = store.find(l => l.id === listingId);
    if (!targetListing) {
        return res.status(404).json({
            success: false,
            error: `Listing with ID '${listingId}' not found.`,
        });
    }
    const candidatePool = store.filter(l => l.id !== listingId && l.type !== targetListing.type);
    const matches = (0, matchingService_js_1.findMatchesForListing)(targetListing, candidatePool);
    res.json({
        success: true,
        targetListing,
        matchCount: matches.length,
        data: matches,
    });
});
// POST simulate matches for a drafted/new listing
exports.matchesRouter.post('/simulate', (req, res) => {
    const payload = req.body;
    if (!payload.type || !payload.category || !payload.city || !payload.quantity) {
        return res.status(400).json({
            success: false,
            error: 'Incomplete simulation payload. Required: type, category, city, quantity.',
        });
    }
    const draftListing = {
        id: 'draft_sim',
        type: payload.type,
        companyName: payload.companyName || 'Candidate Enterprise',
        city: payload.city,
        category: payload.category,
        materialName: payload.materialName || `${payload.category} Feedstock`,
        quantity: Number(payload.quantity),
        unit: payload.unit || 'tonnes/month',
        qualityGrade: payload.qualityGrade || 'MEDIUM',
        frequency: payload.frequency || 'WEEKLY',
        isHazardous: Boolean(payload.isHazardous),
        isHazmatLicensed: Boolean(payload.isHazmatLicensed),
        createdAt: new Date().toISOString(),
    };
    const store = (0, listings_routes_js_1.getStoreListings)();
    const candidatePool = store.filter(l => l.type !== draftListing.type);
    const matches = (0, matchingService_js_1.findMatchesForListing)(draftListing, candidatePool);
    res.json({
        success: true,
        targetListing: draftListing,
        matchCount: matches.length,
        data: matches,
    });
});
