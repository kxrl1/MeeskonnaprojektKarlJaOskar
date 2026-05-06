const express = require('express');
const router = express.Router();
const { getAllMovies, getMovieById, createMovie } = require('../controllers/movieController');

/**
 * @swagger
 * /api/movies:
 *   get:
 *     summary: Kõik filmid
 *     responses:
 *       200:
 *         description: Filmide nimekiri
 *   post:
 *     summary: Lisa uus film
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               tmdbId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Film lisatud
 *       400:
 *         description: Vigased andmed
 *
 * /api/movies/{id}:
 *   get:
 *     summary: Üks film ID järgi
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Filmi andmed
 *       404:
 *         description: Filmi ei leitud
 */

router.get('/', getAllMovies);
router.get('/:id', getMovieById);
router.post('/', createMovie);

module.exports = router;