const express = require('express');
const router = express.Router();
const { login } = require('../controllers/authController');

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Logi sisse
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Sisselogimine õnnestus, tagastab kasutaja andmed
 *       401:
 *         description: Vale email või parool
 *       500:
 *         description: Serveri viga
 */

router.post('/login', login);

module.exports = router;