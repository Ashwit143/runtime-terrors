import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { listingsRouter } from './routes/listings.routes.js';
import { matchesRouter } from './routes/matches.routes.js';
import { impactRouter } from './routes/impact.routes.js';

dotenv.config();

const app = express();

// Enable CORS for all origins and headers (production & development safe)
app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  })
);

app.use(express.json());

// API Routes with /api prefix
app.use('/api/listings', listingsRouter);
app.use('/api/matches', matchesRouter);
app.use('/api/impact', impactRouter);

// Also mount routes at root in case reverse-proxy/serverless routes strip /api
app.use('/listings', listingsRouter);
app.use('/matches', matchesRouter);
app.use('/impact', impactRouter);

// Health Check
app.get(['/api/health', '/health'], (req, res) => {
  res.json({
    status: 'healthy',
    system: 'Waste 2 Worth Matching Engine',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

export { app };
export default app;
