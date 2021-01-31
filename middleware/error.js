const log = require('../startup/log');

module.exports = function (err, req, res, next) {
    log.error(err.message, err);
    res.status(500).send('Server error - please try again later');
}