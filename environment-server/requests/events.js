const fetch = require('node-fetch');
const util = require('util')

const API_URL = "https://calendarific.com/api/v2/holidays"
const API_KEY = "421b87315c4d8c21260651f6285a5dd4e3ab85ef"


exports.getHolidays = async (year,month) => {
    fetch(`${API_URL}\
?api_key=${API_KEY}\
&country=JO\
&year=${year}\
&month=${month}`)
    .then(response => response.json())
    .then(data => console.log(console.log(util.inspect(data.response, {showHidden: false, depth: null}))));
}