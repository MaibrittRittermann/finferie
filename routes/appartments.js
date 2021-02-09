const express = require('express');
const router = express.Router();
const { Appartment, validate } = require('../model/appartment');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const validateobjectId = require('../middleware/validateObjectId');

router.get('/', async (req, res) => {
    res.send(await Appartment.find());
});

router.get('/:id', validateobjectId, async (req, res) => {
    const appartment = await Appartment.findById(req.params.id);
    if (!appartment) return res.status(404).send("The requested appartment does not exist");

    res.send(appartment);
});

router.post('/', [auth, admin],  async (req, res) => {
    const {error} = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const appartment = new Appartment({ 
        name: req.body.name,
        excerpt: req.body.excerpt,
        description: req.body.description,
        address: req.body.address,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country,
        images: req.body.images,
        bullets: req.body.bullets,
        hotelbullets: req.body.hotelbullets,
        highSeasonPrice: req.body.highSeasonPrice,
        lowSeasonPrice: req.body.lowSeasonPrice
     }); 

    try {
        await appartment.save();
        res.send(appartment);
    } catch (e) {
        console.log(e.message);
    }
});

router.put('/:id', [auth, admin, validateobjectId], async (req, res) => {

    const {error} = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const appartment = await Appartment.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        excerpt: req.body.excerpt,
        description: req.body.description,
        address: req.body.address,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country,
        images: req.body.images,
        bullets: req.body.bullets,
        hotelbullets: req.body.hotelbullets,
        highSeasonPrice: req.body.highSeasonPrice,
        lowSeasonPrice: req.body.lowSeasonPrice
    }, {new : true});

    if(!appartment) return res.status(404).send('The appartment with the given ID does not exist');

    res.send(appartment);
});

router.delete('/:id', [auth, admin, validateobjectId], async (req, res) => {

    const appartment = await Appartment.findByIdAndDelete(req.params.id);
    
    if(!appartment) return res.status(404).send('The appartment with the given ID does not exist');

    res.send(appartment);
});

module.exports = router;