const axios = require('axios');
const pool =  require('../db/config');
const format = require('pg-format');

const getReports = async () => {
    axios.get('')
  .then(response => {
    const parsedData = parseReports(response.data);

    return JSON.stringify(parsedData);
  })
  .catch(error => {
    return await pool.query('SELECT * FROM t_reports')
                        .then(res => { return res.rows; });
  });
}

const getReportById = async (id) => {
    axios.get('')//TODO
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

module.exports = {getReports, getReportById};