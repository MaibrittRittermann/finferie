const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const _ = require('lodash');
const validateObjectId = require('../middleware/validateObjectId');
const { validate, User } = require('../model/user');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

router.get('/', [auth, admin], async (req, res) => {
    res.send(await User.find().sort('name'));
});

router.get('/:id', [auth, admin, validateObjectId], async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).send("The user with the given ID does not exist"); //404
    
    res.send(user);
})

router.post('/', [auth, admin], async (req, res) => {
    const {error} = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({email: req.body.email});
    if(user) return res.status(400).send('User allready registered');

    user = new User(_.pick(req.body, ['name', 'email', 'password', 'isAdmin'])); 
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

router.put('/:id', [auth, admin, validateObjectId], async (req, res) => {

    const {error} = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(req.body.password, salt);

    const user = await User.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        email: req.body.email,
        password: password,
        isAdmin: req.body.isAdmin
    }, {new : true});

    if(!user) return res.status(404).send('The user with the given ID does not exist');

    res.send(user);
});

router.delete('/:id', [auth, admin, validateObjectId], async (req, res) => {

    const user = await User.findByIdAndDelete(req.params.id);
    
    if(!user) return res.status(404).send('The user with the given ID does not exist');

    res.send(user);
});

module.exports = router;