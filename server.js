import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

// Load environment variables (mostly for local dev, Render provides them directly)
dotenv.config({ path: '.env' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 80;

// Middleware
app.use(cors());
app.use(express.json());

// Import the serverless function handler
import generateHandler from './api/generate.js';

// Wrap the serverless function for Express API
app.post('/api/generate', async (req, res) => {
  console.log('📥 Received request to /api/generate');
  
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
  
  await generateHandler(req, mockRes);
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Limbra production server is running' });
});

// Serve static frontend files from 'dist'
app.use(express.static(join(__dirname, 'dist')));

// Catch-all route to serve React's index.html for SPA client-side routing
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`✅ Production server running on port ${PORT}`);
});