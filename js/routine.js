const startTime = document.getElementById("start-time");
const endTime = document.getElementById("end-time");
const taskDesc = document.getElementById("task-desc");
const taskType = document.getElementById("task-type");
const addTaskBtn = document.getElementById("add-task");
const routineList = document.getElementById("routine-list");
const datetime = document.getElementById("datetime");
const themeToggle = document.getElementById("theme-toggle");

let routineTasks = JSON.parse(localStorage.getItem("routineTasks")) || [];
let editIndex = -1;

function renderRoutine() {
  routineList.innerHTML = "";
  routineTasks.forEach((task, i) => {
    const div = document.createElement("div");
    div.className = `routine-task ${task.type}`;
    div.innerHTML = `
      <span>⏰ ${task.start} - ${task.end} | ${getEmoji(task.type)} ${task.desc}</span>
      <div class="actions">
        <button onclick="startEditTask(${i})">✏️</button>
        <button onclick="deleteTask(${i})">🗑️</button>
      </div>
    `;
    routineList.appendChild(div);
  });

  renderTimeline();
}

function addOrUpdateTask() {
  const start = startTime.value;
  const end = endTime.value;
  const desc = taskDesc.value.trim();
  const type = taskType.value;

  if (!start || !end || !desc || !type) return;

  const task = { start, end, desc, type };

  if (editIndex !== -1) {
    routineTasks[editIndex] = task;
    editIndex = -1;
    addTaskBtn.textContent = "➕ Add Task";
  } else {
    routineTasks.push(task);
  }

  localStorage.setItem("routineTasks", JSON.stringify(routineTasks));
  clearInputs();
  renderRoutine();
}

function startEditTask(index) {
  const task = routineTasks[index];
  startTime.value = task.start;
  endTime.value = task.end;
  taskDesc.value = task.desc;
  taskType.value = task.type;
  editIndex = index;
  addTaskBtn.textContent = "✅ Update Task";
}

function deleteTask(index) {
  if (confirm("Delete this routine task?")) {
    routineTasks.splice(index, 1);
    localStorage.setItem("routineTasks", JSON.stringify(routineTasks));
    renderRoutine();
  }
}

function clearInputs() {
  startTime.value = "";
  endTime.value = "";
  taskDesc.value = "";
  taskType.value = "study";
}

addTaskBtn.addEventListener("click", addOrUpdateTask);

setInterval(() => {
  const now = new Date();
  datetime.textContent =
    now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) +
    " | " +
    now.toLocaleDateString();
}, 1000);

if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
}

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
});

function getEmoji(type) {
  switch (type) {
    case "study": return "📖";
    case "break": return "☕";
    case "gym": return "🏋️";
    case "other": return "🛠️";
    default: return "";
  }
}

function renderTimeline() {
  const timeline = document.getElementById("timeline-view");
  timeline.innerHTML = "";

  routineTasks.forEach((task) => {
    const startParts = task.start.split(":");
    const endParts = task.end.split(":");
    const startMins = parseInt(startParts[0]) * 60 + parseInt(startParts[1]);
    const endMins = parseInt(endParts[0]) * 60 + parseInt(endParts[1]);
    const duration = endMins - startMins;

    const block = document.createElement("div");
    block.className = "task-block";
    block.style.top = `${(startMins / 1440) * 600}px`;
    block.style.height = `${(duration / 1440) * 600}px`;
    block.style.backgroundColor = getBlockColor(task.type);
    block.textContent = `${task.start} - ${task.end}: ${task.desc}`;

    timeline.appendChild(block);
  });
}

function getBlockColor(type) {
  switch (type) {
    case "study": return "#6c5ce7";
    case "break": return "#00b894";
    case "gym": return "#e17055";
    case "other": return "#0984e3";
    default: return "var(--accent)";
  }
}

renderRoutine();
