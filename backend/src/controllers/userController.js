const { User, Review } = require('../models');

// POST /api/users - loo kasutaja
const createUser = async (req, res) => {
  try {
    const { username, email, passwordHash } = req.body;
    const user = await User.create({ username, email, passwordHash });
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// GET /api/users/:id - üks kasutaja
const getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'Kasutajat ei leitud' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Serveri viga' });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'username', 'email', 'createdAt']
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Serveri viga' });
  }
};

const getUserReviews = async (req, res) => {
  try {
    const reviews = await Review.findAll({
      where: { userId: req.params.id }
    });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: 'Serveri viga' });
  }
};

module.exports = { createUser, getUserById, getAllUsers, getUserReviews };