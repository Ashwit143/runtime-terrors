import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { listingsRouter } from './routes/listings.routes.js';
import { matchesRouter } from './routes/matches.routes.js';
import { impactRouter } from './routes/impact.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/listings', listingsRouter);
app.use('/api/matches', matchesRouter);
app.use('/api/impact', impactRouter);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    system: 'CircularMatch AI Matching Engine',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 CircularMatch AI Engine running on port ${PORT}`);
  console.log(`🌐 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📦 Seed listings active & matching algorithms initialized`);
  console.log(`=======================================================`);
});
