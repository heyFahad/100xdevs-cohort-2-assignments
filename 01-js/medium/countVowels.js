/*
  Implement a function `countVowels` that takes a string as an argument and returns the number of vowels in the string.
  Note: Consider both uppercase and lowercase vowels ('a', 'e', 'i', 'o', 'u').

  Once you've implemented the logic, test your code by running
*/

/**
 * The function to count the number of vowels in the given string
 * @param {string} str The input string
 * @returns {number} The number of vowels present in the string
 */
function countVowels(str) {
    // Your code here
    let totalVowelsCount = 0;
    const vowelsMatch = str.match(/[aeiou]/gi);

    if (vowelsMatch !== null) {
        totalVowelsCount = vowelsMatch.length;
    }

    return totalVowelsCount;
}

module.exports = countVowels;
