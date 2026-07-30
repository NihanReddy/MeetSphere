import { Router } from 'express';
import { createMeeting, getUserMeetings } from '../controllers/meetingController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

// POST /api/meetings — Create a new meeting (authenticated)
router.post('/', protect, createMeeting);

// GET /api/meetings — Get all meetings for the authenticated user
router.get('/', protect, getUserMeetings);

export default router;

