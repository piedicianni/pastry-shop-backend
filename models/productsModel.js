const mongoose = require('mongoose');

const productsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    ingredients: {
        type: [{
            idRef: { type: String },
            value: { type: Number }
        }],
        required: true
    },
    availability: {
        type: Number,
        default: 1
    },
    sale: {
        type: Boolean,
        required: true
    },
    dateOnSale: {
        type: Date
    }
});

module.exports = mongoose.model('Products', productsSchema, 'products');