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
        maxlength: 150
    },
    description: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 1000
    },
    images : [{
        type: String,
        required: true
    }],
    bullets : [String],
    hotelBullets : [String]
});

const Appartment = mongoose.model('Appartment', appartmentSchema);

function validate(appartment) {
    const schema = Joi.object({
        name: Joi.String().minlength(5).maxlength(50).required(),
        excerpt: Joi.String().minlength(10).maxlength(150).required(),   
        description: Joi.String().minlength(10).maxlength(1000).required(),
        images: Joi.array().items(Joi.String().minlength(5).maxlength(50)),
        bullets: Joi.array().items(Joi.String()),
        hotelBullets: Joi.array().items(Joi.String())
    });
    return schema.validate(appartment);
}

module.exports.Appartment = Appartment;
module.exports.validate = validate;
module.exports.appartmentSchema = appartmentSchema;