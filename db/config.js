require('dotenv').config();
const { Pool } = require('pg');
const isProduction = process.env.NODE_ENV === 'production'

const connectionString = `postgresql://postgres:pgsql10@172.30.210.131:5432/postgres`;

                          // postgres://username:password@host:port/database
const pool = new Pool({
    connectionString: connectionString,
});

module.exports = pool;
