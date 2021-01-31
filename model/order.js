const Joi = require('joi');
const mongoose = require('mongoose');
const { customerSchema } = require('./customer');
const { appartmentSchema } = require('./appartment');

const orderSchema = mongoose.Schema({
    dateFrom: {
        type: Date,
        required: true
    },
    dateTo: {
        type: Date,
        required: true
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

const Order = mongoose.model('Order', orderSchema);

function validate(order) {
    const schema = Joi.object({
        dateFrom: Joi.Date().required(),
        dateTo: Joi.Date().required(),   
        customer: Joi.ObjectId().required(),
        appartment: Joi.ObjectId().required()
    });
    return schema.validate(order);
}

module.exports.Order = Order;
module.exports.validate = validate;