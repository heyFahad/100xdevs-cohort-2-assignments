/*
  Implement a function `isPalindrome` which takes a string as argument and returns true/false as its result.
  Note: the input string is case-insensitive which means 'Nan' is a palindrom as 'N' and 'n' are considered case-insensitive.
*/

/**
 * A utility function to remove all the spaces from the given string
 * @param {string} str The string to clean
 * @returns {string} The cleaned string
 */
function cleanStr(str) {
    return (
        str
            // remove all the spaces from the string
            .replace(/\s/g, '')
            // remove all the punctuation marks from the string
            .replace(/[^\s\w]/g, '')
            .toLowerCase()
    );
}

/**
 * @param {string} str The input string
 * @returns {boolean}
 */
function isPalindrome(str) {
    return cleanStr(str) === cleanStr(str).split('').reverse().join('');
}

module.exports = isPalindrome;
