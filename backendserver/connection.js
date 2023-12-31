const {Client} = require('pg')
require('dotenv').config();

console.log(process.env.PGHOST);

const client = new Client({
    host: process.env.PGHOST,
    user: process.env.PGUSER,
    port: process.env.PGPORT,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE
})

module.exports = client