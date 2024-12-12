const express = require('express');
const { requireAuth, checkUser } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('*', checkUser);
router.get('/', (req, res) => res.render('home'));
router.get('/learn', (req, res) => res.render('learn'));
router.get('/community', requireAuth, (req, res) => res.render('community'));
router.get('/museum', (req, res) => res.render('museum'));
router.get('/marketplace', requireAuth, (req, res) => res.render('marketplace'));
router.get('/events', requireAuth, (req, res) => res.render('events'));
router.get('/user', requireAuth, (req, res) => res.render('user'));
router.get('/cart', requireAuth, (req, res) => res.render('cart'));

module.exports = router;
