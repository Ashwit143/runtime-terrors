import { Router, Request, Response } from 'express';
import { getStoreListings } from './listings.routes.js';
import { findMatchesForListing } from '../engine/matchingService.js';
import { MatchRecord, ImpactSummary } from '../types/index.js';

export const impactRouter = Router();

// GET global system impact summary
impactRouter.get('/summary', (req: Request, res: Response) => {
  const store = getStoreListings();
  const suppliers = store.filter(l => l.type === 'SUPPLIER');
  const receivers = store.filter(l => l.type === 'RECEIVER');

  const allMatches: MatchRecord[] = [];
  const seenPairs = new Set<string>();

  for (const supplier of suppliers) {
    const matches = findMatchesForListing(supplier, receivers);
    for (const m of matches) {
      if (!seenPairs.has(m.matchId)) {
        seenPairs.add(m.matchId);
        allMatches.push(m);
      }
    }
  }

  // Filter high compatibility matches (score >= 70) for realistic realized impact
  const topMatches = allMatches.filter(m => m.score.overallScore >= 70);

  const summary: ImpactSummary = {
    totalMatchesCount: topMatches.length,
    totalWasteDivertedTonnes: Number(
      topMatches.reduce((sum, m) => sum + m.impact.wasteDivertedTonnes, 0).toFixed(1)
    ),
    totalCostSavedINR: topMatches.reduce((sum, m) => sum + m.impact.estimatedCostSavedINR, 0),
    totalCo2AvoidedTons: Number(
      topMatches.reduce((sum, m) => sum + m.impact.co2AvoidedTons, 0).toFixed(2)
    ),
    totalLandfillDivertedTonnes: Number(
      topMatches.reduce((sum, m) => sum + m.impact.landfillDivertedTonnes, 0).toFixed(1)
    ),
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
