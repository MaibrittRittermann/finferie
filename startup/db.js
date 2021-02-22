const mongoose = require('mongoose');
const config = require('config');
const logger = require('../startup/logging')();

module.exports = 
        mongoose.connect(config.get('connectionString'), { 
        useFindAndModify: false, 
        useUnifiedTopology: true, 
        useNewUrlParser: true,
        useCreateIndex: true
    })
        .then(() => logger.info(`Connected to DB`))
        .catch(err => logger.error('DB Error: ', err.message));
