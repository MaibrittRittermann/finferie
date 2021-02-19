const express = require('express');
const router = express.Router();
const {Review, validate} = require('../model/review');
const {Appartment} = require('../model/appartment');
const {Customer} = require('../model/customer');
const auth = require('../middleware/auth');
const validateObjectId = require('../middleware/validateObjectId');

router.get('/:id', validateObjectId, async(req, res) => {
    const reviews = await Review.find({'appartment': req.params.id});
    res.send(reviews);
});

router.post('/', auth, async(req, res) => {
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const customer = await Customer.findById(req.body.customer);
    if(!customer) return res.status(400).send('No such customer');
    
    const appartment = await Appartment.findById(req.body.appartment);
    if(!appartment) return res.status(400).send('No such appartment');
    
    const review = new Review({
        appartment: appartment._id,
        customer: customer._id,
        date: new Date().getTime(),
        review: req.body.review,
        stars: req.body.stars    
    });
    await review.save();

    res.send(review);  
});

router.delete('/:id', [auth, validateObjectId], async(req, res) => {
    const review = await Review.findByIdAndDelete(req.params.id);
    if(!review) return res.status(404).send('The review with the given ID does not exist');
    res.send(review);
});

module.exports = router;




