"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const listings_routes_js_1 = require("./routes/listings.routes.js");
const matches_routes_js_1 = require("./routes/matches.routes.js");
const impact_routes_js_1 = require("./routes/impact.routes.js");
dotenv_1.default.config();
const app = (0, express_1.default)();
exports.app = app;
// Middlewares
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// API Routes
app.use('/api/listings', listings_routes_js_1.listingsRouter);
app.use('/api/matches', matches_routes_js_1.matchesRouter);
app.use('/api/impact', impact_routes_js_1.impactRouter);
// Health Check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        system: 'CircularMatch AI Matching Engine',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
    });
});
exports.default = app;
//# sourceMappingURL=app.js.map