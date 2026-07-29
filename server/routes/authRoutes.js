import { Router } from 'express';
import { registerUser, loginUser } from '../controllers/authController.js';

const router = Router();

// POST /api/auth/register — Create a new user account
router.post('/register', registerUser);

// POST /api/auth/login — Authenticate user and return JWT
router.post('/login', loginUser);

export default router;

