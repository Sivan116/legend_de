const axios = require('axios');
const pool =  require('../db/config');
const pgFormat = require('pg-format');

const getSuspects = async () => {
   return axios.get('http://intelligence-api-git-2-intelapp1.apps.openforce.openforce.biz/api/suspects', { timeout: 9000 })
  .then(response => {
    return removeWantedProperty(parseSuspects(response.data).filter(suspect => { return suspect.wanted === false }));
  })
  .catch(err => {
    return pool.query('SELECT * FROM t_suspects_wanted;')
                        .then(res => { return removeWantedProperty(parseSuspectsFromDBBackup(res.rows)); });
  });
}

const parseSuspects = async (suspects) => {
    let suspectsToBackup = [];

    suspects = suspects.map(suspect => {
        suspectsToBackup.push([suspect.person.id, suspect.person.firstName, suspect.person.lastName, suspect.person.phoneNumber, suspect.person.address, suspect.person.personImageUrl, suspect.started, suspect.wanted]);
        return {"firstName":suspect.person.firstName, "lastName": suspect.person.lastName, "id": suspect.person.id, "wanted": suspect.wanted };
        
    });
    if (suspectsToBackup) {
      await backupSuspects(suspectsToBackup);
    }
    return suspects;
}

const parseSuspectsFromDBBackup = (suspects) => {
  return suspects.map(suspect => {
      return {"firstName":suspect.firstname, "lastName": suspect.lastname, "id": suspect.personid, "wanted": suspect.wanted };
  });
}

const backupSuspects = async (suspectsToBackup) => {
    const upsertSql = pgFormat(
      'INSERT INTO t_suspects_wanted(personid, firstname, lastname, phonenumber, address, personimageurl, started, wanted) ' +
      'VALUES %L ' +
      'ON CONFLICT (personId) ' + 
      'DO UPDATE SET ' +  
      'firstName=EXCLUDED.firstName, lastName=EXCLUDED.lastName, phoneNumber=EXCLUDED.phoneNumber, address=EXCLUDED.address, personImageURL=EXCLUDED.personImageURL, started=EXCLUDED.started, wanted=EXCLUDED.wanted;', suspectsToBackup); 
    
    await pool.query(upsertSql);
}

const getWanted = async () => {
    return axios.get('http://intelligence-api-git-2-intelapp1.apps.openforce.openforce.biz/api/suspects/wanted', { timeout: 9000 })
  .then(response => {
    return removeWantedProperty(parseSuspects(response.data).filter(suspect => { return suspect.wanted === true }));
  })
  .catch(error => {
    return pool.query('SELECT * FROM t_suspects_wanted WHERE wanted = true')
                        .then(res => { return removeWantedProperty(parseSuspectsFromDBBackup(res.rows)); });
  });
}

const removeWantedProperty = (suspects) => {
  return suspects.map(suspect =>  { return {
    "firstName": suspect.firstName, "lastName": suspect.lastName, "id": suspect.id
  }});
}

module.exports = { 
    getSuspects,
    getWanted
};