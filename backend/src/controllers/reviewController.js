const { Review } = require('../models');

// POST /api/movies/:movieId/reviews
const createReview = async (req, res) => {
  try {
    const { userId, rating, content } = req.body;
    const movieId = req.params.movieId;

    // Ärireegel: üks arvustus filmi kohta
    const existing = await Review.findOne({ where: { userId, movieId } });
    if (existing) {
      return res.status(400).json({ error: 'Oled juba selle filmi arvustanud' });
    }

    const review = await Review.create({ userId, movieId, rating, content });
    res.status(201).json(review);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// GET /api/movies/:movieId/reviews
const getReviewsByMovie = async (req, res) => {
  try {
    const reviews = await Review.findAll({
      where: { movieId: req.params.movieId }
    });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: 'Serveri viga' });
  }
};

// DELETE /api/reviews/:id
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findByPk(req.params.id);
    if (!review) return res.status(404).json({ error: 'Arvustust ei leitud' });
    await review.destroy();
    res.json({ message: 'Arvustus kustutatud' });
  } catch (err) {
    res.status(500).json({ error: 'Serveri viga' });
  }
};

module.exports = { createReview, getReviewsByMovie, deleteReview };