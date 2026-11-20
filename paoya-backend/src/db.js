const fs = require('node:fs');
const path = require('node:path');
const mysql = require('mysql2/promise');

const DB_NAME = process.env.DB_NAME || 'paoya_db';

const connectionOptions = {
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  charset: 'utf8mb4',
};

let pool;

function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      ...connectionOptions,
      database: DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
    });
  }
  return pool;
}

async function initDatabase() {
  if (!/^[A-Za-z0-9_]+$/.test(DB_NAME)) {
    throw new Error('DB_NAME may only contain letters, numbers and underscores');
  }

  const bootstrap = await mysql.createConnection(connectionOptions);
  try {
    await bootstrap.query(
      `CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
    );
  } finally {
    await bootstrap.end();
  }

  const schema = fs.readFileSync(path.join(__dirname, '..', 'sql', 'paoya_account.sql'), 'utf8');
  await getPool().query(schema);
}

async function closePool() {
  if (pool) {
    await pool.end();
    pool = undefined;
  }
}

module.exports = { getPool, initDatabase, closePool };
