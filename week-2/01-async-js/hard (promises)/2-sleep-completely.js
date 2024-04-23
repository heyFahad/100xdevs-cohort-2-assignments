/*
 * Write a function that halts the JS thread (make it busy wait) for a given number of milliseconds.
 * During this time the thread should not be able to do anything else.
 * the function should return a promise just like before
 */

function sleep(milliseconds) {
    const startTime = Date.now();

    // execute a while loop for as long as the number of milliseconds do not get passed
    while (Date.now() - startTime < milliseconds) {}

    return Promise.resolve();
}

module.exports = sleep;
