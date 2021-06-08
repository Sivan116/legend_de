var express = require('express');
var router = express.Router();
const reportsService = require('../services/SecurityReportsService');

router.get('/', async (req, res, next) => {
   res.send(await reportsService.getReports());
});

router.get('/threshold', async (req, res) => {
   res.send(await reportsService.getReportsThreshold());
});

router.put('/threshold', async (req, res) => {
   const { day, threshold } = req.body;
   res.send(await reportsService.getReportsThreshold(day, threshold));
});

module.exports = router;