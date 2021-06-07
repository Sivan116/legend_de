require('dotenv').config();
const { Pool } = require('pg');
const isProduction = process.env.NODE_ENV === 'production'

const connectionString = `postgresql://asd:asd@172.30.210.131:5432/asd`;

                          // postgres://username:password@host:port/database
const pool = new Pool({
    connectionString: connectionString,
});

module.exports = pool;
