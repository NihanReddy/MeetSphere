import { AccessToken } from 'livekit-server-sdk';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.LIVEKIT_API_KEY || 'devkey';
const apiSecret = process.env.LIVEKIT_API_SECRET || 'secretkey';

/**
 * Generates a join token for a LiveKit room.
 * @param {string} roomName Name of the room/meeting
 * @param {string} participantIdentity Unique identity for the user
 * @param {object} options Optional flags (e.g. metadata)
 */
export function generateLiveKitToken(roomName, participantIdentity, options = {}) {
  console.log(`[LiveKit] Creating connection token for Room: ${roomName}, User: ${participantIdentity}`);

  try {
    // Generate token valid for 4 hours
    const at = new AccessToken(apiKey, apiSecret, {
      identity: participantIdentity,
      ttl: '4h',
      metadata: JSON.stringify(options.metadata || {})
    });

    // Authorize video room capabilities
    at.addGrant({
      roomJoin: true,
      room: roomName,
      canPublish: true,
      canSubscribe: true,
      canPublishData: true
    });

    const token = at.toJwt();
    return token;
  } catch (err) {
    console.error('[LiveKit] Token generation failed:', err);
    throw err;
  }
}
