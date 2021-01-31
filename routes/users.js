const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const _ = require('lodash');
const validateObjectId = require('../middleware/validateObjectId');
const { validate, User } = require('../model/user');

router.get('/', async (req, res) => {
    res.send(await User.find().sort('name'));
});

router.get('/:id', validateObjectId, async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).send("The user with the given ID does not exist"); //404
    
    res.send(user);
})

router.post('/', async (req, res) => {
    const {error} = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({email: req.body.email});
    if(user) return res.status(400).send('User allready registered');

    user = new User(_.pick(req.body, ['name', 'email', 'password'])); 
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    try {
        await user.save();
        const token = user.generateAuthToken();
        res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']));
    } catch (e) {
        console.log(e.message);
    }
});

router.put('/:id', validateObjectId, async (req, res) => {

    const {error} = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const user = await User.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    }, {new : true});

    if(!user) return res.status(404).send('The user with the given ID does not exist');

    res.send(user);
});

router.delete('/:id', validateObjectId, async (req, res) => {

    const user = await User.findByIdAndDelete(req.params.id);
    
    if(!user) return res.status(404).send('The user with the given ID does not exist');

    res.send(user);
});

module.exports = router;