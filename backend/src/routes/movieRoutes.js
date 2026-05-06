const express = require('express');
const router = express.Router();
const { getAllMovies, getMovieById, createMovie } = require('../controllers/movieController');

router.get('/', getAllMovies);
router.get('/:id', getMovieById);
router.post('/', createMovie);

module.exports = router;