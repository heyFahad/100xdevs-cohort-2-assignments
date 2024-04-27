/*
  Implement a class `Calculator` having below methods
    - initialise a result variable in the constructor and keep updating it after every arithmetic operation
    - add: takes a number and adds it to the result
    - subtract: takes a number and subtracts it from the result
    - multiply: takes a number and multiply it to the result
    - divide: takes a number and divide it to the result
    - clear: makes the `result` variable to 0
    - getResult: returns the value of `result` variable
    - calculate: takes a string expression which can take multi-arithmetic operations and give its result
      example input: `10 +   2 *    (   6 - (4 + 1) / 2) + 7`
      Points to Note: 
        1. the input can have multiple continuous spaces, you're supposed to avoid them and parse the expression correctly
        2. the input can have invalid non-numerical characters like `5 + abc`, you're supposed to throw error for such inputs

  Once you've implemented the logic, test your code by running
*/
const { hasNonNumericCharacters, parseExpression, convertExpressionToPostfix, evaluatePostfixExpression } = require('./utils');

class Calculator {
    constructor() {
        this.result = 0;
    }

    /**
     * Add the given number into the current `result`
     * @param {number} num
     */
    add(num) {
        this.result += num;
    }

    /**
     * Subtract the given number from the current `result`
     * @param {number} num
     */
    subtract(num) {
        this.result -= num;
    }

    /**
     * Multiply the given number with the current `result`
     * @param {number} num
     */
    multiply(num) {
        this.result *= num;
    }

    /**
     * Divide the current `result` with the given number
     * @param {number} num
     */
    divide(num) {
        if (num === 0) {
            throw new Error('Division by 0 is not allowed');
        }

        this.result /= num;
    }

    /**
     * Set the current `result` equal to `0`
     */
    clear() {
        this.result = 0;
    }

    /**
     * Get the current value of the `result`
     * @returns {number}
     */
    getResult() {
        return this.result;
    }

    /**
     * Calculate the result of the given Arithmetic expression
     * @param {string} expression
     */
    calculate(expression) {
        if (hasNonNumericCharacters(expression)) {
            throw new Error('Passed expression is not valid. It contains non-numeric characters.');
        }

        const parsedExpression = parseExpression(expression);
        const postfixExpression = convertExpressionToPostfix(parsedExpression);
        this.result = evaluatePostfixExpression(postfixExpression);
    }
}

module.exports = Calculator;
