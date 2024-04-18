/*
  Implement a class `Todo` having below methods
    - add(todo): adds todo to list of todos
    - remove(indexOfTodo): remove todo from list of todos
    - update(index, updatedTodo): update todo at given index
    - getAll: returns all todos
    - get(indexOfTodo): returns todo at given index
    - clear: deletes all todos

  Once you've implemented the logic, test your code by running
*/

class Todo {
    constructor() {
        this.todos = [];
    }

    add(todo) {
        this.todos.push(todo);
    }

    /**
     * Remove a specific todo by passing its index
     * @param {number} indexOfTodo
     */
    remove(indexOfTodo) {
        this.todos.splice(indexOfTodo, 1);
    }

    /**
     * Update the todo at the given index
     * @param {number} index
     * @param {*} updatedTodo
     */
    update(index, updatedTodo) {
        if (index >= 0 && index < this.todos.length) {
            this.todos[index] = updatedTodo;
        }
    }

    getAll() {
        return this.todos;
    }

    /**
     * @param {number} indexOfTodo
     */
    get(indexOfTodo) {
        return this.todos[indexOfTodo] ?? null;
    }

    clear() {
        this.todos = [];
    }
}

module.exports = Todo;
