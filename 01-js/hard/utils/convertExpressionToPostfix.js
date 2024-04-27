const { PARENTHESIS_OPEN, PARENTHESIS_CLOSE, OPERATORS, OPERATOR_PRECEDENCE } = require('../constants/operators');

/**
 * This utility function will take a parsed expression (which has no extra space characters, and which doesn't have any invalid parenthesis), and convert it into its Reverse Polish (POSTFIX) notation
 * @param {string} expression
 * @returns {string}
 */
exports.convertExpressionToPostfix = (expression) => {
    const output = [];
    const operators = [];

    expression.split(' ').forEach((char) => {
        if (OPERATORS.includes(char)) {
            if (char === PARENTHESIS_CLOSE) {
                while (operators[operators.length - 1] !== PARENTHESIS_OPEN) {
                    output.push(operators.pop());
                }

                operators.pop(); // remove the '(' operator as well from the operators stack
                return;
            }

            if (OPERATOR_PRECEDENCE[char] <= OPERATOR_PRECEDENCE[operators[operators.length - 1]]) {
                while (operators.length > 0) {
                    output.push(operators.pop());
                }
            }

            operators.push(char);
        } else {
            output.push(char);
        }
    });

    while (operators.length > 0) {
        output.push(operators.pop());
    }

    return output.join(' ');
};
