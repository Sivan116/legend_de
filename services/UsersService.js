const pool =  require('../db/config');

const getAll = async () => {
    return await pool.query('SELECT * FROM t_users')
                        .then(res => { return res.rows; });
}

const findUser = async (username, password) => {
    const query = {
        name: 'fetch-user',
        text: 'SELECT * FROM t_users WHERE username = $1 AND password = $2',
        values: [username, password],
      }

    return await pool.query(query).then(res => { return res.rows[0]; });
}

module.exports = {
    getAll,
};
