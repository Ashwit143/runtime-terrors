"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listingsRouter = void 0;
exports.getStoreListings = getStoreListings;
exports.resetStore = resetStore;
const express_1 = require("express");
const seedListings_js_1 = require("../data/seedListings.js");
// In-memory data store seeded with realistic Indian listings
let listingsStore = [...seedListings_js_1.SEED_LISTINGS];
exports.listingsRouter = (0, express_1.Router)();
function getStoreListings() {
    return listingsStore;
}
function resetStore() {
    listingsStore = [...seedListings_js_1.SEED_LISTINGS];
}
// GET all listings with optional filter
exports.listingsRouter.get('/', (req, res) => {
    const { type, category, city } = req.query;
    let results = [...listingsStore];
    if (type && typeof type === 'string') {
        results = results.filter(l => l.type === type.toUpperCase());
    }
    if (category && typeof category === 'string') {
        results = results.filter(l => l.category === category.toUpperCase());
    }
    if (city && typeof city === 'string') {
        results = results.filter(l => l.city.toLowerCase() === city.toLowerCase());
    }
    res.json({
        success: true,
        count: results.length,
        data: results,
    });
});
// GET single listing
exports.listingsRouter.get('/:id', (req, res) => {
    const { id } = req.params;
    const listing = listingsStore.find(l => l.id === id);
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
});
// POST new listing
exports.listingsRouter.post('/', (req, res) => {
    const payload = req.body;
    if (!payload.companyName || !payload.type || !payload.category || !payload.city || !payload.quantity) {
        return res.status(400).json({
            success: false,
            error: 'Missing required fields: companyName, type, category, city, and quantity are required.',
        });
    }
    const newListing = {
        id: `custom_${Date.now()}`,
        type: payload.type,
        companyName: payload.companyName,
        contactPerson: payload.contactPerson || 'Lead Industrialist',
        email: payload.email || 'contact@circularmatch.demo',
        phone: payload.phone || '+91 99000 11223',
        city: payload.city,
        state: payload.state || '',
        category: payload.category,
        materialName: payload.materialName || `${payload.category} Grade Material`,
        description: payload.description || 'Industrial circular material stream.',
        quantity: Number(payload.quantity),
        unit: payload.unit || 'tonnes/month',
        qualityGrade: payload.qualityGrade || 'MEDIUM',
        frequency: payload.frequency || 'WEEKLY',
        isHazardous: Boolean(payload.isHazardous),
        isHazmatLicensed: Boolean(payload.isHazmatLicensed),
        pricePerUnit: payload.pricePerUnit ? Number(payload.pricePerUnit) : undefined,
        currency: 'INR',
        createdAt: new Date().toISOString(),
    };
    // Add to in-memory store
    listingsStore.unshift(newListing);
    res.status(201).json({
        success: true,
        message: 'Listing registered successfully',
        data: newListing,
    });
});
// POST reset to default seed
exports.listingsRouter.post('/reset', (req, res) => {
    resetStore();
    res.json({
        success: true,
        message: 'Database reset to default synthetic Indian seed data.',
        count: listingsStore.length,
    });
});
