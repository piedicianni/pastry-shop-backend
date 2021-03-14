const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_SECRET_KEY } = require('../constants/params');
const Admin = require('../models/adminModel');

const invalidLoginMessage = () => ({ error: 'Invalid email or password.' });

router.post('/', async (req, res) => {
    const { email, password } = req.body;
    try {
        const admin = await Admin.findOne({ email }).lean();
        if (await bcrypt.compare(password, admin.password)) {
            const token = jwt.sign({
                id: admin._id,
                email: admin.email
            }, JWT_SECRET_KEY);
            res.json({ authorizationToken: token });
        } else {
            res.status(401).json(invalidLoginMessage());
        }
    } catch (error) {
        res.status(401).json(invalidLoginMessage());
    }
});

module.exports = router;