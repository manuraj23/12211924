const express = require('express');
const router = express.Router();
const { createShortUrl, redirectShortUrl, getStats } = require('../controllers/urlController');

router.post('/shorturls', createShortUrl);
router.get('/:shortcode', redirectShortUrl);
router.get('/shorturls/:shortcode', getStats);

module.exports = router;
