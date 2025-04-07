const habitInput = document.getElementById("habit-input");
const addHabitBtn = document.getElementById("add-habit-btn");
const habitTable = document.getElementById("habit-table");
const themeToggle = document.getElementById("theme-toggle");
const datetime = document.getElementById("datetime");

let habits = JSON.parse(localStorage.getItem("habits")) || [];
const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function renderTable() {
  habitTable.innerHTML = "";

  // Header row
  const header = document.createElement("tr");
  header.innerHTML =
    `<th>Habit</th>` +
    days.map(day => `<th>${day}</th>`).join('') +
    `<th>Actions</th>`;
  habitTable.appendChild(header);

  // Habit rows
  habits.forEach((habit, i) => {
    const row = document.createElement("tr");
    let cells = `<td>
  <div><strong>${habit.name}</strong></div>
  <div class="category-tag">${habit.category}</div>
  <div class="progress-container">
    <div class="progress-bar" style="width: ${(habit.tracking.filter(Boolean).length / 7) * 100}%"></div>
  </div>
  <small>🔥 Streak: ${habit.streak}</small>
</td>`;


    days.forEach((_, dayIndex) => {
      const checked = habit.tracking[dayIndex] ? "checked" : "";
      cells += `<td><input type="checkbox" data-id="${i}" data-day="${dayIndex}" ${checked}></td>`;
    });

    // Action buttons
    cells += `
      <td>
        <button class="edit-btn" data-index="${i}" title="Edit">✏️</button>
        <button class="delete-btn" data-index="${i}" title="Delete">🗑️</button>
      </td>
    `;
    row.innerHTML = cells;
    habitTable.appendChild(row);
  });

  // Delete handlers
  let habitToDeleteIndex = null;

  // Show custom modal on delete
  document.querySelectorAll(".delete-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      habitToDeleteIndex = e.target.dataset.index;
      const modalText = document.getElementById("modal-text");
      modalText.textContent = `Delete habit "${habits[habitToDeleteIndex].name}"?`;
      document.getElementById("confirm-modal").classList.remove("hidden");
    });
  });
  
  // Confirm delete
  document.getElementById("confirm-delete").addEventListener("click", () => {
    if (habitToDeleteIndex !== null) {
      habits.splice(habitToDeleteIndex, 1);
      saveHabits();
      renderTable();
      habitToDeleteIndex = null;
      document.getElementById("confirm-modal").classList.add("hidden");
    }
  });
  
  // Cancel delete
  document.getElementById("cancel-delete").addEventListener("click", () => {
    habitToDeleteIndex = null;
    document.getElementById("confirm-modal").classList.add("hidden");
  });
  

  // Edit handlers
// Edit Modal Logic
let habitToEditIndex = null;
const editModal = document.getElementById("edit-modal");
const editHabitInput = document.getElementById("edit-habit-input");
const saveEditBtn = document.getElementById("save-edit");
const cancelEditBtn = document.getElementById("cancel-edit");

function setupEditButtons() {
  document.querySelectorAll(".edit-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      habitToEditIndex = e.target.dataset.index;
      editHabitInput.value = habits[habitToEditIndex].name;
      editModal.classList.remove("hidden");
    });
  });
}

saveEditBtn.addEventListener("click", () => {
  const newName = editHabitInput.value.trim();
  if (newName && habitToEditIndex !== null) {
    habits[habitToEditIndex].name = newName;
    saveHabits();
    renderTable();
    habitToEditIndex = null;
    editModal.classList.add("hidden");
  }
});

cancelEditBtn.addEventListener("click", () => {
  habitToEditIndex = null;
  editModal.classList.add("hidden");
});
setupEditButtons();

}

function addHabit() {
  const name = habitInput.value.trim();
  if (!name) return;

  const category = prompt("Enter category for this habit (e.g., Health, Learning):") || "General";
  habits.push({ name, tracking: Array(7).fill(false), category, streak: 0 });
  
  habitInput.value = "";
  saveHabits();
  renderTable();
}

function toggleCheckbox(e) {
    if (e.target.tagName === "INPUT") {
      const id = e.target.dataset.id;
      const day = e.target.dataset.day;
      habits[id].tracking[day] = e.target.checked;
  
      // Calculate new streak
      const tracked = habits[id].tracking;
      let streak = 0;
      for (let i = tracked.length - 1; i >= 0; i--) {
        if (tracked[i]) streak++;
        else break;
      }
      habits[id].streak = streak;
  
      saveHabits();
      renderTable();
    }
  }
  

function saveHabits() {
  localStorage.setItem("habits", JSON.stringify(habits));
}

// Theme toggle
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
}
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
});

// Time updater
setInterval(() => {
  const now = new Date();
  datetime.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) +
    " | " + now.toLocaleDateString();
}, 1000);

// Event Listeners
addHabitBtn.addEventListener("click", addHabit);
habitTable.addEventListener("click", toggleCheckbox);

// Initial render
renderTable();


const statsBtn = document.getElementById("view-stats-btn");
const statsModal = document.getElementById("stats-modal");
const closeStats = document.getElementById("close-stats");
const summaryContainer = document.getElementById("weekly-summary");

statsBtn.addEventListener("click", () => {
  summaryContainer.innerHTML = habits.map(h => `
    <div style="margin-bottom: 1rem;">
      <strong>${h.name}</strong> (${h.category})<br>
      ✅ Completed: ${h.tracking.filter(Boolean).length}/7<br>
      🔥 Streak: ${h.streak}
    </div>
  `).join('');
  statsModal.classList.remove("hidden");
});

closeStats.addEventListener("click", () => {
  statsModal.classList.add("hidden");
});
