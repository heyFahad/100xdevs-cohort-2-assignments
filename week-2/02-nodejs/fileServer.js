/**
  You need to create an express HTTP server in Node.js which will handle the logic of a file server.
  - Use built in Node.js `fs` module
  The expected API endpoints are defined below,
  1. GET /files - Returns a list of files present in `./files/` directory
    Response: 200 OK with an array of file names in JSON format.
    Example: GET http://localhost:3000/files
  2. GET /file/:filename - Returns content of given file by name
     Description: Use the filename from the request path parameter to read the file from `./files/` directory
     Response: 200 OK with the file content as the response body if found, or 404 Not Found if not found. Should return `File not found` as text if file is not found
     Example: GET http://localhost:3000/file/example.txt
    - For any other route not defined in the server return 404
    Testing the server - run `npm run test-fileServer` command in terminal
 */
const express = require('express');
const { readdir, readFile } = require('node:fs/promises');
const { join, resolve } = require('node:path');
const app = express();

const SERVER_PORT = 8000;
const FILES_DIRECTORY_PATH = resolve('files');

// Create a dedicated router object to define the application routes so that these routes can later be moved to a separate file for a lean code structure
const router = express.Router();

// GET /files - Returns a list of files present in `./files/` directory
router.get('/files', async (_, res) => {
    try {
        const files = await readdir(FILES_DIRECTORY_PATH);
        return res.status(200).json(files);
    } catch {
        // some internal server error occurred
        return res.status(500).send('Something went wrong. Please try again later.');
    }
});

// GET /file/:filename - Returns content of given file by name
router.get('/file/:filename', async (req, res) => {
    const { filename } = req.params;

    // construct the file path based on given filename and the underlying server's OS
    const filePath = join(FILES_DIRECTORY_PATH, filename);

    // read the file contents as a string
    try {
        const fileContents = await readFile(filePath, { encoding: 'utf-8' });
        res.status(200).send(fileContents);
    } catch {
        // if an error is thrown, it means that the requested file does not exist on the server. Hence, return a "404 Not Found" response
        res.status(404).send('File not found');
    }
});

// any other route not defined above
router.all('*', (_, res) => {
    res.status(404).send('Route not found');
});

// Mount the router with app
app.use('/', router);

// Start the HTTP server
app.listen(SERVER_PORT, () => {
    console.log(`Server started listening on port ${SERVER_PORT}`);
});

module.exports = app;
