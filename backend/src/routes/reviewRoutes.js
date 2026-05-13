const express = require('express');
const router = express.Router({ mergeParams: true });
const { createReview, getReviewsByMovie, deleteReview } = require('../controllers/reviewController');

/**
 * @swagger
 * /api/movies/{movieId}/reviews:
 *   get:
 *     summary: Filmi kõik arvustused
 *     parameters:
 *       - in: path
 *         name: movieId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Arvustuste nimekiri
 *   post:
 *     summary: Lisa arvustus filmile
 *     parameters:
 *       - in: path
 *         name: movieId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *               rating:
 *                 type: integer
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Arvustus lisatud
 *       400:
 *         description: Vigased andmed või duplikaatarvustus
 *
 * /api/reviews/{id}:
 *   delete:
 *     summary: Kustuta arvustus
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Arvustus kustutatud
 *       404:
 *         description: Arvustust ei leitud
 */

router.post('/', createReview);
router.get('/', getReviewsByMovie);
router.delete('/:id', deleteReview);

module.exports = router;