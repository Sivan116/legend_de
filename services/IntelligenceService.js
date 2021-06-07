const pool =  require('../db/config');

const getAll = () => {
    return reports = [
        {
            first_name: 'Tom',
            last_name: 'Marzea',
            id: '123456789'
        },
        {
            first_name: 'Sivan',
            last_name: 'Fried',
            id: '987654321'
        }
    ]
}

module.exports = {
    getAll,
};