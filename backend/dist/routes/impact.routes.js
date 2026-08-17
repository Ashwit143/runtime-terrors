"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.impactRouter = void 0;
const express_1 = require("express");
const listings_routes_js_1 = require("./listings.routes.js");
const matchingService_js_1 = require("../engine/matchingService.js");
exports.impactRouter = (0, express_1.Router)();
// GET global system impact summary
exports.impactRouter.get('/summary', (req, res) => {
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
    // Filter high compatibility matches (score >= 70) for realistic realized impact
    const topMatches = allMatches.filter(m => m.score.overallScore >= 70);
    const summary = {
        totalMatchesCount: topMatches.length,
        totalWasteDivertedTonnes: Number(topMatches.reduce((sum, m) => sum + m.impact.wasteDivertedTonnes, 0).toFixed(1)),
        totalCostSavedINR: topMatches.reduce((sum, m) => sum + m.impact.estimatedCostSavedINR, 0),
        totalCo2AvoidedTons: Number(topMatches.reduce((sum, m) => sum + m.impact.co2AvoidedTons, 0).toFixed(2)),
        totalLandfillDivertedTonnes: Number(topMatches.reduce((sum, m) => sum + m.impact.landfillDivertedTonnes, 0).toFixed(1)),
    };
    res.json({
        success: true,
        data: {
            summary,
            contributingMatchesCount: topMatches.length,
            topMatches: topMatches.slice(0, 5),
        },
    });
});
