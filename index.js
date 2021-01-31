const express = require('express');
const app = express();
const logger = require('./startup/logging')();
require('./startup/config')();
require('./startup/validate');
require('./startup/db');
require('./startup/routes')(app);

const port = process.env.PORT || 3000;
const server = app.listen(port, () => logger.info(`listening on port ${port}`));

module.exports = server;