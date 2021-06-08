var express = require('express');
var router = express.Router();
const reportsService = require('../services/IntelligenceService');

router.get('/', (req, res, next) => {
  res.status(200).json(reportsService.getSuspects());
});

router.get('/wanted', (req, res) => {
  res.status(200).json(reportsService.getWanted());
});

module.exports = router;