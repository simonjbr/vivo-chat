import express from 'express';
import { login, logout, signup } from '../../../controllers/authController.js';

const router = express.Router();

// /api/auth/signup
router.post('/signup', signup);

// /api/auth/login
router.post('/login', login);

// /api/auth/logout
router.post('/logout', logout);

export default router;
