const express = require('express');
const router = express.Router();
const { addToWatchlist, getWatchlist, removeFromWatchlist } = require('../controllers/watchlistController');

/**
 * @swagger
 * /api/watchlist:
 *   post:
 *     summary: Lisa film vaatamisnimekirja
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *               movieId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Film lisatud nimekirja
 *       400:
 *         description: Film on juba nimekirjas
 *
 * /api/watchlist/{userId}:
 *   get:
 *     summary: Kasutaja vaatamisnimekiri
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Vaatamisnimekiri
 *
 * /api/watchlist/{id}:
 *   delete:
 *     summary: Eemalda film nimekirjast
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Eemaldatud nimekirjast
 *       404:
 *         description: Kirjet ei leitud
 */

router.post('/', addToWatchlist);
router.get('/:userId', getWatchlist);
router.delete('/:id', removeFromWatchlist);

module.exports = router;