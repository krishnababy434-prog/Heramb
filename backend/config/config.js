require('dotenv').config();

const {
  DB_HOST = 'localhost',
  DB_PORT = '3306',
  DB_NAME = 'herambdb',
  DB_USER = 'krishna',
  DB_PASSWORD = 'Krishna@123',
} = process.env;

module.exports = {
  development: {
    username: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    host: DB_HOST,
    port: DB_PORT,
    dialect: 'mysql',
    logging: false,
  },
  test: {
    username: DB_USER,
    password: DB_PASSWORD,
    database: `${DB_NAME}_test`,
    host: DB_HOST,
    port: DB_PORT,
    dialect: 'mysql',
    logging: false,
  },
  production: {
    username: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    host: DB_HOST,
    port: DB_PORT,
    dialect: 'mysql',
    logging: false,
  },
};