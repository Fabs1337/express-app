const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    connectionLimit: 100,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

async function query(sql, params) {
    try {
        const [result] = await pool.execute(sql, params);
        return result;
    } catch (error) {
        throw error;
    }
}

async function checkConnection() {
    try {
        await pool.query('SELECT 1');
        console.log('Connected to the MySQL server.');
    } catch (err) {
        console.error('Error connecting to MySQL server:', err);
    }
}

module.exports = { query, checkConnection };