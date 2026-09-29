import express from 'express';
import type { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import {
  computeStressScore,
  StudentScreeningInput,
  StressModelOutput,
} from './src/lib/stressModel.ts';
import type {
  UserAccount,
  StudentProfile,
  ScreeningRecord,
  DatasetScreeningInput,
  Appointment,
  SupportResource,
  UniversityAnalytics,
  AppointmentStatus,
} from './src/types/index.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Initialize Gemini SDK with recommended configuration
let aiClient: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.warn('Failed to initialize Google GenAI SDK:', err);
  }
}

// Start server
app.listen(PORT, () => {
  console.log(`[Server] ThrivePath Wellspring listening on http://localhost:${PORT}`);
});

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    aiConfigured: Boolean(process.env.GEMINI_API_KEY),
    datasetTrainedRecords: 3000,
    model: 'UniWell Multi-Factor Behavioral Stress Classifier v3.2',
  });
});

// Serve frontend
app.use(express.static(path.join(__dirname, 'dist')));

// SPA fallback
app.get('*', (_req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

