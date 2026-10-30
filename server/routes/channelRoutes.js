import { Router } from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  listChannels,
  createChannel,
  getChannel,
  addChannelMember,
  removeChannelMember,
  leaveChannel,
  sendChannelMessage,
  getChannelMessages
} from '../controllers/channelController.js';

const router = Router();

router.use(protect);
router.get('/', listChannels);
router.post('/', createChannel);
router.get('/:channelId/messages', getChannelMessages);
router.post('/:channelId/messages', sendChannelMessage);
router.post('/:channelId/members', addChannelMember);
router.delete('/:channelId/members/:userId', removeChannelMember);
router.post('/:channelId/leave', leaveChannel);
router.get('/:channelId', getChannel);

export default router;
