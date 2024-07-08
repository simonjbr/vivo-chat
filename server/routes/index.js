import express from 'express';
import apiRoutes from './api/index.js';

const router = express.Router();

// /api
router.use('/api', apiRoutes);

export default router;
