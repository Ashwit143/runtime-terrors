import { Router, Request, Response } from 'express';
import { getStoreListings } from './listings.routes.js';
import { findMatchesForListing } from '../engine/matchingService.js';
import { Listing, MatchRecord } from '../types/index.js';

export const matchesRouter = Router();

// GET all active pairs in the system (Top matches across all listings)
matchesRouter.get('/', (req: Request, res: Response) => {
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

  // Sort descending by overallScore
  allMatches.sort((a, b) => b.score.overallScore - a.score.overallScore);

  res.json({
    success: true,
    count: allMatches.length,
    data: allMatches,
  });
});

// GET matches for a specific existing listing
matchesRouter.get('/:listingId', (req: Request, res: Response) => {
  const { listingId } = req.params;
  const store = getStoreListings();
  const targetListing = store.find(l => l.id === listingId);

  if (!targetListing) {
    return res.status(404).json({
      success: false,
      error: `Listing with ID '${listingId}' not found.`,
    });
  }

  const candidatePool = store.filter(l => l.id !== listingId && l.type !== targetListing.type);
  const matches = findMatchesForListing(targetListing, candidatePool);

  res.json({
    success: true,
    targetListing,
    matchCount: matches.length,
    data: matches,
  });
});

// POST simulate matches for a drafted/new listing
matchesRouter.post('/simulate', (req: Request, res: Response) => {
  const payload = req.body as Partial<Listing>;

  if (!payload.type || !payload.category || !payload.city || !payload.quantity) {
    return res.status(400).json({
      success: false,
      error: 'Incomplete simulation payload. Required: type, category, city, quantity.',
    });
  }

  const draftListing: Listing = {
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

  const store = getStoreListings();
  const candidatePool = store.filter(l => l.type !== draftListing.type);
  const matches = findMatchesForListing(draftListing, candidatePool);

  res.json({
    success: true,
    targetListing: draftListing,
    matchCount: matches.length,
    data: matches,
  });
});
