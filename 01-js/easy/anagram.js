/*
  Write a function `isAnagram` which takes 2 parameters and returns true/false if those are anagrams or not.
  What's Anagram?
  - A word, phrase, or name formed by rearranging the letters of another, such as spar, formed from rasp.
*/

/**
 * A utility function to remove all the spaces from the given string
 * @param {strin} str The string to clean
 * @returns {string} The cleaned string
 */
function cleanStr(str) {
    return str.replace(/\s/g, '').toLowerCase();
}

/**
 * A utility function to sort a string in alphabettical order
 * @param {string} str The string to sort
 * @returns The sorted string
 */
function sortStr(str) {
    return str.split('').sort().join('');
}

/**
 * @param {string} str1 String 1
 * @param {string} str2 String 2
 */
function isAnagram(str1, str2) {
    if (str1.length !== str2.length) {
        return false;
    }

    const str1Sorted = sortStr(cleanStr(str1));
    const str2Sorted = sortStr(cleanStr(str2));

    return str1Sorted === str2Sorted;
}

module.exports = isAnagram;
