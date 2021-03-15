const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const { DB_URL, PORT, CORS_ORIGIN } = require('./constants/params');
const registerRouter = require('./routes/register');
const loginRouter = require('./routes/login');
const productsRouter = require('./routes/products');
const ingredientsRouter = require('./routes/ingredients');

// connect to database
mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
const db = mongoose.connection;
db.on('error', error => console.error(error));
db.once('open', () => ready());

function ready() {
    app.use(express.json());
    app.use(cors({
        origin: CORS_ORIGIN
    }));

    app.use('/api/register', registerRouter);
    app.use('/api/login', loginRouter);
    app.use('/api/products', productsRouter);
    app.use('/api/ingredients', ingredientsRouter);

    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

}