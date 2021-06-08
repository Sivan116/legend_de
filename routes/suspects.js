var express = require('express');
var router = express.Router();
const reportsService = require('../services/IntelligenceService');

router.get('/', (req, res, next) => {
  res.status(200).json(reportsService.getSuspects());
});

module.exports = router;