const fetch = require('node-fetch');

const API_URL = "https://calendarific.com/api/v2/holidays"
const API_KEY = "421b87315c4d8c21260651f6285a5dd4e3ab85ef"

/**
 * @description get holidays for the provided month in year in JO,IL and the US
 */
exports.getHolidays = async (year,month) => {
    const countries = ["JO","IL","US"];
    return ((await Promise.all(countries.map((currentCountry) => {
        return fetch(`${API_URL}\
?api_key=${API_KEY}\
&country=${currentCountry}\
&year=${year}\
&month=${month}`)
        .then(response => response.json())
        .then(data => JSON.stringify(data.response.holidays.map(holiday => {
            holiday.country = holiday.country.id;
            holiday.date = holiday.date.iso;
            delete holiday.locations
            delete holiday.states
            delete holiday.type
            return holiday;
        })))
    }))).reduce((currArr,prevArr) => prevArr.concat(currArr)))
}