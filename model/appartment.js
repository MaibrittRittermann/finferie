const Joi = require('joi');
const mongoose = require('mongoose');

const appartmentSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    excerpt: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 250
    },
    description: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 1000
    },
    address: {
        type: String,
        maxlength: 255
    },
    zip: {
        type: Number,
        required: true,
        min: 100,
        max: 100000
    },
    city: {
        type: String,
        maxlength: 255
    },
    country: {
        type: String,
        maxlength: 255
    },
    images : [{
        type: String,
        required: true
    }],
    bullets : [String],
    hotelBullets : [String],
    highSeasonPrice: Number,
    lowSeasonPrice: Number
});

const Appartment = mongoose.model('Appartment', appartmentSchema);

function validate(appartment) {
    const schema = Joi.object({
        name: Joi.string().min(5).max(50).required(),
        excerpt: Joi.string().min(10).max(250).required(),   
        description: Joi.string().min(10).max(1000).required(),
        address: Joi.string().max(255).required(),
        city: Joi.string().max(255).required(),
        zip: Joi.number().min(100).max(100000).required(),
        country: Joi.string().max(255),
        images: Joi.array().items(Joi.string().min(5).max(50)),
        bullets: Joi.array().items(Joi.string()),
        hotelBullets: Joi.array().items(Joi.string()),
        highSeasonPrice: Joi.number(),
        lowSeasonPrice: Joi.number()
    });
    return schema.validate(appartment);
}

module.exports.Appartment = Appartment;
module.exports.validate = validate;
module.exports.appartmentSchema = appartmentSchema;