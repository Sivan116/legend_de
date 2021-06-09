const axios = require('axios');
const pool =  require('../db/config');
const pgFormat = require('pg-format');

const getReports = async () => {
  return axios.get('http://police-site-server-git-sivan-securityapp1.apps.openforce.openforce.biz/report ', { timeout: 9000 })
  .then(response => {
    return parseReports(response.data);
  })
  .catch(error => {
    return pool.query('SELECT * FROM t_reports')
                        .then(res => { return res.rows; });
  });
}

const getReportById = async (type, id) => {
  // Reverse the string because the hebrew characters are reversed when recived.
  type = type.split( '' ).reverse( ).join( '' );
  console.log(type)
  switch (type) {
    case 'תאונה':
      type = 'accident';
      break;
    case 'חטיפה':
        type = 'kidnap';
      break;
    case 'ירי':
        type = 'shooting';
      break;
    case 'דקירה':
        type = 'stabbing';
      break;
  }
  return axios.get(`http://police-site-server-git-sivan-securityapp1.apps.openforce.openforce.biz/${type}/id/${id}`)
  .then(response => {
    return response.data; 
  })
  .catch(err => {
    console.log("Can't fetch from Security by id : (" +type + ', ' + id + ')' );
  });
}

const parseReports = async (reportsJSON) => {
    let reportsToBackup = [];
    reportsJSON = reportsJSON.map(report => {
        reportsToBackup.push([report.ev_type, report.ev_time, report.ev_report_time, report.reporter_id, report.report_id, report.ev_locx, report.ev_locy, report.ev_area]);
        return {"report_id": report.report_id,"ev_type": report.ev_type, "ev_time": report.ev_time, "ev_area": report.ev_area};
    });

    if (reportsToBackup) {
      await backupReports(reportsToBackup);
    }

    return reportsJSON;
}

const backupReports = async (reportsArr) => {

    const upsertSql = pgFormat(
      'INSERT INTO t_reports (ev_type, ev_time, ev_report_time, reporter_id, report_id, ev_locx, ev_locy, ev_area) ' +
      'VALUES %L ' + 
      'ON CONFLICT (report_id) ' + 
      'DO UPDATE SET ' +
      'ev_type=EXCLUDED.ev_type, ev_time=EXCLUDED.ev_time, ev_report_time=EXCLUDED.ev_report_time, reporter_id=EXCLUDED.reporter_id, ev_locx=EXCLUDED.ev_locx, ev_locy=EXCLUDED.ev_locy, ev_area=EXCLUDED.ev_area;', reportsArr); 

    await pool.query(upsertSql);
}

const reportsByDate = (date) => {
  const query = {
    name: 'fetch-report-byDate',
    text: 'SELECT * FROM t_reports WHERE ev_time = date', 
    values: [date],
  }
  return pool.query(query).then(res => { return res.rows; })
                                 .catch(e => console.error(e.stack));
}

const getReportsThreshold = async () => {
  return await pool.query('SELECT * FROM t_reports_threshold').then(res => { return res.rows; });
}

const getReportsThresholdByDay = async (day) => {
  const query = {
    name: 'fetch-threshold-by-day',
    text: 'SELECT * FROM t_reports_threshold WHERE day = $1', 
    values: [day],
  }

  return await pool.query(query).then(res => { return res.rows; });
}

const updateReportsThreshold = async (thresholdArray) => {
  twoDArray = [];

  for (let dayIndex = 0; dayIndex < thresholdArray.length; dayIndex++) {
    twoDArray.push([dayIndex, thresholdArray[dayIndex]])
  }

  const upsertSql = pgFormat(
     'INSERT INTO t_reports_threshold(day, threshold) ' +
     'VALUES %s ' +
     'ON CONFLICT (day) ' + 
     'DO UPDATE SET ' +  
     'threshold = EXCLUDED.threshold;', twoDArray); 

    return await pool.query(upsertSql);
}

const getReportsPreviousWeek = async () => {
  let allReports = await getReports();
  let yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  let week = [];

  for(let day = new Date(yesterday); day >= new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate() - 6); day.setDate(day.getDate() - 1)) {
    const dayEvents = allReports.filter(report => {
    reportDate = new Date(report.ev_time);
    return reportDate.getDate() === day.getDate() &&
            reportDate.getMonth() === day.getMonth() &&
            reportDate.getYear() === day.getYear();
          });
    week.push({date: new Date(day), count: dayEvents.length});
  }

  return week;
}

module.exports = { 
  getReports,
  getReportById,
  reportsByDate,
  getReportsThreshold,
  getReportsThresholdByDay,
  updateReportsThreshold,
  getReportsPreviousWeek
};