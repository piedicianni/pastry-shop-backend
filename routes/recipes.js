const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { JWD_SECRET_KEY } = require('../constants/params');
const Recipes = require('../models/recipesModel');
const Ingredients = require('../models/ingredientsModel');
const {
    ingredientsWithinRecipes,
    getIngredientsInfo,
    priceAccordingDaysOnSale,
    numberOfDayBetweenTwoDate
} = require('../utils/utils');

const invalidTokenMessage = () => ({ error: 'Invalid token.' });

router.get('/', async (req, res) => {
    const authHeader = req.headers['authorization'];
    const isAuth = userAdminAuthorized(authHeader);
    const recipesQuery = !isAuth ? { sale: true } : {};
    try {
        const recipes = await Recipes.find(recipesQuery).lean();
        const ingredientsId = ingredientsWithinRecipes(recipes);
        const ingredients = await Ingredients.find(
            {
                _id: { $in: ingredientsId }
            }
        ).lean();
        const recipesExpired = [];
        const recipeWithIngredientsInfo = recipes.map(recipe => {
            const dayOnSale = numberOfDayBetweenTwoDate(new Date(recipe.dateOnSale));
            const price = priceAccordingDaysOnSale(recipe.price, dayOnSale);
            if (price === 0 && recipe.sale) recipesExpired.push(recipe._id);
            return {
                ...recipe,
                price: price,
                sale: price !== 0,
                ingredients: getIngredientsInfo(recipe.ingredients, ingredients)
            }
        });
        await Recipes.updateMany({
            _id: { $in: recipesExpired }
        }, {
            $set: { sale: false }
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

router.patch('/:_id', authorization, async (req, res) => {
    const { name, price, ingredients: ingredientsParam, sale } = req.body;
    try {
        const recipe = await Recipes.findById(req.params._id);
        if (name != null) recipe.name = name;
        if (price != null) recipe.price = price;
        if (ingredientsParam != null) recipe.ingredients = ingredientsParam;
        if (sale != null) {
            recipe.sale = sale;
            recipe.dateOnSale = sale ? new Date() : new Date(0);
        }
        const updatedRecipe = await recipe.save();
        res.json({ result: 'ok' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.delete('/:_id', authorization, async (req, res) => {
    try {
        const recipe = await Recipes.findById(req.params._id);
        await recipe.remove();
        res.json({ result: 'ok' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Auth middleware
function authorization(req, res, next) {
    const authHeader = req.headers['authorization'];
    /* const token = authHeader ? authHeader.split(' ')[1] : null;
    if (token == null) return res.status(401).json(invalidTokenMessage());
    try {
        const admin = jwt.verify(token, JWD_SECRET_KEY);
        if (!admin) return res.status(401).json(invalidTokenMessage());
    } catch (error) {
        return res.status(401).json(invalidTokenMessage());
    } */
    const isAuth = userAdminAuthorized(authHeader);
    if (!isAuth) return res.status(401).json(invalidTokenMessage());
    next();
}

const userAdminAuthorized = (authHeader) => {
    const token = authHeader ? authHeader.split(' ')[1] : null;
    if (token == null) return false;
    try {
        const admin = jwt.verify(token, JWD_SECRET_KEY);
        if (!admin) return false;
    } catch (error) {
        return false;
    }
    return true;
};

module.exports = router;