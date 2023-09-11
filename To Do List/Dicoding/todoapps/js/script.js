const todos = [];
const RENDER_EVENT = "render-todo";
const SAVED_EVENT = "saved-todo";
const STORAGE_KEY = "TODO_APPS";

function isStorageExist() {
  if (typeof Storage === "undefined") {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true; // Ubah menjadi true jika Storage didukung
}

function generateID() {
  return +new Date();
}

function generateTodoObject(id, task, timestamp, isCompleted) {
  return {
    id,
    task,
    timestamp,
    isCompleted,
  };
}

const addTodo = () => {
  const textTodo = document.getElementById("title").value;
  const timestamp = document.getElementById("date").value;

  const generatedID = generateID();
  const todoObject = generateTodoObject(
    generatedID,
    textTodo,
    timestamp,
    false
  );
  todos.push(todoObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
};

function makeTodo(todoObject) {
  const textTitle = document.createElement("h2");
  textTitle.innerText = todoObject.task;

  const textTimestamp = document.createElement("p");
  textTimestamp.innerText = todoObject.timestamp;

  const textContainer = document.createElement("div");
  textContainer.classList.add("inner");
  textContainer.append(textTitle, textTimestamp);

  const container = document.createElement("div");
  container.classList.add("item", "shadow");
  container.append(textContainer);
  container.setAttribute("id", `todo-${todoObject.id}`);

  if (todoObject.isCompleted) {
    const undoButton = document.createElement("button");
    undoButton.classList.add("undo-button");

    undoButton.addEventListener("click", function () {
      undoTaskFromCompleted(todoObject.id);
    });

    const trashButton = document.createElement("button");
    trashButton.classList.add("trash-button");

    trashButton.addEventListener("click", function () {
      removeTaskFromCompleted(todoObject.id);
    });

    container.append(undoButton, trashButton);
  } else {
    const checkButton = document.createElement("button");
    checkButton.classList.add("check-button");

    checkButton.addEventListener("click", function () {
      addTaskCompleted(todoObject.id);
    });

    container.append(checkButton);
  }

  return container;
}

function addTaskCompleted(todoId) {
  const todoTarget = findTodo(todoId);

  if (todoTarget == null) return;

  todoTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function removeTaskFromCompleted(todoId) {
  const todoIndex = todos.findIndex((todoItem) => todoItem.id === todoId);

  if (todoIndex !== -1) {
    todos.splice(todoIndex, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }
}

function undoTaskFromCompleted(todoId) {
  const todoTarget = findTodo(todoId);

  if (todoTarget == null) return;

  todoTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findTodo(todoId) {
  for (const todoItem of todos) {
    if (todoItem.id === todoId) {
      return todoItem;
    }
  }
  return null;
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(todos);
    localStorage.setItem(STORAGE_KEY, parsed); // Ubah "loacalStorage" menjadi "localStorage"
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("form");
  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addTodo();
  });
  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

document.addEventListener(SAVED_EVENT, function () {
  console.log(localStorage.getItem(STORAGE_KEY)); // Ubah "localStrorage.getItems" menjadi "localStorage.getItem"
  if (saveData) {
    alert("Data tersimpan di local Storage");
  } else {
    alert("Gagal Menyimpan Data ke Local Storage");
  }
});

document.addEventListener(RENDER_EVENT, function () {
  const uncompletedTODOList = document.getElementById("todos");
  uncompletedTODOList.innerHTML = "";

  for (const todoitem of todos) {
    const todoElement = makeTodo(todoitem);
    uncompletedTODOList.append(todoElement);
  }
});

function loadDataFromStorage() {
  const seralizedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(seralizedData);

  if (data !== null) {
    for (const todo of data) {
      todo.push(todo);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}
