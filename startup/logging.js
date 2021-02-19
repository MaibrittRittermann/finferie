require('express-async-errors');
const winston = require('winston');

module.exports = function () {
    winston.exceptions.handle(
        new winston.transports.Console({colorize: true, prettyPrint: true}),
        new winston.transports.File({filename:'unCaughtExceptions.log', timestamp: true})
    );

    process.on('unhandledRejection', (ex) => {
        throw ex;
    });

  // If we're not in production then log to the `console` with the format:
  // `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
  
  if (process.env.NODE_ENV !== 'production') {
    winston.add(new winston.transports.Console({
      format: winston.format.simple(),
    }));
  }

  return winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'user-service' },
    transports: [
      new winston.transports.File({ filename: 'error.log', level: 'error', timestamp: true }),
      new winston.transports.File({ filename: 'logfile.log' }),
      new winston.transports.Console()
    ],
  });
}


  




