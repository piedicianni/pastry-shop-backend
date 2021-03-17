const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { JWT_SECRET_KEY } = require('../constants/constants');
const Products = require('../models/productsModel');
const Ingredients = require('../models/ingredientsModel');
const {
    ingredientsId,
    ingredientsIdWithinProducts,
    getIngredientsInfo,
    priceAccordingDaysOnSale,
    numberOfDayBetweenTwoDate
} = require('../utils/utils');

const invalidTokenMessage = () => ({ error: 'Invalid token.' });
const adjustPrice = (product) => {
    const dayOnSale = numberOfDayBetweenTwoDate(new Date(product.dateOnSale));
    return priceAccordingDaysOnSale(product.price, dayOnSale);
};
const productWithIngredientsInfo = (product, ingredients, price) => {
    return {
        ...product,
        price: price,
        sale: price !== 0,
        ingredients: getIngredientsInfo(product.ingredients, ingredients)
    }
};
const getIngredients = async (ids) => {
    const ingredients = await Ingredients.find(
        {
            _id: { $in: ids }
        }
    ).lean();
    return ingredients;
};
const convertIdString = (idString, converter = mongoose.Types.ObjectId) => converter(idString);

router.get('/', async (req, res) => {
    const authHeader = req.headers['authorization'];
    const isAuth = userAdminAuthorized(authHeader);
    const productsQuery = !isAuth ? { sale: true } : {};
    try {
        const products = await Products.find(productsQuery).lean();
        const ingredients = await getIngredients(ingredientsIdWithinProducts(products));
        const productsExpired = [];
        const productsResult = products.map(product => {
            const price = adjustPrice(product);
            if (price === 0 && product.sale) productsExpired.push(product._id);
            return productWithIngredientsInfo(product, ingredients, price);
        }).filter(product => (isAuth ? true : product.price !== 0));
        await Products.updateMany({
            _id: { $in: productsExpired }
        }, {
            $set: { sale: false }
        });
        res.json(productsResult);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:_id', async (req, res) => {
    const authHeader = req.headers['authorization'];
    const isAuth = userAdminAuthorized(authHeader);
    const productsQuery = !isAuth ? { sale: true } : {};
    if(!mongoose.Types.ObjectId.isValid(req.params._id)) res.status(400).json({ error: 'Bad request.' });
    try {
        const product = await Products.findOne({ _id: req.params._id, ...productsQuery }).lean();
        if (product == null) return res.status(404).json({ error: 'Not found.' });
        const ingredients = await getIngredients(ingredientsId(product.ingredients));
        const price = adjustPrice(product);
        const productResult = productWithIngredientsInfo(product, ingredients, price);
        if (!isAuth && product.price === 0) return res.status(403).json({ error: 'Forbidden.' });
        res.json(productResult);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/', authorization, async (req, res) => {
    const { name, price, ingredients, availability, sale } = req.body;
    const product = new Products({
        name,
        price,
        ingredients,
        availability,
        sale,
        dateOnSale: sale ? new Date() : new Date(0)
    });
    try {
        const newProduct = await product.save();
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.patch('/:_id', authorization, async (req, res) => {
    const { name, price, ingredients: ingredientsParam, availability, sale } = req.body;
    try {
        const product = await Products.findById(req.params._id);
        if (name != null) product.name = name;
        if (price != null) product.price = price;
        if (ingredientsParam != null) product.ingredients = ingredientsParam;
        if(availability != null) product.availability = availability;
        if (sale != null) {
            product.sale = sale;
            product.dateOnSale = sale ? new Date() : new Date(0);
        }
        const updatedProduct = await product.save();
        res.json({ result: 'ok' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.delete('/:_id', authorization, async (req, res) => {
    try {
        const product = await Products.findById(req.params._id);
        await product.remove();
        res.json({ result: 'ok' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Auth middleware
function authorization(req, res, next) {
    const authHeader = req.headers['authorization'];
    const isAuth = userAdminAuthorized(authHeader);
    if (!isAuth) return res.status(401).json(invalidTokenMessage());
    next();
}

const userAdminAuthorized = (authHeader) => {
    const token = authHeader ? authHeader.split(' ')[1] : null;
    if (token == null) return false;
    try {
        const admin = jwt.verify(token, JWT_SECRET_KEY);
        if (!admin) return false;
    } catch (error) {
        return false;
    }
    return true;
};

module.exports = router;