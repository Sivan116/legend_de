var express = require('express');
var router = express.Router();
const eventsService = require('../services/EventsService');

router.post('/', async (req, res) => {
    const { events, weather } = req.body;
    res.send(await eventsService.updateEvents(events, weather));
});

router.get('/weather', async (req, res) => {
    return res.json(await eventsService.getWeatherForecast());
});

router.get('/calendar', async (req, res) => {
    return res.json(await eventsService.getCalendarEvents());
});

module.exports = router;
