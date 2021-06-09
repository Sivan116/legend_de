const pool =  require('../db/config');
const pgFormat = require('pg-format');

const updateWeather = async (newWeatherForecast) => {
    firstWeatherRow = await pool.query('SELECT * FROM t_weather ORDER BY time LIMIT 1')
                                .then(res => { return res.rows[0] })
    if(firstWeatherRow.time.getDay() !== new Date().getDay()) {
        const twoDArrayToInsert = [];
        newWeatherForecast.map(day => 
            twoDArrayToInsert.push([day.time, day.temperatureApparent,
                                   day.temperature, day.humidity, day.windSpeed]));
        await pool.query('DELETE FROM t_weather')
                  .then( () => { 
                        pool.query(pgFormat('INSERT INTO t_weather' + 
                                           '(time, temperatureApparent, temperature, humidity, windSpeed)' +
                                           'VALUES %L ', twoDArrayToInsert)) });
    }
}

const getWeatherForecast = async () => {
    return await pool.query('SELECT * FROM t_weather')
                        .then(res => { return res.rows; });
}

const updateCalendar = async (newCaledarEvents) => {
    const twoDArrayToInsert = [];
    newCaledarEvents.map(event => 
        twoDArrayToInsert.push([event.name, event.description,
                               event.country, event.date]));

    const upsertSql = format('INSERT INTO t_calendar_events (name, description, country, date)' +
     'VALUES %L ON CONFLICT ON name' + 
     'DO UPDATE SET description=EXLUDED.description, country=EXLUDED.country, date=EXLUDED.date;', twoDArrayToInsert); 

    pool.query(upsertSql).then(res => { return res.rows[0]; });
}

const getCalendarEvents = async () => {
    return await pool.query('SELECT * FROM t_calendar_events')
                        .then(res => { return res.rows; });
}

module.exports = {
    updateWeather,
    getWeatherForecast,
    updateCalendar,
    getCalendarEvents
};
