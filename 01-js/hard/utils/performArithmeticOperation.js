const { ADD, SUBTRACT, DIVIDE, MULTIPLY } = require('../constants/operators');

/**
 * A helper function to perform the arithmetic operation on the given operands and am arithmetic operator
 * @param {string} operator The DMAS operator
 * @param {number} leftOperand number `a`
 * @param {number} rightOperand number `b`
 * @returns {number}
 */
exports.performArithmeticOperation = (operator, leftOperand, rightOperand) => {
    let result = undefined;

    switch (operator) {
        case ADD: {
            result = leftOperand + rightOperand;
            break;
        }

        case SUBTRACT: {
            result = leftOperand - rightOperand;
            break;
        }

        case DIVIDE: {
            if (rightOperand === 0) {
                throw new Error('Division by 0 is not allowed');
            }

            result = leftOperand / rightOperand;
            break;
        }

        case MULTIPLY: {
            result = leftOperand * rightOperand;
            break;
        }

        default:
    }

    return result;
};
