const fetch = require('node-fetch');
const util = require('util')

const API_URL = "https://api.tomorrow.io/v4/timelines";
const API_KEY = "RHDNMqpd5gW52TRQqam89FwUkh6fIPBl";
const LOC_LAT = "-73.98529171943665"
const LOC_LON = "40.75872069597532"

/**
 *@description GET apparent temperature,temperature,humidity,and wind speed from the api  */
exports.getWeather = async () => {
    fetch(`${API_URL}?location=${LOC_LAT},${LOC_LON}&\
fields=temperatureApparent,temperature,humidity,windSpeed&\
timesteps=1d&\
units=metric&apikey=${API_KEY}`)
    .then(response => response.json())
    .then(data => console.log(console.log(util.inspect(data, {showHidden: false, depth: null}))));
}