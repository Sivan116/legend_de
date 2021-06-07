require('dotenv').config();
const { Pool } = require('pg');
const isProduction = process.env.NODE_ENV === 'production'

const connectionString = `postgresql://postgresql:d3Jp1dac81k@172.30.210.131:5432/postgresql`;

                          // postgres://username:password@host:port/database
const pool = new Pool({
    connectionString: connectionString,
});

module.exports = pool;
