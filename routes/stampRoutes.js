// routes/stampRoutes.js
const express = require('express');
const { getStamps } = require('../controllers/stampController');

const router = express.Router();

// Route for fetching stamps by category
router.get('/:category', getStamps);

module.exports = router;
