const express = require('express');
const router = express.Router();
const { getStamps, getStampDetails } = require('../controllers/stampController');

// Existing routes
router.get('/:category', getStamps);

// New route for stamp details
router.get('/details/:id', getStampDetails);

module.exports = router;
