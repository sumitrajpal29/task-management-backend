const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

let pool;

if (process.env.APP_ENV === 'development') {
    pool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    });
}
else {
    pool = mysql.createPool({
        socketPath: `/cloudsql/${process.env.INSTANCE_CONNECTION_NAME}`,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    });
}

module.exports = pool;
