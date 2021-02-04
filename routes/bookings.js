const express = require('express');
const router = express.Router();
const { Booking, validate } = require('../model/booking');
const { Appartment } = require('../model/appartment');
const { Customer } = require('../model/customer');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const validateObjectId = require('../middleware/validateObjectId');

router.get('/', [auth, admin], async (req, res) => {
    res.send(await Booking.find().sort('dateFrom'));
});

router.get('/:id', [auth, validateObjectId] , async (req, res) => {
    const booking = await Booking.findById(req.params.id);
    if(!booking) return res.status(404).send('The booking with the given ID does not exist');
    res.send(booking);
});

router.post('/', async(req, res) => {
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const customer = await Customer.findById(req.body.customer);
    if(!customer) return res.status(400).send('No such customer');
    
    const appartmentDB = await Appartment.findById(req.body.appartment);
    if(!appartmentDB) return res.status(400).send('No such appartment');
     
    const rentDateFrom = new Date(req.body.dateFrom);
    const rentDateTo = new Date(req.body.dateTo);

    // Does Time overlap with other bookings
    const overlap = await Booking.find({
        'appartment._id' : appartmentDB._id,
        'dateFrom' : {$lt: rentDateTo},
        'dateTo' : {$gt: rentDateFrom} 
    });
    
    if (overlap.length !== 0) {
        console.log('POST MSG: Appartment allready booked: ' + overlap);
        return res.status(400).send('Appartment allready booked in this time period');
    }

    const booking = new Booking({
        appartment: {
            _id: appartmentDB._id,
            name: appartmentDB.name
        },
        customer: customer._id,
        tennents: req.body.tennents,
        dateFrom: rentDateFrom,
        dateTo: rentDateTo,
        price: req.body.price
    });
    await booking.save();

    res.send(booking);  
});

module.exports = router;