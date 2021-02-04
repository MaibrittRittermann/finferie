const express = require('express');
const router = express.Router();
const validateobjectId = require('../middleware/validateObjectId');
const {Customer, validate } = require('../model/customer');
const auth = require('../middleware/auth');

router.get('/', [auth, admin], async (req, res) => {
    res.send(await Customer.find().sort('name'));
});

router.get('/:id', auth, validateobjectId, async (req, res) => {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).send("The customer with the given ID does not exist"); 
    res.send(customer);
})

router.post('/',  async (req, res) => {
    const {error} = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let customer = await Customer.findOne({email: req.body.email});
    if(customer) return res.status(400).send('Customer allready registered');

    customer = new Customer({ 
        name: req.body.name,
        phone: req.body.phone,
        email: req.body.email,
        address: req.body.address,
        zip: req.body.zip,
        city: req.body.city
     }); 

    try {
        await customer.save();
        res.send(customer);
    } catch (e) {
        console.log(e.message);
    }
});

router.put('/:id', [auth, validateobjectId], async (req, res) => {

    const {error} = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const customer = await Customer.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        phone: req.body.phone,
        email: req.body.email,
        address: req.body.address,
        zip: req.body.zip,
        city: req.body.city
    }, {new : true});

    if(!customer) return res.status(404).send('The customer with the given ID does not exist');

    res.send(customer);
});

router.delete('/:id', [auth, validateobjectId], async (req, res) => {

    const customer = await Customer.findByIdAndDelete(req.params.id);
    
    if(!customer) return res.status(404).send('The customer with the given ID does not exist');

    res.send(customer);
});

module.exports = router;