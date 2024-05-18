// load the environment variables in process.env as soon as the program starts
require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const adminRouter = require('./routes/admin');
const userRouter = require('./routes/user');

// Middleware for parsing request bodies
app.use(bodyParser.json());
app.use('/admin', adminRouter);
app.use('/user', userRouter);

// Register a global catches middleware to handle all the errors originating from the server
app.use((error, req, res, next) => {
    res.status(error.status ?? 500).json({
        message: error.message ?? 'Internal Server Error',
    });

    // Pass the error object to the next error handling middleware in the chain (maybe some error logging service)
    next(error);
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
