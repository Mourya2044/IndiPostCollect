const express = require('express');
const router = express.Router();
const { getStamps, getStampDetails, addToCart } = require('../controllers/stampController');

// Existing routes
router.get('/:category', getStamps);

// New route for stamp details
router.get('/details/:id', getStampDetails);

// add to cart
router.post('/addToCart', addToCart);
// router.post('/removeFromCart/:info', addToCart);

module.exports = router;
