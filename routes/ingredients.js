const express = require('express');
const router = express.Router();
const Ingredients = require('../models/ingredientsModel');

router.get('/', async (req, res) => {
    const { email, password } = req.body;
    try {
        const ingredients = await Ingredients.find();
        res.json(ingredients);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;