const express = require('express');
const router = express.Router();
const { createUser, getUserById, getAllUsers } = require('../controllers/userController');

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Loo uus kasutaja
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               passwordHash:
 *                 type: string
 *     responses:
 *       201:
 *         description: Kasutaja loodud
 *       400:
 *         description: Vigased andmed
 *
 * /api/users/{id}:
 *   get:
 *     summary: Kasutaja ID järgi
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Kasutaja andmed
 *       404:
 *         description: Kasutajat ei leitud
 */

router.post('/', createUser);
router.get('/:id', getUserById);
router.get('/', getAllUsers);

module.exports = router;