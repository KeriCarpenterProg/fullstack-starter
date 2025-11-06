import { Router } from 'express';
import { db } from '../lib/db';
import { sign } from '../lib/auth';

const router = Router();

// For now, let's create a simple endpoint to test the structure
router.get('/test', (req, res) => {
  res.json({ message: 'OAuth routes working' });
});

// TODO: Add full Google OAuth implementation
// This will be implemented after we fix the TypeScript issues

export default router;