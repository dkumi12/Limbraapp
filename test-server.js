// Simple Express server for local testing of serverless functions
// This mimics Vercel's serverless environment locally

import express from 'express';
import cors from 'cors';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3002;

// Middleware
app.use(cors());
app.use(express.json());

// Import the serverless function
const generateHandler = (await import('./api/generate.js')).default;

// Wrap the serverless function for Express
app.post('/api/generate', async (req, res) => {
  console.log('📥 Received request to /api/generate');
  
  // Create mock Vercel request/response objects
  const mockReq = {
    method: 'POST',
    body: req.body
  };
  
  const mockRes = {
    status: (code) => {
      res.status(code);
      return mockRes;
    },
    json: (data) => {
      res.json(data);
    },
    setHeader: (key, value) => {
      res.setHeader(key, value);
    },
    end: () => {
      res.end();
    }
  };
  
  await generateHandler(mockReq, mockRes);
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Serverless function proxy is running' });
});

app.listen(PORT, () => {
  console.log(`✅ Local serverless proxy running at http://localhost:${PORT}`);
  console.log(`🔧 Testing endpoint: http://localhost:${PORT}/api/generate`);
  console.log(`💡 Update your app to use this port for local testing`);
});
