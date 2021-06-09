const axios = require('axios');
const pool =  require('../db/config');
const format = require('pg-format');

const getSuspects = async () => {
   return axios.get('http://intelligence-api-git-2-intelapp1.apps.openforce.openforce.biz/api/suspects')
  .then(response => {
    return getSuspectsReport(response.data).filter(suspect => { return suspect.wanted === false })
                                           .map(suspect =>  { return {
                                                "firstName": suspect.firstName, "lastName": suspect.lastName, "id": suspect.id
                                            }});;
  })
  .catch(error => {
    return pool.query('SELECT * FROM t_suspect_wanted')
                        .then(res => { return res.rows; });
  });
}

const getSuspectsReport = (suspects) => {
    let suspectsToBackup = [];

    suspects = suspects.map(suspect => {
        suspectsToBackup.push([suspect.person.id, suspect.person.firstName, suspect.person.lastName, suspect.person.phoneNumber, suspect.person.adress, suspect.person.personImageUrl, suspect.started, suspect.wanted]);
        return {"firstName":suspect.person.firstName, "lastName": suspect.person.lastName, "id": suspect.person.id, "wanted": suspect.wanted };
        
    });
    backupSuspects(suspectsToBackup);
    return suspects;
}

const backupSuspects = async (suspectsToBackup) => {
    const upsertSql = format('INSERT INTO t_suspects_wanted (personId, firstName, lastName, phoneNumber, adress, personImageURL, started, wanted)' +
     'VALUES %L ON CONFLICT ON personId' + 
    'DO UPDATE SET' +  
    'firstName=EXLUDED.firstName, lastName=EXLUDED.lastName, phoneNumber=EXLUDED.phoneNumber, adress=EXLUDED.adress, personImageURL=EXLUDED.personImageURL, started=EXLUDED.started, wanted=EXLUDED.wanted;', suspectsToBackup); 
    
    await pool.query(upsertSql);
}

const getWanted = async () => {
    return axios.get('http://intelligence-api-git-2-intelapp1.apps.openforce.openforce.biz/api/suspects/wanted')
  .then(response => {
    return getSuspectsReport(response.data).filter(suspect => { return suspect.wanted === true })
                                           .map(suspect =>  { return {
        "firstName": suspect.firstName, "lastName": suspect.lastName, "id": suspect.id
    }});
  })
  .catch(error => {
    return pool.query('SELECT * FROM t_suspect_wanted WHERE wanted = true')
                        .then(res => { return res.rows; });
  });
}

module.exports = { 
    getSuspects,
    getWanted
};