const mongoose =  require('mongoose');

const ingredientsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    units: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Ingredients', ingredientsSchema, 'ingredients');