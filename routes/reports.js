var express = require('express');
var router = express.Router();
const reportsService = require('../services/SecurityReportsService');

router.get('/', async (req, res, next) => {
   res.send(await reportsService.getReports());
});

router.post('/', async (req, res) => {
   console.log(req.body);
   const { type, id } = req.body;
   res.send(await reportsService.getReportById(type, id))
});

router.get('/threshold', async (req, res) => {
   res.send(await reportsService.getReportsThreshold());
});

router.put('/threshold', async (req, res) => {
   const { thresholdArray } = req.body;
   res.send(await reportsService.updateReportsThreshold(thresholdArray));
});

router.get('/previousWeek', async (req, res, next) => {
    res.send(await reportsService.getReportsPreviousWeek());
 });

module.exports = router;