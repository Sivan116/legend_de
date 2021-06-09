var express = require('express');
var router = express.Router();
const reportsService = require('../services/SecurityReportsService');

router.get('/', async (req, res, next) => {
   res.send(await reportsService.getReports());
});


router.get('/previousWeek', async (req, res, next) => {
    res.send(await reportsService.getReportsPreviousWeek());
 });

module.exports = router;