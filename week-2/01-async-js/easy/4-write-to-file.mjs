import { writeFile } from 'node:fs';
import { resolve } from 'node:path';
import { writeFile as writeFilePromise } from 'node:fs/promises';

/**
 * A helper function to write data to a file using async/await
 * @param {string} filePath
 * @param {*} data
 */
async function writeContentsToFile(filePath, data) {
    try {
        await writeFilePromise(filePath, JSON.stringify(data), { encoding: 'utf-8' });
        console.log('Data written to file using async/await');
    } catch (error) {
        console.error({ error });
    }
}

/**
 * @param {string} filePath
 * @param {*} data
 * @param {function} callback
 * @returns {AbortController} An `AbortController` instance to cancel the ongoing file write operation, if needed
 */
function writeFileUsingCallback(filePath, data, callback) {
    const controller = new AbortController();
    const { signal } = controller;

    writeFile(filePath, JSON.stringify(data), { signal, encoding: 'utf-8' }, callback);

    return controller;
}

function writeFileCallback(err) {
    if (err) {
        if (err.name === 'AbortError') {
            console.log(`Writing to the "4-write-file-using-callback.txt" file was cancelled by user`);
        } else {
            console.error({ err });
        }
        return;
    }

    console.log('Data written to file using callback');
}

const abortController = writeFileUsingCallback(resolve('./4-write-file-using-callback.txt'), 'Hello, 100xDevs community', writeFileCallback);
writeContentsToFile(resolve('./4-write-file-using-promise.txt'), 'Hello, 100xDevs community!');

console.log('functions called');

// perform an expensive operation to block the main thread and see how it affects the output
let sum = 0;
for (let i = 0; i < 10_000_000_000; i += 1) {
    sum += 1;
}
console.log({ sum });

// Let's spice things up by canceling the first file write operation to show how can we stop calling the callback function passed to the writeFile function
abortController.abort(); // after this line, first writeFile operation will not be completed
