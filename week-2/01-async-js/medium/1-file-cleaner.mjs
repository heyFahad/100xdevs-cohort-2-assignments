import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

/**
 * @param {string} str The input string from which extra spaces need to be removed
 * @returns {string} The final sanitized string
 */
function removeExtraSpaces(str) {
    return str.replace(/\s\s+/g, ' ');
}

/**
 * @param {string} filePath An absolute path to the file which needs to be cleaned of extra spaces
 * @returns {Promise<boolean>} A boolean flag to indicate the result of cleaning operation
 */
async function cleanseFile(filePath) {
    try {
        // first, load the contents of file in a memory variable
        const content = await readFile(filePath, { encoding: 'utf-8' });

        // then, clean the extra spaces from this file's contents
        const cleanedContent = removeExtraSpaces(content);

        // finally, save the updated/cleaned data back into the same file
        await writeFile(filePath, cleanedContent, { encoding: 'utf-8' });

        return true;
    } catch (error) {
        console.error(error.message);
        return false;
    }
}

/**
 * TEST THE IMPLEMENTATION
 */
(async function () {
    const result = await cleanseFile(resolve('test-file-for-cleaning.txt'));

    if (result === true) {
        console.log('Extra spaces removed from the given file');
    } else {
        console.error('An unknown error occurred');
    }
})();
