const express = require('express');
const router = express.Router({ mergeParams: true });
const { createReview, getReviewsByMovie, deleteReview } = require('../controllers/reviewController');

router.post('/', createReview);
router.get('/', getReviewsByMovie);
router.delete('/:id', deleteReview);

module.exports = router;