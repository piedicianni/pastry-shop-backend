const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const Admin = require('../models/adminModel');

router.post('/', async (req, res) => {
    const { email = '', password: passwordDef = '' } = req.body;
    email === '' || passwordDef === '' && res.status(400).json({ error: 'Email or password is not valid.' });
    const password = await bcrypt.hash(passwordDef, 10);
    try {
        const result = await Admin.create({
            email,
            password
        });
        res.status(201).json({ result });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;