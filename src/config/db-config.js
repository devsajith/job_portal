const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
const LOGGER = require('../utils/logger-util');
const { DATABASE, DB_USER, PASSWORD, HOST, DB_PORT,TIMEZONE } = process.env;
//connecting to DB
const sequelize = new Sequelize({
    dialect: 'mysql',
    database: process.env.DATABASE,
    username:  process.env.DB_USER,
    password: process.env.PASSWORD,
    host: process.env.HOST,
    port: process.env.DB_PORT,
    timezone:process.env.TIMEZONE
});

//testing connection
try {
    sequelize.authenticate();
    LOGGER.info('Database connection established')
} catch (error) {
    LOGGER.error('Unable to connect to db ', error);
}

module.exports = sequelize;
