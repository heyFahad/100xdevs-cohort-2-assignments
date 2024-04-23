/*
 * Write 3 different functions that return promises that resolve after t1, t2, and t3 seconds respectively.
 * Write a function that sequentially calls all 3 of these functions in order.
 * Return a promise chain which return the time in milliseconds it takes to complete the entire operation.
 * Compare it with the results from 3-promise-all.js
 */

/**
 * A small utility function to help reuse code in the following 3 wait functions
 * @param {number} t number of milliseconds to wait before resolving the promise
 * @returns {Promise<void>}
 */
function wait(t) {
    return new Promise((resolve) => {
        setTimeout(resolve, t);
    });
}

/**
 * @param {number} t number of seconds to wait
 * @returns {Promise<void>}
 */
function wait1(t) {
    return wait(t * 1000);
}

/**
 * @param {number} t number of seconds to wait
 * @returns {Promise<void>}
 */
function wait2(t) {
    return wait(t * 1000);
}

/**
 * @param {number} t number of seconds to wait
 * @returns {Promise<void>}
 */
function wait3(t) {
    return wait(t * 1000);
}

/**
 * @param {number} t1 number of seconds to wait
 * @param {number} t2 number of seconds to wait
 * @param {number} t3 number of seconds to wait
 * @returns {Promise<number>} total number of milliseconds that the program took to finish
 */
async function calculateTime(t1, t2, t3) {
    // note the current timestamp before starting the wait functions
    const startTime = Date.now();

    // sequentially wait for all the three promises before returning the result
    await wait1(t1);
    await wait2(t2);
    await wait3(t3);

    // return the total number of milliseconds passed since the start of this function execution
    return Date.now() - startTime;
}

module.exports = calculateTime;
