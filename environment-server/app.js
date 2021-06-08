const express = require('express');
const path = require('path');
const fetch = require('node-fetch');
const util = require('util');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

const getWeather = require('./requests/weather').getWeather;
const getEvents = require('./requests/events').getHolidays;

setInterval(async () => {
  const serverIP = "http://19.0.0.4";
  const hostId = "3";
  const forecast = await getWeather().then(weather => weather);
  const events = await getEvents(new Date().getFullYear(),new Date().getMonth() + 1);
  fetch(`${serverIP}/${hostId}`, { method: 'POST', body: JSON.stringify({weather:forecast,events:events})})
    .then(res => {
      console.log(res.status);
      return res.json();
    })
    .then(json => console.log(util.inspect(json)))
    .catch(err => console.log(err));
},60*1000)

module.exports = app;