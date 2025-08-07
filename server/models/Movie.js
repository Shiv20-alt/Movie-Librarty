const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  },
  genre: {
    type: String,
    trim: true,
    maxlength: 50
  },
  releaseYear: {
    type: Number,
    min: 1900,
    max: new Date().getFullYear() + 5
  },
  rating: {
    type: Number,
    min: 0,
    max: 10,
    default: 0
  },
  posterUrl: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Index for better query performance
movieSchema.index({ title: 'text', description: 'text' });
movieSchema.index({ uploadedBy: 1 });
movieSchema.index({ uploadedAt: -1 });

module.exports = mongoose.model('Movie', movieSchema);