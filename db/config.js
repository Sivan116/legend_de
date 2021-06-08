require('dotenv').config();
const { Pool } = require('pg');
const isProduction = process.env.NODE_ENV === 'production'

const connectionString = `postgresql://asd:asd@172.30.130.177:5432/postgres`;

                          // postgres://username:password@host:port/database
const pool = new Pool({
    connectionString: connectionString,
});

module.exports = pool;
