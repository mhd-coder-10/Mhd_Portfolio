const express = require('express');
const router = express.Router();
const { getPublicPortfolio, downloadResume, viewDocument } = require('../controllers/public.controller');

router.get('/portfolio', getPublicPortfolio);
router.get('/resume/download', downloadResume);
router.get('/document/view', viewDocument);

module.exports = router;
