const axios = require('axios');
const pool =  require('../db/config');
const format = require('pg-format');

const getReports = async () => {
  return axios.get('http://police-site-server-git-sivan-securityapp1.apps.openforce.openforce.biz/report')
  .then(response => {
    const parsedData = parseReports(response.data);

    return JSON.stringify(parsedData);
  })
  .catch(error => {
    return pool.query('SELECT * FROM t_reports')
                        .then(res => { return res.rows; });
  });
}

const getReportById = async (id) => {
  return axios.get(`http://police-site-server-git-sivan-securityapp1.apps.openforce.openforce.biz/accident/id/${id}}`)//TODO get Secutiry API
  .then(response => {

    return response.data; 
  })
  .catch(error => {
    throw error("can't get reports");
  });
}

const parseReports = (reportsJSON) => {
    reportsJSON = JSON.parse(reportsJSON);
    let reportsToBackup = [];
    reportsJSON = reportsJSON.reports.map(report => {
        reportsToBackup.push([report.ev_type, report.ev_time, report.ev_report_time, report.reporter_id, report.ev_loc, report.report_id]);
        return {"report_id": report.report_id,"ev_type": report.ev_type, "ev_time": report.ev_time, "ev_loc": report.ev_loc};
    });
    backupReports(reportsToBackup);
    return reports;
}

const backupReports = (reportsArr) => {
    const upsertSql = format('INSERT INTO t_events (ev_type, ev_time,ev_report_time, reporter_id, ev_loc, report_id)' +
     'VALUES %L ON CONFLICT ON report_id' + 
    'DO UPDATE SET ev_type=EXLUDED.ev_type, ev_time=EXLUDED.ev_time, ev_report_time=EXLUDED.ev_report_time, ev_loc=EXLUDED.ev_loc, reporter_id=EXLUDED.reporter_id;', reportsArr); 

    pool.query(upsertSql).then(res => { return res.rows[0]; });
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

const updateReportsThreshold = async (day, newThreshold) => {
  const query = {
    name: 'update-report-threshold',
    text: 'UPDATE t_reports_threshold SET threshold = $2 WHERE day = $1 ', 
    values: [day, newThreshold],
  }

  return await pool.query(query); 
}

module.exports = { 
  getReports,
  getReportById,
  reportsByDate,
  getReportsThreshold,
  getReportsThresholdByDay,
  updateReportsThreshold
};