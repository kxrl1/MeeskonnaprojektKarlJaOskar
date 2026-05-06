const express = require('express');
const router = express.Router();
const { addToWatchlist, getWatchlist, removeFromWatchlist } = require('../controllers/watchlistController');

router.post('/', addToWatchlist);
router.get('/:userId', getWatchlist);
router.delete('/:id', removeFromWatchlist);

module.exports = router;