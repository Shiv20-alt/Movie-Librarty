const express = require('express');
const { body, validationResult } = require('express-validator');
const Movie = require('../models/Movie');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/movies
// @desc    Get all movies
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, search, sortBy = 'uploadedAt', sortOrder = 'desc' } = req.query;
    
    const query = {};
    if (search) {
      query.$text = { $search: search };
    }

    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const movies = await Movie.find(query)
      .populate('uploadedBy', 'username')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const total = await Movie.countDocuments(query);

    res.json({
      movies,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalMovies: total
    });
  } catch (error) {
    console.error('Get movies error:', error);
    res.status(500).json({ message: 'Server error while fetching movies' });
  }
});

// @route   GET /api/movies/:id
// @desc    Get single movie
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id)
      .populate('uploadedBy', 'username email');

    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    res.json(movie);
  } catch (error) {
    console.error('Get movie error:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Movie not found' });
    }
    res.status(500).json({ message: 'Server error while fetching movie' });
  }
});

// @route   POST /api/movies
// @desc    Create a new movie
// @access  Private
router.post('/', [
  auth,
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('title').isLength({ max: 200 }).withMessage('Title must be less than 200 characters'),
  body('description').isLength({ max: 1000 }).withMessage('Description must be less than 1000 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, genre, releaseYear, rating, posterUrl } = req.body;

    // Check if movie with same title already exists for this user
    const existingMovie = await Movie.findOne({ 
      title: title.trim(), 
      uploadedBy: req.user._id 
    });

    if (existingMovie) {
      return res.status(400).json({ message: 'You have already added a movie with this title' });
    }

    const movie = new Movie({
      title: title.trim(),
      description: description.trim(),
      uploadedBy: req.user._id,
      uploadedAt: new Date(),
      ...(genre && { genre: genre.trim() }),
      ...(releaseYear && { releaseYear }),
      ...(rating && { rating }),
      ...(posterUrl && { posterUrl: posterUrl.trim() })
    });

    await movie.save();
    await movie.populate('uploadedBy', 'username');

    res.status(201).json({
      message: 'Movie added successfully',
      movie
    });
  } catch (error) {
    console.error('Create movie error:', error);
    res.status(500).json({ message: 'Server error while creating movie' });
  }
});

// @route   PUT /api/movies/:id
// @desc    Update a movie
// @access  Private
router.put('/:id', [
  auth,
  body('title').optional().notEmpty().withMessage('Title cannot be empty'),
  body('description').optional().notEmpty().withMessage('Description cannot be empty'),
  body('title').optional().isLength({ max: 200 }).withMessage('Title must be less than 200 characters'),
  body('description').optional().isLength({ max: 1000 }).withMessage('Description must be less than 1000 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    // Check if user owns this movie
    if (movie.uploadedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this movie' });
    }

    const updates = {};
    const { title, description, genre, releaseYear, rating, posterUrl } = req.body;

    if (title !== undefined) updates.title = title.trim();
    if (description !== undefined) updates.description = description.trim();
    if (genre !== undefined) updates.genre = genre.trim();
    if (releaseYear !== undefined) updates.releaseYear = releaseYear;
    if (rating !== undefined) updates.rating = rating;
    if (posterUrl !== undefined) updates.posterUrl = posterUrl.trim();

    const updatedMovie = await Movie.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).populate('uploadedBy', 'username');

    res.json({
      message: 'Movie updated successfully',
      movie: updatedMovie
    });
  } catch (error) {
    console.error('Update movie error:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Movie not found' });
    }
    res.status(500).json({ message: 'Server error while updating movie' });
  }
});

// @route   DELETE /api/movies/:id
// @desc    Delete a movie
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    // Check if user owns this movie
    if (movie.uploadedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this movie' });
    }

    await Movie.findByIdAndDelete(req.params.id);

    res.json({ message: 'Movie deleted successfully' });
  } catch (error) {
    console.error('Delete movie error:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Movie not found' });
    }
    res.status(500).json({ message: 'Server error while deleting movie' });
  }
});

// @route   GET /api/movies/user/my-movies
// @desc    Get current user's movies
// @access  Private
router.get('/user/my-movies', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, sortBy = 'uploadedAt', sortOrder = 'desc' } = req.query;

    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const movies = await Movie.find({ uploadedBy: req.user._id })
      .populate('uploadedBy', 'username')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const total = await Movie.countDocuments({ uploadedBy: req.user._id });

    res.json({
      movies,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalMovies: total
    });
  } catch (error) {
    console.error('Get user movies error:', error);
    res.status(500).json({ message: 'Server error while fetching your movies' });
  }
});

module.exports = router;