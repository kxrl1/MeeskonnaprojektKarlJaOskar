const { WatchlistItem } = require('../models');

// POST /api/watchlist
const addToWatchlist = async (req, res) => {
  try {
    const { userId, movieId } = req.body;

    // Kontroll: kas juba nimekirjas
    const existing = await WatchlistItem.findOne({ where: { userId, movieId } });
    if (existing) {
      return res.status(400).json({ error: 'Film on juba nimekirjas' });
    }

    const item = await WatchlistItem.create({ userId, movieId });
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// GET /api/watchlist/:userId
const getWatchlist = async (req, res) => {
  try {
    const items = await WatchlistItem.findAll({
      where: { userId: req.params.userId }
    });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Serveri viga' });
  }
};

// DELETE /api/watchlist/:id
const removeFromWatchlist = async (req, res) => {
  try {
    const item = await WatchlistItem.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Kirjet ei leitud' });
    await item.destroy();
    res.json({ message: 'Eemaldatud nimekirjast' });
  } catch (err) {
    res.status(500).json({ error: 'Serveri viga' });
  }
};

module.exports = { addToWatchlist, getWatchlist, removeFromWatchlist };