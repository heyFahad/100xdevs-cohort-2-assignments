const { PARENTHESIS_OPEN, PARENTHESIS_CLOSE } = require('../constants/operators');

/**
 * A utility function to remove any extra spaces fro the given expression.
 * Furthermore, this function also makes sure that the given expression has correct parenthesis configuration in it.
 * @param {string} expression
 * @returns {string}
 */
exports.parseExpression = (expression) => {
    const parsedExpression = expression
        // add single-space characters around each operator to use this space as a delimiter later
        .replace(/[+\-*/\(\)]/g, ' $& ')
        // remove all the extra white-spaces from the given expression, and replace them with a single space character
        .replace(/\s\s+/g, ' ')
        // trim the white-space from the start and end of the arithmetic expression
        .trim();

    let parenthesisCount = 0;
    parsedExpression.split(' ').forEach((char) => {
        if (char === PARENTHESIS_CLOSE && parenthesisCount === 0) {
            throw new Error('Passed expression has invalid parenthesis configuration');
        }

        if (char === PARENTHESIS_OPEN) {
            parenthesisCount += 1;
        } else if (char === PARENTHESIS_CLOSE) {
            parenthesisCount -= 1;
        }
    });

    if (parenthesisCount !== 0) {
        throw new Error('Passed expression has invalid parenthesis configuration');
    }

    return parsedExpression;
};
