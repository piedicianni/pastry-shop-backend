const express = require('express');
const app = express();
const mongoose = require('mongoose');
const { DB_URL, PORT } = require('./constants/params');
const registerRouter = require('./routes/register');
const loginRouter = require('./routes/login');
const recipesRouter = require('./routes/recipes');

// connect to database
mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
const db = mongoose.connection;
db.on('error', error => console.error(error));
db.once('open', () => ready());

function ready() {
    app.use(express.json());

    app.use('/api/register', registerRouter);
    app.use('/api/login', loginRouter);
    app.use('/api/recipes', recipesRouter);

    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

}