import { Router, Request, Response } from 'express';
import {
  getAllListings,
  getListingById,
  createNewListing,
  resetDatabaseStore,
} from '../db/listingsRepository.js';

export const listingsRouter = Router();

// GET all listings with optional filter
listingsRouter.get('/', async (req: Request, res: Response) => {
  try {
    const { type, category, city } = req.query;
    const listings = await getAllListings({
      type: typeof type === 'string' ? type : undefined,
      category: typeof category === 'string' ? category : undefined,
      city: typeof city === 'string' ? city : undefined,
    });

    res.json({
      success: true,
      count: listings.length,
      data: listings,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'Failed to fetch listings' });
  }
});

// GET single listing
listingsRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const listing = await getListingById(id);

    if (!listing) {
      return res.status(404).json({
        success: false,
        error: `Listing with ID '${id}' not found.`,
      });
    }

    res.json({
      success: true,
      data: listing,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'Failed to fetch listing' });
  }
});

// POST new listing
listingsRouter.post('/', async (req: Request, res: Response) => {
  try {
    const payload = req.body;

    if (!payload.companyName || !payload.type || !payload.category || !payload.city || !payload.quantity) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: companyName, type, category, city, and quantity are required.',
      });
    }

    const created = await createNewListing(payload);

    res.status(201).json({
      success: true,
      message: 'Listing registered successfully',
      data: created,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'Failed to create listing' });
  }
});

// POST reset to default seed
listingsRouter.post('/reset', async (req: Request, res: Response) => {
  try {
    await resetDatabaseStore();
    const updated = await getAllListings();
    res.json({
      success: true,
      message: 'Database reset to default synthetic Indian seed data.',
      count: updated.length,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'Failed to reset database' });
  }
});
