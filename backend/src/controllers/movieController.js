const { Movie, Review } = require('../models');
const { Sequelize } = require('sequelize');

// GET /api/movies - kõik filmid
const getAllMovies = async (req, res) => {
  try {
    const movies = await Movie.findAll({
      attributes: {
        include: [
          [Sequelize.fn('AVG', Sequelize.col('Reviews.rating')), 'avgRating'],
          [Sequelize.fn('COUNT', Sequelize.col('Reviews.id')), 'reviewCount']
        ]
      },
      include: [{ model: Review, attributes: [] }],
      group: ['Movie.id']
    });
    res.json(movies);
  } catch (err) {
    res.status(500).json({ error: 'Serveri viga' });
  }
};

// GET /api/movies/:id - üks film
const getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findByPk(req.params.id);
    if (!movie) return res.status(404).json({ error: 'Filmi ei leitud' });
    res.json(movie);
  } catch (err) {
    res.status(500).json({ error: 'Serveri viga' });
  }
};

const createMovie = async (req, res) => {
  try {
    const movie = await Movie.create(req.body);
    res.status(201).json(movie);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = { getAllMovies, getMovieById, createMovie };