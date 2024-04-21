import { writeFile } from 'node:fs';
import { writeFile as writeFilePromise } from 'node:fs/promises';

/**
 * A helper function to write data to a file using async/await
 * @param {string} filePath
 * @param {string} filePath
 * @param {*} data
 */
async function writeContentsToFile(filePath, data) {
    const controller = new AbortController();
    const { signal } = controller;

    try {
        await writeFilePromise(filePath, JSON.stringify(data), { signal, encoding: 'utf-8' });
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
        console.error({ err });
        return;
    }

    console.log('Data written to file using callback');
}

writeFileUsingCallback('./4-write-file-using-callback.txt', 'Hello, 100xDevs community', writeFileCallback);
writeContentsToFile('./4-write-file-using-promise.txt', 'Hello, 100xDevs community!');
console.log('functions called');
