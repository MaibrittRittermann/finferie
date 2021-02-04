const express = require('express');
const customers = require('../routes/customers');
const appartments = require('../routes/appartments');
const users = require('../routes/users');
const auth = require('../routes/auth');
const booking = require('../routes/bookings');
const logger = require('../startup/logging')();

module.exports = function (app) {
    app.use(express.json());
    app.use('/api/customers', customers);
    app.use('/api/users', users);
    app.use('/api/appartments', appartments);
    app.use('/api/bookings', booking);
    app.use('/api/auth', auth);

    app.use(function(err, req, res, next) {
        logger.error(err.message, err);
        res.status(500).send('Something failed');
    });
}