const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const Note = require('../models/Note');
const auth = require('../middleware/auth');

// Apply the auth middleware to all routes
router.use(auth);

// @route   GET api/notes
// @desc    Get all notes
// @access  Private
router.get('/', async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id }).sort({ date: -1 });
    res.json(notes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/notes
// @desc    Add new note
// @access  Private
router.post(
  '/',
  [
    check('title', 'Title is required').not().isEmpty(),
    check('content', 'Content is required').not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      title,
      content,
      color,
      isFavorite,
      isTask,
      isCompleted,
      reminder,
      highlights,
      images,
      urls,
    } = req.body;

    try {
      const newNote = new Note({
        title,
        content,
        color,
        isFavorite,
        isTask,
        isCompleted,
        reminder,
        highlights,
        images,
        urls,
        user: req.user.id,
        date: new Date().toLocaleString(),
      });

      const note = await newNote.save();
      res.json(note);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   PUT api/notes/:id
// @desc    Update note
// @access  Private
router.put('/:id', async (req, res) => {
  const {
    title,
    content,
    color,
    isFavorite,
    isTask,
    isCompleted,
    reminder,
    highlights,
    images,
    urls,
  } = req.body;

  // Build note object
  const noteFields = {};
  if (title) noteFields.title = title;
  if (content) noteFields.content = content;
  if (color) noteFields.color = color;
  if (isFavorite !== undefined) noteFields.isFavorite = isFavorite;
  if (isTask !== undefined) noteFields.isTask = isTask;
  if (isCompleted !== undefined) noteFields.isCompleted = isCompleted;
  if (reminder) noteFields.reminder = reminder;
  if (highlights) noteFields.highlights = highlights;
  if (images) noteFields.images = images;
  if (urls) noteFields.urls = urls;

  try {
    let note = await Note.findById(req.params.id);

    if (!note) return res.status(404).json({ msg: 'Note not found' });

    // Make sure user owns note
    if (note.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    note = await Note.findByIdAndUpdate(
      req.params.id,
      { $set: noteFields },
      { new: true }
    );

    res.json(note);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/notes/:id
// @desc    Delete note
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    let note = await Note.findById(req.params.id);

    if (!note) return res.status(404).json({ msg: 'Note not found' });

    // Make sure user owns note
    if (note.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await Note.findByIdAndDelete(req.params.id);

    res.json({ msg: 'Note removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;