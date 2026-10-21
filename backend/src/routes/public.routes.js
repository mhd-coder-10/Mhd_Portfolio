const express = require('express');
const router = express.Router();
const { getPublicPortfolio } = require('../controllers/public.controller');

router.get('/portfolio', getPublicPortfolio);

module.exports = router;
