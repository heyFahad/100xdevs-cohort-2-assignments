// define some global variables for the allowed operators for better code structure
const ADD = '+';
const SUBTRACT = '-';
const DIVIDE = '/';
const MULTIPLY = '*';
const PARENTHESIS_OPEN = '(';
const PARENTHESIS_CLOSE = ')';

// define the operators array and operators' precedence map for comparisons later on
const OPERATORS = [ADD, SUBTRACT, DIVIDE, MULTIPLY, PARENTHESIS_OPEN, PARENTHESIS_CLOSE];
const OPERATOR_PRECEDENCE = {
    [ADD]: 1,
    [SUBTRACT]: 1,
    [DIVIDE]: 2,
    [MULTIPLY]: 2,
};

// export everything from the file
module.exports = {
    ADD,
    SUBTRACT,
    DIVIDE,
    MULTIPLY,
    PARENTHESIS_OPEN,
    PARENTHESIS_CLOSE,
    OPERATORS,
    OPERATOR_PRECEDENCE,
};
