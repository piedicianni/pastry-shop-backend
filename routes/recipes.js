const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const params = require('../constants/params');
const Recipes = require('../models/recipesModel');
const Ingredients = require('../models/ingredientsModel');
const {
    ingredientsId,
    ingredientsWithinRecipes,
    getIngredientsInfo
} = require('../utils/utils');

const invalidTokenMessage = () => ({ error: 'Invalid token.' });

router.get('/', async (req, res) => {
    try {
        const recipes = await Recipes.find().lean();
        const ingredientsId = ingredientsWithinRecipes(recipes);
        const ingredients = await Ingredients.find(
            {
                _id: { $in: ingredientsId }
            }
        ).lean();
        const recipeWithIngredientsInfo = recipes.map(recipe => {
            return { ...recipe, ingredients: getIngredientsInfo(recipe.ingredients, ingredients) }
        });
        res.json(recipeWithIngredientsInfo);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/', authorization, async (req, res) => {
    const { name, price, ingredients, sale } = req.body;
    const recipe = new Recipes({
        name,
        price,
        ingredients,
        sale,
        dateOnSale: sale ? new Date() : new Date(0)
    });
    try {
        const newRecipe = await recipe.save();
        res.status(201).json(newRecipe);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.patch('/', authorization, async (req, res) => {
    const { _id, name, price, ingredients: ingredientsParam, sale } = req.body;

    try{
        const recipe = await Recipes.findById(_id);
        if(name != null) recipe.name = name;
        if(price != null) recipe.price = price;
        if(ingredientsParam != null) recipe.ingredients = ingredientsParam;
        if(sale != null) {
            recipe.sale = sale;
            recipe.dateOnSale = sale ? new Date() : new Date(0);
        }
        const updatedRecipe = await recipe.save();
        res.json({result: 'ok'});
    }catch(error){
        res.status(400).json({ error: error.message });
    }
});

// Auth middleware
function authorization(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader ? authHeader.split(' ')[1] : null;
    if (token == null) return res.status(401).json(invalidTokenMessage());
    try {
        const admin = jwt.verify(token, params.JWD_SECRET_KEY);
        if (!admin) return res.status(401).json(invalidTokenMessage());
    } catch (error) {
        return res.status(401).json(invalidTokenMessage());
    }
    next();
}

module.exports = router;