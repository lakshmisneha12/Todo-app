const taskInput = document.getElementById("taskInput");
const dueDateInput = document.getElementById("dueDate");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const filterBtns = document.querySelectorAll(".filters button");
const themeToggle = document.getElementById("themeToggle");
const progressFill = document.getElementById("progressFill");
const progressText = document.getElementById("progressText");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let filter = "all";

/* LOAD */
document.addEventListener("DOMContentLoaded", renderTasks);

/* ADD TASK */
addBtn.onclick = () => {
    if (!taskInput.value.trim()) return;

    tasks.push({
        text: taskInput.value,
        due: dueDateInput.value,
        completed: false   // PENDING
    });

    taskInput.value = "";
    dueDateInput.value = "";
    save();
};

/* RENDER TASKS */
function renderTasks() {
    taskList.innerHTML = "";

    const filteredTasks = tasks.filter(task => {
        if (filter === "completed") return task.completed;
        if (filter === "pending") return !task.completed;
        return true;
    });

    filteredTasks.forEach((task, index) => {
        const li = document.createElement("li");
        if (task.completed) li.classList.add("completed");

        if (!task.completed && task.due && new Date(task.due) < new Date()) {
            li.classList.add("overdue");
        }

        const info = document.createElement("div");
        info.className = "task-info";

        const span = document.createElement("span");
        span.textContent = task.text;
        span.onclick = () => toggleComplete(index);

        const small = document.createElement("small");
        small.textContent = task.due ? `Due: ${task.due}` : "";

        const status = document.createElement("div");
        status.className = "status " + (task.completed ? "completed" : "pending");
        status.textContent = task.completed ? "Completed" : "Pending";

        info.append(span, small, status);

        const actions = document.createElement("div");
        actions.className = "actions";

        const editBtn = document.createElement("button");
        editBtn.textContent = "✏️";
        editBtn.onclick = () => editTask(index);

        const delBtn = document.createElement("button");
        delBtn.textContent = "🗑️";
        delBtn.onclick = () => deleteTask(index);

        actions.append(editBtn, delBtn);
        li.append(info, actions);
        taskList.appendChild(li);
    });

    updateProgress();
}

/* TOGGLE STATUS */
function toggleComplete(index) {
    tasks[index].completed = !tasks[index].completed;
    save();
}

/* DELETE */
function deleteTask(index) {
    tasks.splice(index, 1);
    save();
}

/* EDIT */
function editTask(index) {
    const newText = prompt("Edit task", tasks[index].text);
    if (newText) {
        tasks[index].text = newText;
        save();
    }
}

/* PROGRESS */
function updateProgress() {
    if (tasks.length === 0) {
        progressFill.style.width = "0%";
        progressText.textContent = "0% Completed";
        return;
    }
    const completed = tasks.filter(t => t.completed).length;
    const percent = Math.round((completed / tasks.length) * 100);
    progressFill.style.width = percent + "%";
    progressText.textContent = `${percent}% Completed`;
}

/* SAVE */
function save() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTasks();
}

/* FILTER */
filterBtns.forEach(btn => {
    btn.onclick = () => {
        filterBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        filter = btn.dataset.filter;
        renderTasks();
    };
});

/* THEME */
themeToggle.onclick = () => {
    document.body.classList.toggle("light");
    document.body.classList.toggle("dark");
};
