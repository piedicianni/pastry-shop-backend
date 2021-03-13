const mongoose = require('mongoose');

const recipesSchema = new mongoose.Schema({
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
            id: { type: String },
            value: { type: Number }
        }],
        required: true
    },
    sale: {
        type: Boolean,
        required: true
    },
    dateOnSale: {
        type: Date
    }
});

module.exports = mongoose.model('Recipes', recipesSchema, 'recipes');