// Dark / Light Mode Toggle
const toggleBtn = document.getElementById("theme-toggle");
toggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
});

// Drag & Drop Logic
let draggedTask = null;

function dragStart(e) {
  draggedTask = e.target;
}

document.querySelectorAll(".tasks").forEach(column => {
  column.addEventListener("dragover", e => e.preventDefault());
  column.addEventListener("drop", e => {
    if (!draggedTask) return;
    column.appendChild(draggedTask);
    draggedTask = null;
  });
});

// Add Task Inline
function addTaskInline(button) {
  const column = button.parentElement;
  const input = column.querySelector(".new-task-input");
  const taskName = input.value.trim();
  if (!taskName) return;

  input.value = "";
  createTask(taskName, column.querySelector(".tasks"));
}

// Create Task
function createTask(taskName, container) {
  const task = document.createElement("div");
  task.className = "task";
  task.draggable = true;
  task.addEventListener("dragstart", dragStart);
  task.subtasks = [];

  // Title
  const title = document.createElement("h3");
  title.textContent = taskName;
  task.appendChild(title);

  // Subtasks container
  const subContainer = document.createElement("div");
  subContainer.className = "subtasks";
  task.appendChild(subContainer);

  // Subtask input & button
  const subInput = document.createElement("input");
  subInput.type = "text";
  subInput.placeholder = "New Subtask";
  subInput.className = "subtask-input";

  const addSubBtn = document.createElement("button");
  addSubBtn.textContent = "Add Subtask";
  addSubBtn.onclick = () => addSubtask(subInput, subContainer, task);

  task.appendChild(subInput);
  task.appendChild(addSubBtn);

  // Progress bar
  const progressBar = document.createElement("div");
  progressBar.className = "progress-bar";
  task.appendChild(progressBar);

  container.appendChild(task);
}

// Add Subtask
function addSubtask(input, container, task) {
  const subName = input.value.trim();
  if (!subName) return;
  input.value = "";

  const label = document.createElement("label");
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";

  task.subtasks.push(checkbox);
  checkbox.addEventListener("change", () => updateProgress(task));

  label.appendChild(checkbox);
  label.appendChild(document.createTextNode(" " + subName));
  container.appendChild(label);
  container.appendChild(document.createElement("br"));

  updateProgress(task);
}

// Update Progress Bar
function updateProgress(task) {
  const subtasks = task.subtasks;
  const checked = subtasks.filter(cb => cb.checked).length;
  const total = subtasks.length;
  const percent = total ? (checked / total) * 100 : 0;
  task.querySelector(".progress-bar").style.width = percent + "%";
}
