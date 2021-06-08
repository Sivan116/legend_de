const axios = require('axios');
const pool =  require('../db/config');
const format = require('pg-format');

const getReports = async () => {
    axios.get('')//TODO get Secutiry API
  .then(response => {
    const parsedData = parseReports(response.data);

    return JSON.stringify(parsedData);
  })
  .catch(error => {
    return pool.query('SELECT * FROM t_reports')
                        .then(res => { return res.rows; });
  });
}

const getReportsForWeek = async () => {
    const week = [];
    let allReports = JSON.parse( await getReports());

    for(let day = new Date(); day < new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);  day.setDate(day.getDate() - 1)){
        const dayEvents = allReports.filter(report => report.ev_time === day);
        week.push({date: day, count: dayEvents.length});
    }

    return JSON.stringify(week);
  
}

const f = () => {
  let today = new Date();

  let allReports = [
        {
          ev_type: "stabbing",
          ev_time: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 2),
          ev_report_time: "datetime",
          reporter_id: "policeman 1 id",
          ev_loc: "location",
          report_id: "1",
        },
        {
          ev_type: "shooting",
          ev_time: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 2),
          ev_report_time: "datetime",
          reporter_id: "policeman 3 id",
          ev_loc: "location",
          report_id: "2",
        },
        {
          ev_type: "accident",
          ev_time: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1),
          ev_report_time: "datetime",
          reporter_id: "policeman 19 id",
          ev_loc: "location",
          report_id: "3"  ,
        }
      ];
  
  let week = [];
   console.log(allReports);
  
  for(let day = new Date(today); day >= new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);  
  day.setDate(day.getDate() - 1)){
          console.log(day);
          const dayEvents = allReports.filter(report => new Date(report.ev_time).setTime(0,0,0,0) === new Date(day).setTime(0,0,0,0));
          week.push({date: new Date(day), count: dayEvents.length});
      }
      
      console.log(week);
}

const getReportById = async (id) => {
    axios.get('')//TODO get Secutiry API
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

module.exports = { 
  getReports,
  getReportById, 
  f
};