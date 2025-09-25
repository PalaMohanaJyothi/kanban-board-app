// ✅ Dark / Light Mode Toggle
const toggleBtn = document.getElementById("theme-toggle");
toggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  // Save the theme preference to localStorage
  localStorage.setItem("theme", document.body.classList.contains("dark-mode") ? "dark-mode" : "light-mode");
});

// Load theme preference on page load
document.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem("theme") === "dark-mode") {
    document.body.classList.add("dark-mode");
  }
  loadTasks();
});

// ✅ Drag & Drop Logic
let draggedTask = null;

function dragStart(e) {
  draggedTask = e.target;
  // Use a timeout to hide the dragged element, ensuring a smooth transition
  setTimeout(() => e.target.style.display = "none", 0);
}

function dragEnd(e) {
  e.target.style.display = "block";
  draggedTask = null;
  saveTasks(); // Save tasks after the drag operation
}

document.querySelectorAll(".tasks").forEach(column => {
  column.addEventListener("dragover", e => e.preventDefault());
  column.addEventListener("drop", e => {
    if (!draggedTask) return;
    column.appendChild(draggedTask);
    draggedTask = null;
    saveTasks(); // Save tasks after dropping
  });
});

// Add drag listeners to new tasks
function addDragListeners(task) {
  task.addEventListener("dragstart", dragStart);
  task.addEventListener("dragend", dragEnd);
}

// ✅ Add Task Inline
function addTaskInline(button) {
  const column = button.parentElement;
  const input = column.querySelector(".new-task-input");
  const taskName = input.value.trim();
  if (!taskName) return;

  input.value = "";
  createTask(taskName, column.querySelector(".tasks"));
  saveTasks(); // Save tasks after adding a new one
}

// ✅ Create Task
function createTask(taskName, container, subtasksData = []) {
  const task = document.createElement("div");
  task.className = "task";
  task.draggable = true;
  addDragListeners(task); // Add listeners
  
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
  addSubBtn.onclick = () => {
    addSubtask(subInput, subContainer, task);
    saveTasks(); // Save tasks after adding a subtask
  };

  task.appendChild(subInput);
  task.appendChild(addSubBtn);

  // Progress bar
  const progressBar = document.createElement("div");
  progressBar.className = "progress-bar";
  task.appendChild(progressBar);

  // Add existing subtasks from data
  subtasksData.forEach(subtaskData => {
    const label = document.createElement("label");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = subtaskData.done;
    checkbox.addEventListener("change", () => {
      updateProgress(task);
      saveTasks(); // Save after checking a subtask
    });
    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(" " + subtaskData.name));
    subContainer.appendChild(label);
    subContainer.appendChild(document.createElement("br"));
  });

  container.appendChild(task);
  updateProgress(task);
}

// ✅ Add Subtask
function addSubtask(input, container, task) {
  const subName = input.value.trim();
  if (!subName) return;
  input.value = "";

  const label = document.createElement("label");
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";

  checkbox.addEventListener("change", () => {
    updateProgress(task);
    saveTasks(); // Save after checking a subtask
  });

  label.appendChild(checkbox);
  label.appendChild(document.createTextNode(" " + subName));
  container.appendChild(label);
  container.appendChild(document.createElement("br"));

  updateProgress(task);
}

// ✅ Update Progress Bar
function updateProgress(task) {
  const subtaskCheckboxes = task.querySelectorAll(".subtasks input[type='checkbox']");
  const total = subtaskCheckboxes.length;
  const checked = [...subtaskCheckboxes].filter(cb => cb.checked).length;
  const percent = total ? (checked / total) * 100 : 0;
  task.querySelector(".progress-bar").style.width = percent + "%";
}

// 💾 Save tasks to localStorage
function saveTasks() {
  const board = {};
  document.querySelectorAll(".column").forEach(column => {
    const status = column.dataset.status;
    board[status] = [];
    column.querySelectorAll(".task").forEach(task => {
      const taskData = {
        name: task.querySelector("h3").textContent,
        subtasks: []
      };
      task.querySelectorAll(".subtasks label").forEach(label => {
        const checkbox = label.querySelector("input[type='checkbox']");
        const subName = label.textContent.trim();
        taskData.subtasks.push({
          name: subName,
          done: checkbox.checked
        });
      });
      board[status].push(taskData);
    });
  });
  localStorage.setItem("kanbanBoard", JSON.stringify(board));
}

// 📦 Load tasks from localStorage
function loadTasks() {
  const savedBoard = JSON.parse(localStorage.getItem("kanbanBoard"));
  if (savedBoard) {
    Object.keys(savedBoard).forEach(status => {
      const container = document.getElementById(`${status}-tasks`);
      if (container) {
        savedBoard[status].forEach(taskData => {
          createTask(taskData.name, container, taskData.subtasks);
        });
      }
    });
  }
}