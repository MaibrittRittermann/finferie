const express = require('express');
const router = express.Router();
const { Appartment, validate } = require('../model/appartment');

router.get('/', async (req, res) => {
    res.send(await Appartment.find());
});

router.get('/:id', async (req, res) => {
    const appartment = await Appartment.findById(req.params.id);
    if (!appartment) return res.status(404).send("The requested appartment does not exist");

    res.send(appartment);
});

module.exports = router;