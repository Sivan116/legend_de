var express = require('express');
var router = express.Router();
const reportsService = require('../services/IntelligenceService');

router.get('/', async (req, res, next) => {
  res.status(200).json(await reportsService.getSuspects());
});

router.get('/wanted', async (req, res) => {
  res.status(200).json(await reportsService.getWanted());
});

module.exports = router;