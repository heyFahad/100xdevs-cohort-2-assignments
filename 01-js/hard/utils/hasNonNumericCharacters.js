/**
 * A utility function to check if the given expression has no alphabetic character in it
 * @param {string} expression
 * @returns {boolean}
 */
exports.hasNonNumericCharacters = (expression) => {
    return expression.match(/[^\s\d\.+\-*/\(\)]+/g);
};
