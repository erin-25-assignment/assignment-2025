const todoForm = document.getElementById("todo-form");
const todoInput = document.getElementById("todo-input");
const todoListElement = document.getElementById("todo-list");
const themeToggleButton = document.getElementById("theme-toggle");
const checkSound = document.getElementById("check-sound");

let todoItems = [];

function loadTodosFromStorage() {
  const savedTodos = localStorage.getItem("todoItems");
  if (savedTodos) {
    todoItems = JSON.parse(savedTodos);
    todoItems.forEach(renderTodoItem);
  }

  const theme = localStorage.getItem("theme");
  if (theme === "dark") {
    document.body.classList.add("dark-mode");
    themeToggleButton.textContent = "라이트모드";
  }
}

function renderTodoItem(todo) {
  const listItem = document.createElement("li");
  listItem.dataset.id = todo.id;

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = todo.completed;
  checkbox.addEventListener("change", () => {
    toggleTodoCompleted(todo.id);
    checkSound.play();
  });

  const textSpan = document.createElement("span");
  textSpan.className = "todo-text";
  textSpan.textContent = todo.text;
  if (todo.completed) {
    textSpan.classList.add("completed");
  }

  // 현재 테마 확인
  const isDark = document.body.classList.contains("dark-mode");

  // 편집 버튼
  const editBtn = document.createElement("a");
  editBtn.href = "#";
  editBtn.title = "편집";
  editBtn.className = "edit-btn";
  editBtn.innerHTML = `<img src="${isDark ? 
    "https://cdn-icons-png.flaticon.com/512/1159/1159634.png" : 
    "https://cdn-icons-png.flaticon.com/512/1159/1159633.png"}" alt="Edit" width="20" height="20">`;
  editBtn.addEventListener("click", (e) => {
    e.preventDefault();
    editTodoItem(todo.id);
  });

  // 삭제 버튼
  const deleteBtn = document.createElement("a");
  deleteBtn.href = "#";
  deleteBtn.title = "삭제";
  deleteBtn.className = "delete-btn";
  deleteBtn.innerHTML = `<img src="${isDark ? 
    "https://cdn-icons-png.flaticon.com/512/1214/1214428.png" : 
    "https://cdn-icons-png.flaticon.com/512/1214/1214428.png"}" alt="Delete" width="20" height="20">`;
  deleteBtn.addEventListener("click", (e) => {
    e.preventDefault();
    deleteTodoItem(todo.id);
  });

  listItem.appendChild(checkbox);
  listItem.appendChild(textSpan);
  listItem.appendChild(editBtn);
  listItem.appendChild(deleteBtn);

  todoListElement.appendChild(listItem);
}

function addTodoItem(text) {
  const todo = {
    id: Date.now().toString(),
    text: text,
    completed: false
  };
  todoItems.push(todo);
  saveTodosToStorage();
  renderTodoItem(todo);
}

function deleteTodoItem(id) {
  todoItems = todoItems.filter((item) => item.id !== id);
  saveTodosToStorage();
  removeTodoElement(id);
}

function toggleTodoCompleted(id) {
  const todo = todoItems.find((item) => item.id === id);
  if (todo) {
    todo.completed = !todo.completed;
    saveTodosToStorage();
    updateTodoElement(id);
  }
}

function editTodoItem(id) {
  const todo = todoItems.find((item) => item.id === id);
  if (!todo) return;

  const listItem = document.querySelector(`li[data-id="${id}"]`);
  if (!listItem) return;

  const existingInput = listItem.querySelector(".edit-input");
  if (existingInput) return; // 이미 수정 중이면 중복 방지

  const textSpan = listItem.querySelector(".todo-text");
  textSpan.style.display = "none"; // 기존 텍스트 숨기기

  const input = document.createElement("input");
  input.type = "text";
  input.value = todo.text;
  input.className = "edit-input";
  input.style.flex = "1";
  input.style.margin = "0 0.5rem";

  function saveEdit() {
    const newText = input.value.trim();
    if (newText && newText !== todo.text) {
      todo.text = newText;
      saveTodosToStorage();
    }
    updateTodoElement(id);
  }

  input.addEventListener("blur", saveEdit);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      input.blur(); // 포커스를 잃게 해서 blur 이벤트 유도
    }
  });

  listItem.insertBefore(input, textSpan.nextSibling);
  input.focus();
}


function updateTodoElement(id) {
  const todo = todoItems.find((item) => item.id === id);
  if (!todo) return;

  const listItem = document.querySelector(`li[data-id="${id}"]`);
  if (!listItem) return;

  const textSpan = listItem.querySelector(".todo-text");
  const checkbox = listItem.querySelector("input[type='checkbox']");
  const existingInput = listItem.querySelector(".edit-input");

  if (existingInput) {
    listItem.removeChild(existingInput); // input 제거
  }

  textSpan.textContent = todo.text;
  textSpan.style.display = ""; // 다시 보여주기
  checkbox.checked = todo.completed;

  if (todo.completed) {
    textSpan.classList.add("completed");
  } else {
    textSpan.classList.remove("completed");
  }
}


function removeTodoElement(id) {
  const item = document.querySelector(`li[data-id="${id}"]`);
  if (item) {
    todoListElement.removeChild(item);
  }
}

function saveTodosToStorage() {
  localStorage.setItem("todoItems", JSON.stringify(todoItems));
}

todoForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const newTodoText = todoInput.value.trim();
  if (newTodoText !== "") {
    addTodoItem(newTodoText);
    todoInput.value = "";
  }
});

themeToggleButton.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  const isDark = document.body.classList.contains("dark-mode");
  themeToggleButton.textContent = isDark ? "라이트모드" : "다크모드";
  localStorage.setItem("theme", isDark ? "dark" : "light");

  // 다크모드일 때 아이콘 교체
  updateAllIconImages(isDark);
});

function updateAllIconImages(isDark) {
  const editIcons = document.querySelectorAll(".edit-btn img");
  const deleteIcons = document.querySelectorAll(".delete-btn img");

  editIcons.forEach((img) => {
    img.src = isDark
      ? "https://cdn-icons-png.flaticon.com/512/1159/1159634.png"
      : "https://cdn-icons-png.flaticon.com/512/1159/1159633.png";
  });

  deleteIcons.forEach((img) => {
    img.src = isDark
      ? "https://cdn-icons-png.flaticon.com/512/1214/1214428.png"
      : "https://cdn-icons-png.flaticon.com/512/1214/1214428.png";
  });
}

function loadTodosFromStorage() {
  const savedTodos = localStorage.getItem("todoItems");
  if (savedTodos) {
    todoItems = JSON.parse(savedTodos);
    todoItems.forEach(renderTodoItem);
  }

  const theme = localStorage.getItem("theme");
  if (theme === "dark") {
    document.body.classList.add("dark-mode");
    themeToggleButton.textContent = "라이트모드";
    updateAllIconImages(true); // 아이콘 업데이트
  }
}
