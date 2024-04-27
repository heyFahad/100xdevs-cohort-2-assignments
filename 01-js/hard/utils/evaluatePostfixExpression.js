const { OPERATORS } = require('../constants/operators');
const { performArithmeticOperation } = require('./performArithmeticOperation');

/**
 * This utility function is actually responsible for evaluating the given Reverse Polish (or Postfix) expression, and return its result.
 * Internally, this function uses another utility function called `performArithmeticOperation` to calculate the result.
 * @param {string} postfix
 * @returns {number}
 */
exports.evaluatePostfixExpression = (postfix) => {
    const stack = [];

    postfix.split(' ').forEach((char) => {
        if (OPERATORS.includes(char)) {
            const rightOperand = stack.pop();
            const leftOperand = stack.pop();
            const arithmeticResult = performArithmeticOperation(char, leftOperand, rightOperand);

            stack.push(arithmeticResult);
        } else {
            stack.push(parseFloat(char));
        }
    });

    return stack.pop();
};
