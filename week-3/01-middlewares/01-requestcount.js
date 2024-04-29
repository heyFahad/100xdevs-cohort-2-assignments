const express = require('express');

const SERVER_PORT = 8000;

const app = express();
let requestCount = 0;

// You have been given an express server which has a few endpoints.
// Your task is to create a global middleware (app.use) which will
// maintain a count of the number of requests made to the server in the global
// requestCount variable

// define and use the global middleware to count the incoming requests
app.use((req, res, next) => {
    requestCount += 1;
    next();
});

app.get('/user', function (req, res) {
    res.status(200).json({ name: 'john' });
});

app.post('/user', function (req, res) {
    res.status(200).json({ msg: 'created dummy user' });
});

app.get('/requestCount', function (req, res) {
    res.status(200).json({ requestCount });
});

// start the server to listen to the incoming requests
app.listen(SERVER_PORT, () => {
    console.log(`Server started listening on port ${SERVER_PORT}`);
});

module.exports = app;
