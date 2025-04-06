const taskInput = document.getElementById("task-input");
const addBtn = document.getElementById("add-btn");
const taskList = document.getElementById("task-list");
const moodSelect = document.getElementById("mood-select");
const filterBtns = document.querySelectorAll(".filter-btn");
const progressCircle = document.getElementById("progress-circle");
const progressText = document.getElementById("progress-text");
const themeToggle = document.getElementById("theme-toggle");
const quoteBox = document.getElementById("quote");
const datetime = document.getElementById("datetime");

// Load tasks from localStorage
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
renderTasks();

// Save tasks to localStorage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks(filter = "all") {
  taskList.innerHTML = "";

  const filtered = filter === "all" ? tasks : tasks.filter(t => t.mood === filter);
  
  filtered.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = `task ${task.completed ? "done" : ""}`;
    li.setAttribute("data-id", index);
    li.innerHTML = `
      <span>${task.mood} ${task.text}</span>
      <div class="actions">
        <button onclick="toggleComplete(${index})">✔️</button>
        <button onclick="deleteTask(${index})">🗑</button>
      </div>
    `;
    taskList.appendChild(li);
  });

  updateProgress();
}

function addTask() {
  const text = taskInput.value.trim();
  const mood = moodSelect.value;
  if (!text) return;

  tasks.push({ text, mood, completed: false });
  taskInput.value = "";
  renderTasks();
  saveTasks(); // Save after adding
}

function toggleComplete(index) {
  tasks[index].completed = !tasks[index].completed;
  renderTasks();
  saveTasks(); // Save after toggling
}

function deleteTask(index) {
  tasks.splice(index, 1);
  renderTasks();
  saveTasks(); // Save after deleting
}

function updateProgress() {
  const total = tasks.length;
  const done = tasks.filter(t => t.completed).length;
  const percent = total ? Math.round((done / total) * 100) : 0;
  progressCircle.setAttribute("stroke-dasharray", `${percent}, 100`);
  progressText.textContent = `${percent}%`;
}

addBtn.addEventListener("click", addTask);
taskInput.addEventListener("keypress", e => {
  if (e.key === "Enter") addTask();
});

filterBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    renderTasks(btn.dataset.mood);
  });
});

// Drag & Drop
new Sortable(taskList, {
  animation: 150,
  onEnd: () => {
    const newOrder = Array.from(taskList.children).map(item =>
      parseInt(item.getAttribute("data-id"))
    );
    tasks = newOrder.map(i => tasks[i]);
    renderTasks();
    saveTasks();
    
 // Save after reordering
  }
});

// Time updater
setInterval(() => {
  const now = new Date();
  datetime.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) +
    " | " + now.toLocaleDateString();
}, 1000);

// Theme Toggle
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
}

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
});

// Quote API
async function loadQuote() {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 4000); // 4s timeout
  
      const res = await fetch("https://api.quotable.io/random?tags=inspirational|motivational", {
        signal: controller.signal
      });
      clearTimeout(timeout);
  
      if (!res.ok) throw new Error("Failed to fetch quote");
  
      const data = await res.json();
      quoteBox.textContent = `"${data.content}" — ${data.author}`;
    } catch (err) {
      quoteBox.textContent = `"Believe in yourself and all that you are." — Unknown`;
    }
  }
  
  loadQuote();

 