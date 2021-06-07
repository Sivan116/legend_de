const axios = require('axios');
const pool =  require('../db/config');
const format = require('pg-format');

const getSuspects = async () => {
    axios.get('')
  .then(response => {
    try{
        const people = JSON.parse(await getPeople());
    } catch (e) {
        return await pool.query('SELECT * FROM t_suspect_wanted')
                        .then(res => { return res.rows; });
    }
    
    return getSuspectsReport(JSON.parse(response.data), people);
  })
  .catch(error => {
    return await pool.query('SELECT * FROM t_suspect_wanted')
                        .then(res => { return res.rows; });
  });
}

const getPeople = async () => {
    axios.get('')
  .then(response => {
    return response.data;
  })
  .catch(error => {
    throw error("can't get reports");
  });
}

const getSuspectsReport = (suspects, people) => {
    const suspectsId = suspects.Suspect_Table.map(suspect => suspect.person_id);
    let suspectsArr = [];

    suspects = people.peopleTable.map(person => {
        if(suspectsId.includes(person.id, person.last_name, person.first_name)){
            suspectsArr.push([,person.first_name]);
            return {"first_name": person.first_name, "last_name": person.last_name, "id": person.id};
        }
    });
    backupSuspects(suspects);
    return suspects;
}

const backupSuspects = (suspectsArr) => {
    const upsertSql = format('INSERT INTO t_suspect_wanted (id, last_name, first_name)' +
     'VALUES %L ON CONFLICT ON report_id' + 
    'DO UPDATE SET ev_type=EXLUDED.ev_type, ev_time=EXLUDED.ev_time, ev_type=EXLUDED.ev_time;', reportsArr); 

    pool.query(upsertSql).then(res => { return res.rows[0];});;
}

module.exports = {getSuspects};