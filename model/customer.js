const mongoose = require('mongoose');
const Joi = require('joi');

const customerSchema = mongoose.Schema({
    name: { 
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    phone: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: 12
    },
    email: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: 255
    },
    address: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: 255
    },
    zip: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 6
    },
    city: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 255
    }
})

const Customer = mongoose.model('Customer', customerSchema);

function validateCustomer(customer) {
    const schema = Joi.object({
        name: Joi.string().min(5).max(255).required(),
        phone: Joi.string().min(8).max(12).regex(/^\d+$/).required(),
        email: Joi.string().min(8).max(225).required(),
        address: Joi.string().min(8).max(225).required(),
        zip: Joi.string().min(4).max(6).regex(/^\d+$/).required(),
        city: Joi.string().min(2).max(255).required()
    });
    return schema.validate(customer);
}

exports.Customer = Customer;
exports.customerSchema = customerSchema;
exports.validate = validateCustomer;