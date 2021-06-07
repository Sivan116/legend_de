const pool =  require('../db/config');
const bcrypt = require ('bcrypt');

const getAll = async () => {
    return await pool.query('SELECT * FROM t_users')
                        .then(res => { return res.rows; });
}

const authenticateUser = async (username, password) => {
    const query = {
        name: 'fetch-user',
        text: 'SELECT * FROM t_users WHERE username = $1',
        values: [username],
    }

    const User = await pool.query(query).then(res => { return res.rows[0]; });
    if(User) {
        bcrypt.compare(password, User.password, function(err, result) {
            if (result) {
              return true;
            }
            else {
              return false;
            }
        });
    }
}

module.exports = {
    getAll,
    authenticateUser,
};
