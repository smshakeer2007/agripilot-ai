import express from 'express';
import cors from 'cors';
import { config } from './config/index.js';
import { initDb } from './db/index.js';
import { errorHandler } from './middleware/error.middleware.js';

// Route Imports
import authRoutes from './routes/auth.routes.js';
import fieldRoutes from './routes/field.routes.js';
import advisoryRoutes from './routes/advisory.routes.js';
import aiRoutes from './routes/ai.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import demoRoutes from './routes/demo.routes.js';

const app = express();

// Security & Parsing Middlewares
app.use(cors({
  origin: '*', // Allow development origins and flexible local requests
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Generous body limit to support high-resolution leaf images in base64
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'AgriPilot AI Agronomic Engine',
    timestamp: new Date().toISOString(),
    gemini_configured: Boolean(config.geminiApiKey)
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/fields', fieldRoutes);
app.use('/api/advisories', advisoryRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/demo', demoRoutes);

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDistPath = path.join(__dirname, '../client/dist');

// If frontend has been built, serve it statically
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
}

// 404 Handler for undefined API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint '${req.originalUrl}' not found.`
  });
});

// Single Page Application wildcard for frontend routes
if (fs.existsSync(clientDistPath)) {
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

// Global Error Handler
app.use(errorHandler);

// Server Startup
async function startServer() {
  try {
    await initDb();
    app.listen(config.port, () => {
      console.log(`===============================================`);
      console.log(`🌱 AgriPilot AI Backend Running on port ${config.port}`);
      console.log(`📡 URL: http://localhost:${config.port}`);
      console.log(`🤖 AI Engine: ${config.geminiApiKey ? 'Gemini 2.5 Flash Connected' : 'Agronomic Expert Mode'}`);
      console.log(`===============================================`);
    });
  } catch (err) {
    console.error('Fatal: Failed to start AgriPilot Server:', err);
    process.exit(1);
  }
}

startServer();
