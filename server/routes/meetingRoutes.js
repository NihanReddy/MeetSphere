import { Router } from 'express';
import { createMeeting, getMeetingById } from '../controllers/meetingController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

// POST /api/meetings — Create a new meeting (authenticated)
router.post('/', protect, createMeeting);

// GET /api/meetings/:id — Fetch meeting details (authenticated)
router.get('/:id', protect, getMeetingById);

export default router;

