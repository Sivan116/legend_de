var express = require('express');
var router = express.Router();
const reportsService = require('../services/SecurityReportsService');

router.get('/', function(req, res, next) {
   res.send(reportsService.getReports());
});


router.get('/history', function(req, res, next) {
    res.send(reportsService.f());
 });

module.exports = router;