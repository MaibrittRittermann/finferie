const Joi = require('joi');
const mongoose = require('mongoose');
const { customerSchema } = require('./customer');
const { appartmentSchema } = require('./appartment');

const reviewSchema = mongoose.Schema({
    date: {
        type: Date,
        required: true
    },
    review: {
        type: String,
        required: true,
        maxlength: 1000,
        minlength: 10
    },
    customer: {
        type: customerSchema,
        required: true
    },
    appartment : {
        type: appartmentSchema,
        required: true
    }
});

const Review = mongoose.model('Review', reviewSchema);

function validate(review) {
    const schema = Joi.object({
        date: Joi.Date().required(),
        review: Joi.String().min(10). max(1000).required(),   
        customer: Joi.ObjectId().required(),
        appartment: Joi.ObjectId().required()
    });
    return schema.validate(review);
}

module.exports.Review = Review;
module.exports.validate = validate;