import mongoose from 'mongoose';

const DocumentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  fileType: {
    type: String,
    required: true,
    trim: true
  },
  sizeBytes: {
    type: Number,
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  url: {
    type: String,
    required: true
  },
  associatedMeeting: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Meeting'
  }
}, {
  timestamps: true
});

export const Document = mongoose.model('Document', DocumentSchema);
