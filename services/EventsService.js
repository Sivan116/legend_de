const pool =  require('../db/config');
const pgFormat = require('pg-format');

const updateEvents = async (newCaledarEvents, newWeatherForecast) => {
    return (await updateWeather(newWeatherForecast) && await updateCalendar(newCaledarEvents));
}
const updateWeather = async (newWeatherForecast) => {
    firstWeatherRow = await pool.query('SELECT * FROM t_weather ORDER BY time LIMIT 1')
                                .then(res => { return res.rows[0] })
    if(firstWeatherRow.time.getDay() !== new Date().getDay()) {
        const twoDArrayToInsert = [];
        newWeatherForecast.map(day => 
            twoDArrayToInsert.push([day.time, day.temperatureApparent,
                                   day.temperature, day.humidity, day.windSpeed]));
        const query = pgFormat(
        'DELETE FROM t_weather; ' + 
        'INSERT INTO t_weather(time, temperatureApparent, temperature, humidity, windSpeed) ' +
        'VALUES %L; ', twoDArrayToInsert)                        
        await pool.query(query);
    }
}

const getWeatherForecast = async () => {
    return pool.query('SELECT * FROM t_weather')
                        .then(res => { return res.rows; });
}

const updateCalendar = async (newCaledarEvents) => {
    const twoDArrayToInsert = [];
    newCaledarEvents.map(event => 
        twoDArrayToInsert.push([event.name, event.description,
                               event.country, event.date]));

    const upsertSql = pgFormat(
     'INSERT INTO t_calendar_events(name, description, country, date) ' +
     'VALUES %L ' +
     'ON CONFLICT (name) ' + 
     'DO UPDATE SET description=EXCLUDED.description, country=EXCLUDED.country, date=EXCLUDED.date;', twoDArrayToInsert); 

    pool.query(upsertSql).then(res => { return res.rows[0]; });
}

const getCalendarEvents = async () => {
    return await pool.query('SELECT * FROM t_calendar_events')
                        .then(res => { return res.rows; });
}

module.exports = {
    updateEvents,
    getWeatherForecast,
    updateCalendar,
    getCalendarEvents
};
