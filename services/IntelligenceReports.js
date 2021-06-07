const axios = require('axios');

const getSuspects = async () => {
    axios.get('')
  .then(response => {
    try{
        const people = JSON.parse(await getPeople());
    } catch (e) {
        return await pool.query('SELECT * FROM t_suspect_wanted')
                        .then(res => { return res.rows; });
    }
    
    return getSuspectsReport( JSON.parse(response.data), people);
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
    people.peopleTable.map(person => {
        if(suspectsId.includes(person.id)){
            return {"first_name": person.first_name, "last_name": person.last_name, "id": person.id};
        }
    });
}

module.exports = {getSuspects};