const todoForm = document.getElementById("todo-form");
const todoInput = document.getElementById("todo-input");
const todoList = document.getElementById("todo-list");

function addTodo(text, checked = false) {
    const li = document.createElement("li");
    li.textContent = text;
    if (checked) li.classList.add("checked");

    const close = document.createElement("span");
    close.className = "close";
    close.textContent = "×";
    li.appendChild(close);

    todoList.appendChild(li);
}

// Clicking an item toggles it; clicking the × removes it
todoList.addEventListener("click", e => {
    if (e.target.classList.contains("close")) {
        e.target.parentElement.remove();
    } else if (e.target.tagName === "LI") {
        e.target.classList.toggle("checked");
    }
});

todoForm.addEventListener("submit", e => {
    e.preventDefault();
    const text = todoInput.value.trim();
    if (!text) {
        alert("You must write something!");
        return;
    }
    addTodo(text);
    todoInput.value = "";
});

// Sample entries matching the mockup
[
    ["Register for classes", true],
    ["Start Phase 1.1.1", true],
    ["Start Phase 1.1.2", true],
    ["Start Phase 1.2", true],
    ["Complete Phase 1.1.1", true],
    ["Complete Phase 1.1.1", false],
    ["Complete Phase 1.2", false],
].forEach(([text, checked]) => addTodo(text, checked));
