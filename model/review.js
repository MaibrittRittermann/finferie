const Joi = require('joi');
const mongoose = require('mongoose');
const { number } = require('joi');

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
        type : mongoose.Schema.Types.ObjectId,
        ref: 'customer',
        required: true
    },
    appartment : {
        type : mongoose.Schema.Types.ObjectId,
        ref: 'appartment',
        required: true
    },
    stars : {
        type: Number,
        required: true
    }
});

const Review = mongoose.model('Review', reviewSchema);

function validate(review) {
    const schema = Joi.object({
        date: Joi.Date().required(),
        review: Joi.String().min(10). max(1000).required(),   
        customer: Joi.ObjectId().required(),
        appartment: Joi.ObjectId().required(),
        stars: Joi.number().min(0).max(5).required()
    });
    return schema.validate(review);
}

module.exports.Review = Review;
module.exports.validate = validate;