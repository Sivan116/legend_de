var express = require('express');
var router = express.Router();
const reportsService = require('../services/SecurityReportsService');

router.get('/', function(req, res, next) {
   res.send(reportsService.getAll());
});

module.exports = router;