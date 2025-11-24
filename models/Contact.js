const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User reference is required'],
    index: true,
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
  },
  phone: {
    type: String,
    required: [true, 'Phone is required'],
    trim: true,
  },
  address: {
    type: String,
    trim: true,
  },
  country: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true,
});

// Index for efficient searching
contactSchema.index({ user: 1, name: 1 });
contactSchema.index({ user: 1, email: 1 });
contactSchema.index({ user: 1, phone: 1 });

module.exports = mongoose.model('Contact', contactSchema);

