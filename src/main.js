import "./style.css";

// Get the necessary DOM elements
const todoListElement = document.getElementById("todo-list");
const inputNewTodo = document.getElementById("new-todo");
const todoNav = document.getElementById("todo-nav");
const markAllCompleted = document.getElementById("mark-all-completed");
const clearCompleted = document.getElementById("clear-completed");
const activeTodosCount = document.getElementById("todo-count");


// Helper function to create a new array with the existing todos and a new todo item
const addTodo = (todos, newTodoText, newTodoId) => [
  ...todos,
  { id: newTodoId, text: newTodoText, completed: false },
];

// Helper function to toggle the completed status of a todo item
const toggleTodo = (todos, todoId) =>
  todos.map((todo) =>
    todo.id === todoId ? { ...todo, completed: !todo.completed } : todo,
  );
 
// Helper function to filter todos based on the current filter setting
const filterTodos = (todos, filter) => {
  switch (filter) {
    case "all":
      return [...todos];
    case "completed":
      return todos.filter((todo) => todo.completed);//when func has only 1 line, ignore {} & return keyword
    case "active":
      return todos.filter((todo) => !todo.completed);
  }
};

// Helper function to mark all todos as completed
const markAllTodosCompleted = (todos) => {
  return todos.map((todo) => {
    return { ...todo, completed: true };
  });
};

// Helper function to delete all completed todos
const deleteCompletedTodos = (todos) => {
  return todos.filter((todo) => !todo.completed);
};
 

// Factory function to create a todo app
const createTodoApp = () => {
  // Define the state of our app
  let todos = [];
  let nextTodoId = 1;
  let filter = "all"; // can be 'all', 'active', or 'completed'

  return {
    addTodo: (newTodoText) => {
      todos = addTodo(todos, newTodoText, nextTodoId++);
    },
    toggleTodo: (todoId) => {
      todos = toggleTodo(todos, todoId);
    },
    setFilter: (newFilter) => {
      filter = newFilter;
    },
    markAllCompleted: () => {
      todos = markAllTodosCompleted(todos);
    },
    deleteCompleted: () => {
      todos = deleteCompletedTodos(todos);
    },
    getNumberOfActiveTodos: () =>
      todos.reduce((acc, todo) => acc + !todo.completed, 0),
    //using the reduce function to calculate the number of active todos
    //reduce function takes an accumulator acc and the current todo item as arguments. For each todo item, it 
    // increments accumulator by 1 (true) if todo is not completed The initial value of the accumulator is set to 0.
    /**
     *reduce func syntax: array.reduce((acc, item) => { FUNC }, initialValue)
     acc — the accumulator (result so far); item — the current item in the array
     initialValue — the starting value for the accumulator

     With each step, reduce:
    Starts with acc equal to initialValue. Processes every item in the array, running your function:
    Updates acc with the returned value each time. Returns the accumulated result after the last array item
     */
    getTodos: () => filterTodos(todos, filter),
  };
};

/**
 * In this factory function, we define the initial state of our app (todos, nextTodoId, and filter) and return 
 * an object with methods to interact with the todo app. The addTodo, toggleTodo, setFilter, and getTodos methods
 * encapsulate the logic for adding a new todo item, toggling the completed status of a todo item, 
 * setting the filter, and getting the filtered todos, respectively.
 * We are using a functional programming techncique called closures to maintain the state of the todo app within 
 * the factory function. The todos, nextTodoId, and filter variables are accessible within the returned object’s
 * methods due to the closure created by the factory function. However, these variables are not directly accessible
 * outside the factory function, ensuring data encapsulation.
 * the helper functions addTodo, toggleTodo, and filterTodos were already defined in earlier steps
 * You should now use the factory function to create a todo app instance and interact with it using the defined methods.
 */

const todoApp = createTodoApp();
/**You can now use the todoApp object to interact with the todo app. For example, to add a new todo item, you can call the addTodo method. */



// Helper function to create todo text element
const createTodoText = (todo) => {
  const todoText = document.createElement("div");
  todoText.id = `todo-text-${todo.id}`;
  todoText.classList.add(
    "todo-text",
    ...(todo.completed ? ["line-through"] : []),//here, we dont use ? "line-through": "" because it might become class = "todo-text", "" which 
    // can cause problem. if we use [""] and spread it, when empty, it adds nothing
  );
  todoText.innerText = todo.text;
  return todoText;
};

// Helper function to create todo edit input element
const createTodoEditInput = (todo) => {
  const todoEdit = document.createElement("input");
  todoEdit.classList.add("hidden", "todo-edit");
  todoEdit.value = todo.text;
  return todoEdit;
};
 
// Helper function to create a todo item
const createTodoItem = (todo) => {
  const todoItem = document.createElement("div");
  todoItem.classList.add("p-4", "todo-item");
  todoItem.append(createTodoText(todo), createTodoEditInput(todo));
  return todoItem;
};

// Function to render the todos based on the current filter
const renderTodos = () => {
  todoListElement.innerHTML = ""; // Clear the current list to avoid duplicates
 
  const todoElements = todoApp.getTodos().map(createTodoItem);
  todoListElement.append(...todoElements);
 
  activeTodosCount.innerText = `${todoApp.getNumberOfActiveTodos()} item${todoApp.getNumberOfActiveTodos() === 1 ? "" : "s"} left`;
};

// Event handler to create a new todo item
const handleKeyDownToCreateNewTodo = (event) => {
  if (event.key === "Enter") {
    const todoText = event.target.value.trim();
    if (todoText) {
      todoApp.addTodo(todoText);
      event.target.value = ""; // Clear the input
      renderTodos();
    }
    /**
     * Note that every time we change the state of the app, we must call renderTodos to update the UI. One of the advantages 
     * of using a UI library like React is that it takes care of these changes automatically (and efficiently), 
     * allowing you to focus on managing the state.
     */
  }
};

  // Loop through the filtered todos and add them to the DOM
  /*todos.forEach((todo) => {
    todoListElement.appendChild(createTodoItem(todo));
  })
  OR:
    const todoElements = filteredTodos.map(createTodoItem);//map creates a new array
    todoListElement.append(...todoElements);
  */

// Helper function to find the target todo element
const findTargetTodoElement = (event) =>
  event.target.id?.includes("todo-text") ? event.target : null;
 
// Helper function to parse the todo id from the todo element
const parseTodoId = (todo) => (todo ? Number(todo.id.split("-").pop()) : -1);
 
// Event handler to toggle the completed status of a todo item
const handleClickOnTodoList = (event) => {
  todoApp.toggleTodo(parseTodoId(findTargetTodoElement(event)));
  renderTodos();
};

// Helper function to update the class list of a navbar element
const updateClassList = (element, isActive) => {
  const classes = [
    "underline",
    "underline-offset-4",
    "decoration-rose-800",
    "decoration-2",
  ];
  if (isActive) {
    element.classList.add(...classes);
  } else {
    element.classList.remove(...classes);
  }
};
 
// Helper function to render the navbar anchor elements
const renderTodoNavBar = (href) => {
  Array.from(todoNav.children).forEach((element) => {
    updateClassList(element, element.href === href);
  });
};
 
// Event handler to filter the todos based on the navbar selection
const handleClickOnNavbar = (event) => {
  // if the clicked element is an anchor tag
  if (event.target.tagName === "A") {
    const hrefValue = event.target.href;
    todoApp.setFilter(hrefValue.split("/").pop() || "all");
    renderTodoNavBar(hrefValue);
    renderTodos();
  }
};

// Event handler to mark all todos as completed
const handleMarkAllCompleted = () => {
  todoApp.markAllCompleted();
  renderTodos();
};
 
// Event handler to clear all completed todos
const clearCompletedTodos = () => {
  todoApp.deleteCompleted();
  renderTodos();
};
 
// Add the event listeners
todoListElement.addEventListener("click", handleClickOnTodoList);
inputNewTodo.addEventListener("keydown", handleKeyDownToCreateNewTodo);//when user types a new todo and presses Enter(keydown), we’ll add it to the list
todoNav.addEventListener("click", handleClickOnNavbar);
markAllCompleted.addEventListener("click", handleMarkAllCompleted);
clearCompleted.addEventListener("click", clearCompletedTodos);
document.addEventListener("DOMContentLoaded", renderTodos);//instead of calling func directly, use event listener after DOM is loaded
