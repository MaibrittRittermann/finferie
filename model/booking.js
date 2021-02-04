const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');

const bookingSchema = mongoose.Schema({
    appartment: {
        type: new mongoose.Schema({
            _id: {
                type: mongoose.Types.ObjectId,
                required: true
            },
            name: {
                type: String,
                required: true
            }
        }), 
    },
    customer: {
        type : mongoose.Schema.Types.ObjectId,
        ref: 'customer',
        required: true
    },
    tennents: [{
        name: {
            type: String,
            minlength: 2,
            maxlength: 255,
        },
        age: {
            type: Number,
            min: 0,
            max: 120
        }
    }],
    dateFrom: {
        type: Date,
        required: true
    },
    dateTo:{
        type: Date,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
});

const Booking = mongoose.model('bookings', bookingSchema);

function validate(booking) {
    const schema = Joi.object({
        appartment: Joi.objectId().required(),
        customer: Joi.objectId().required(),
        tennents: Joi.array().items({
            name: Joi.string().required(),
            age: Joi.number().required()
        }).min(1),
        dateFrom: Joi.date().required(),
        dateTo: Joi.date().required(),
        price: Joi.number().min(0).required()
    });
    return schema.validate(booking);
}

module.exports.Booking = Booking;
module.exports.validate = validate;