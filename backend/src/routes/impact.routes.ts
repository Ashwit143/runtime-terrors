import { Router, Request, Response } from 'express';
import { getAllListings } from '../db/listingsRepository.js';
import { findMatchesForListing } from '../engine/matchingService.js';
import { MatchRecord, ImpactSummary } from '../types/index.js';

export const impactRouter = Router();

// GET platform-wide cumulative impact metrics
impactRouter.get('/summary', async (req: Request, res: Response) => {
  try {
    const store = await getAllListings();
    const suppliers = store.filter((l) => l.type === 'SUPPLIER');
    const receivers = store.filter((l) => l.type === 'RECEIVER');

    const matches: MatchRecord[] = [];
    const seenPairs = new Set<string>();

    for (const supplier of suppliers) {
      const matchResults = findMatchesForListing(supplier, receivers);
      for (const m of matchResults) {
        if (!seenPairs.has(m.matchId)) {
          seenPairs.add(m.matchId);
          matches.push(m);
        }
      }
    }

    // Cumulative sum across all valid pairings
    const summary: ImpactSummary = matches.reduce(
      (acc, m) => ({
        totalMatchesCount: acc.totalMatchesCount + 1,
        totalWasteDivertedTonnes: acc.totalWasteDivertedTonnes + m.impact.wasteDivertedTonnes,
        totalCostSavedINR: acc.totalCostSavedINR + m.impact.estimatedCostSavedINR,
        totalCo2AvoidedTons: acc.totalCo2AvoidedTons + m.impact.co2AvoidedTons,
        totalLandfillDivertedTonnes: acc.totalLandfillDivertedTonnes + m.impact.landfillDivertedTonnes,
      }),
      {
        totalMatchesCount: 0,
        totalWasteDivertedTonnes: 0,
        totalCostSavedINR: 0,
        totalCo2AvoidedTons: 0,
        totalLandfillDivertedTonnes: 0,
      }
    );

    res.json({
      success: true,
      data: {
        summary,
        contributingMatchesCount: matches.length,
        topMatches: matches.slice(0, 5),
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'Failed to compute impact summary' });
  }
});
