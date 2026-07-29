import { Meeting } from '../models/Meeting.js';

/**
 * POST /api/meetings
 * Create a new meeting document.
 */
export const createMeeting = async (req, res) => {
  try {
    const { title, roomName, host, scheduledStartTime, isE2EE, participants } = req.body;

    // Basic validation
    if (!title || !roomName || !host || !scheduledStartTime) {
      return res.status(400).json({
        error: 'Missing required fields: title, roomName, host, scheduledStartTime'
      });
    }

    const meeting = await Meeting.create({
      title,
      roomName,
      host,
      scheduledStartTime: new Date(scheduledStartTime),
      isE2EE: isE2EE ?? true,
      participants: participants || []
    });

    res.status(201).json(meeting);
  } catch (err) {
    console.error('[MeetingController] createMeeting error:', err);
    res.status(500).json({ error: 'Failed to create meeting' });
  }
};

/**
 * GET /api/meetings/:id
 * Retrieve meeting details by its MongoDB ID,
 * populating host and participants.user references.
 */
export const getMeetingById = async (req, res) => {
  try {
    const { id } = req.params;

    const meeting = await Meeting.findById(id)
      .populate('host', 'name email avatar')
      .populate('participants.user', 'name email avatar');

    if (!meeting) {
      return res.status(404).json({ error: 'Meeting not found' });
    }

    res.json(meeting);
  } catch (err) {
    console.error('[MeetingController] getMeetingById error:', err);
    res.status(500).json({ error: 'Failed to fetch meeting details' });
  }
};

