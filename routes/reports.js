var express = require('express');
var router = express.Router();
const weatherService = require('../services/WeatherService');

router.post('/', async (req, res) => {
    const { weather } = req.body;
    res.send(await weatherService.updateWeather(weather));
});

router.get('/weather', async (req, res) => {
    return res.json(await weatherService.getWeatherForecast());
});

router.get('/calendar', async (req, res) => {
    return res.json(await weatherService.getWeatherForecast());
});

module.exports = router;