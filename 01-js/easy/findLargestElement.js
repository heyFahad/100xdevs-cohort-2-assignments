/*
  Write a function `findLargestElement` that takes an array of numbers and returns the largest element.
  Example:
  - Input: [3, 7, 2, 9, 1]
  - Output: 9
*/

/**
 * @param {number[]} numbers The input numbers array
 * @returns {number} The largest number from the given array
 */
function findLargestElement(numbers) {
    // let's assume that the first element is the largest element in the given array
    let largestNumber = numbers[0];

    // since we have already assigned the first element of input array to the largestNumber variable, that's why I'm starting my loop from the index 1 here to avoid the first unnecessary comparison check
    for (let index = 1; index < numbers.length; index += 1) {
        if (numbers[index] > largestNumber) {
            largestNumber = numbers[index];
        }
    }

    return largestNumber;
}

module.exports = findLargestElement;
