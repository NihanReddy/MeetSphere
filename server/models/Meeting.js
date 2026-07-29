import mongoose from 'mongoose';

const MeetingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  roomName: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  participants: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    },
    role: {
      type: String,
      enum: ['host', 'speaker', 'listener'],
      default: 'speaker'
    }
  }],
  status: {
    type: String,
    enum: ['scheduled', 'live', 'ended'],
    default: 'scheduled'
  },
  isE2EE: {
    type: Boolean,
    default: true
  },
  isRecording: {
    type: Boolean,
    default: false
  },
  scheduledStartTime: {
    type: Date,
    required: true
  },
  actualStartTime: Date,
  endTime: Date
}, {
  timestamps: true
});

export const Meeting = mongoose.model('Meeting', MeetingSchema);
