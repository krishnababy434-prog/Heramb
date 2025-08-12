#!/usr/bin/env node
const mysql = require('mysql2/promise');
require('dotenv').config();

(async () => {
  const host = process.env.DB_HOST || 'localhost';
  const port = Number(process.env.DB_PORT || 3306);
  const user = process.env.DB_USER || 'root';
  const password = process.env.DB_PASSWORD || '';
  const database = process.env.DB_NAME || '';

  console.log(`Attempting MySQL connect to ${user}@${host}:${port}/${database}...`);
  try {
    const conn = await mysql.createConnection({ host, port, user, password, database });
    const [rows] = await conn.query('SELECT 1 AS ok');
    console.log('Connection OK:', rows);
    await conn.end();
    process.exit(0);
  } catch (err) {
    console.error('Connection FAILED:', err.message);
    process.exit(1);
  }
})();