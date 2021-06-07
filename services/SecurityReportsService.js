const axios = require('axios');

const getReports = async () => {
    axios.get('')
  .then(response => {
    await pool.query('SELECT * FROM t_suspect_wanted')
                        .then(res => { return res.rows; });
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

const parseReports = (reports) => {
    reports = JSON.parse(reports);
    return reports.reports.map(report => {return {"ev_type": report.ev_type, "ev_time": report.ev_time, "ev_loc":report.ev_loc}});
}

module.exports = {getReports};