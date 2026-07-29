import api from './api';

/**
 * Create a new meeting.
 * @param {object} meetingData - { title, roomName, host, scheduledStartTime, ... }
 * @returns {Promise<object>} The created meeting document
 */
export const createMeeting = async (meetingData) => {
  const response = await api.post('/meetings', meetingData);
  return response.data;
};

/**
 * Fetch meeting details by ID.
 * @param {string} meetingId - The MongoDB ObjectId of the meeting
 * @returns {Promise<object>} The meeting document with populated references
 */
export const getMeetingDetails = async (meetingId) => {
  const response = await api.get(`/meetings/${meetingId}`);
  return response.data;
};

