// Add a new task
function addTask(status) {
  const taskText = prompt("Enter task name:");
  if (!taskText) return;

  const task = document.createElement("div");
  task.className = "task";
  task.draggable = true;
  task.textContent = taskText;

  // Make tasks draggable
  task.addEventListener("dragstart", dragStart);

  document.getElementById(`${status.replace('-', '')}-tasks`).appendChild(task);
}

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
