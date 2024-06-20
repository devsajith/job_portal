const winston = require('winston');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();
const { DATABASE, DB_USER, PASSWORD, HOST, DB_PORT,LOG_FILE_PATH } = process.env;
const { createLogger, format, transports } = require('winston');
require('winston-daily-rotate-file');

const logFormat = format.combine(
    format.timestamp({format: 'MMM-DD-YYYY HH:mm:ss'}),
    format.align(),
    format.printf(info => ` ${[info.timestamp]}-${info.level}: ${info.message}`),
)

const fileTransport = 
    new transports.DailyRotateFile({
        filename:  path.join(process.env.LOG_FILE_PATH,`/job_portal-%DATE%.log`),
        datePattern: 'YYYY-MM-DD',
        maxFiles: '150d',
        format: logFormat

    })
const consoleTransport = new  transports.Console(

    {
        format: logFormat
    }
);
const logConfiguration = {
    'transports': [
        consoleTransport,
        fileTransport
    ]
};
const logger = createLogger(logConfiguration);
logger.info(`Writing log to ${process.env.LOG_FILE_PATH}`);
module.exports= logger;