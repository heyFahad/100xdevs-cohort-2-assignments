import { readFile } from 'node:fs';
import { readFile as readFilePromise } from 'node:fs/promises';

/**
 * A helper function to read the contents of a file (using async/await) and print its contents to the console
 * @param {string} filePath
 */
async function readAndPrintFileAsynchronously(filePath) {
    // create an AbortController instance to attach to this read operation
    const controller = new AbortController();
    const { signal } = controller;

    try {
        const fileContents = await readFilePromise(filePath, { signal, encoding: 'utf-8' });
        console.log(fileContents);
    } catch (error) {
        console.error({ error });
    }
}

/**
 * @param {string} filePath
 * @param {function} callback
 * @returns {AbortController} An `AbortController` instance to cancel the ongoing file read operation, if needed
 */
function readFileUsingCallback(filePath, callback) {
    const controller = new AbortController();
    const { signal } = controller;

    readFile(filePath, { signal, encoding: 'utf-8' }, callback);

    return controller;
}

/**
 * @param {NodeJS.ErrnoException} err
 * @param {string} data
 */
function readFileCallback(err, data) {
    if (err) {
        console.error({ err });
        return;
    }

    console.log(data);
}

/**
 * ACTUAL TESTING OF THE ASSIGNMENT
 */
readFileUsingCallback('./3-read-from-file.md', readFileCallback);
readAndPrintFileAsynchronously('./4-write-to-file.md');

// perform an expensive operation to block the main thread and see how it affects the output
let sum = 0;
for (let i = 0; i < 10_000_000_000; i += 1) {
    sum += 1;
}
console.log({ sum });
