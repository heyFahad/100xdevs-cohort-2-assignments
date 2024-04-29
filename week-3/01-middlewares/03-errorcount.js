const express = require('express');

const SERVER_PORT = 8000;

const app = express();
let errorCount = 0;

// You have been given an express server which has a few endpoints.
// Your task is to
// 1. Ensure that if there is ever an exception, the end user sees a status code of 404
// 2. Maintain the errorCount variable whose value should go up every time there is an exception in any endpoint

app.get('/user', function (req, res) {
    throw new Error('User not found');
    res.status(200).json({ name: 'john' });
});

app.post('/user', function (req, res) {
    res.status(200).json({ msg: 'created dummy user' });
});

app.get('/errorCount', function (req, res) {
    res.status(200).json({ errorCount });
});

// define the global catch middleware after all the routes have been registered in the app
app.use((err, req, res, next) => {
    // if `err` is not null, then we need to send the 404 response and increment the errorCount
    if (err instanceof Error) {
        errorCount += 1;
        return res.status(404).send('Requested resource is not found');
    }

    // else, return the normal response to the user
    next();
});

app.listen(SERVER_PORT, () => {
    console.log(`Server started listening on port ${SERVER_PORT}`);
});

module.exports = app;
