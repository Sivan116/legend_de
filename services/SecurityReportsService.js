const pool =  require('../db/config');

const getAll = () => {
    return reports = [
        {
            ev_type: 'Theft',
            ev_time: '12:31',
            ev_loc: 'Brooklyn'
        },
        {
            ev_type: 'Arsent',
            ev_time: '20:15',
            ev_loc: 'Manhatten'
        }
    ]   
}

module.exports = {
    getAll,
};