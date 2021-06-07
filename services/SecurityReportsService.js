const axios = require('axios');
const pool =  require('../db/config');
const format = require('pg-format');

const getReports = async () => {
    axios.get('')
  .then(response => {
    const parsedData = parseReports(response.data);

    return parsedData;
  })
  .catch(error => {
    return await pool.query('SELECT * FROM t_reports')
                        .then(res => { return res.rows; });
  });
}

const getReportById = (id) => {
    axios.get('')
  .then(response => {

    return response.data;
  })
  .catch(error => {
    throw error("can't get reports");
  });
}

const backupReports = (reportsArr) => {
    const upsertSql = format('INSERT INTO t_events (report_id, ev_type, ev_time, ev_loc)' +
     'VALUES %L ON CONFLICT ON report_id' + 
    'DO UPDATE SET ev_type=EXLUDED.ev_type, ev_time=EXLUDED.ev_time, ev_type=EXLUDED.ev_time;', reportsArr); 

    pool.query(upsertSql).then(res => { return res.rows[0];});;
}

const parseReports = (reports) => {
    reports = JSON.parse(reports);
    let reportsArr = [];
    reports = reports.reports.map(report => {
        reportsArr.push([report.report_id, report.ev_type, report.ev_time, report.ev_loc]);
        return {"ev_type": report.ev_type, "ev_time": report.ev_time, "ev_loc":report.ev_loc}
    });
    backupReports(reportsArr);
    return reports;
}



module.exports = {getReports, getReportById};