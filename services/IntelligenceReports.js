const axios = require('axios');
const pool =  require('../db/config');
const format = require('pg-format');

const getSuspects = async () => {
    axios.get('http://intelligence-api-git-2-intelapp1.apps.openforce.openforce.biz/api/suspects')
  .then(response => {

    return JSON.stringify(getSuspectsReport(JSON.parse(response.data)));
  })
  .catch(error => {
    return await pool.query('SELECT * FROM t_suspect_wanted')
                        .then(res => { return res.rows; });
  });
}

const getSuspectsReport = (suspects) => {
    let suspectsToBackup= [];

    suspects = suspects.map(suspect => {
        suspectsToBackup.push([suspect.person.id, suspect.person.firstName, suspect.person.lastName, suspect.person.phoneNumber, suspect.person.adress, suspect.person.personImageUrl, suspect.started, suspect.wanted]);
        return {"firstName":suspect.person.firstName, "lastName": suspect.person.lastName, "id": suspect.person.id};
        
    });
    backupSuspects(suspects);
    return suspects;
}

const backupSuspects = (suspects) => {
    const upsertSql = format('INSERT INTO t_suspects_wanted (personId, firstName, lastName, phoneNumber, adress, personImageURL, started, wanted)' +
     'VALUES %L ON CONFLICT ON personId' + 
    'DO UPDATE SET' +  
    'firstName=EXLUDED.firstName, lastName=EXLUDED.lastName, phoneNumber=EXLUDED.phoneNumber, adress=EXLUDED.adress, personImageURL=EXLUDED.personImageURL, started=EXLUDED.started, wanted=EXLUDED.wanted;', suspects); 

    pool.query(upsertSql).then(res => { return res.rows[0];});;
}

module.exports = {getSuspects};