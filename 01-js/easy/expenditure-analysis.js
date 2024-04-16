/*
  Implement a function `calculateTotalSpentByCategory` which takes a list of transactions as parameter
  and return a list of objects where each object is unique category-wise and has total price spent as its value.
  transactions is an array where each
  Transaction - an object like
    {
        id: 1,
        timestamp: 1656076800000,
        price: 10,
        category: 'Food',
        itemName: 'Pizza',
    }
  Output - [{ category: 'Food', totalSpent: 10 }] // Can have multiple categories, only one example is mentioned here
*/

/**
 * @param {{ id: number, timestamp: number, price: number, category: string, itemName: string }[]} transactions The transactions array input
 * @returns {{ category: string, totalSpent: number }[]} The resultant category-wise expenditure
 */
function calculateTotalSpentByCategory(transactions) {
    const categoryWiseTotalExpense = {};

    transactions.forEach(({ category, price }) => {
        categoryWiseTotalExpense[category] = categoryWiseTotalExpense[category] ? categoryWiseTotalExpense[category] + price : price;
    });

    return Object.entries(categoryWiseTotalExpense).map(([category, totalSpent]) => {
        return {
            category,
            totalSpent,
        };
    });
}

module.exports = calculateTotalSpentByCategory;
