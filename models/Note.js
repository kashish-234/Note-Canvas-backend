const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users'
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  color: {
    type: String,
    default: 'bg-yellow-300'
  },
  isFavorite: {
    type: Boolean,
    default: false
  },
  isTask: {
    type: Boolean,
    default: false
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  reminder: {
    type: Date
  },
  highlights: [String],
  images: [String],
  urls: [String]
});

module.exports = mongoose.model('note', NoteSchema);