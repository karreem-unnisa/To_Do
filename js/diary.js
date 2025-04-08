const saveBtn = document.getElementById("save-entry");
const diaryText = document.getElementById("diary-text");
const moodSelect = document.getElementById("mood-select");
const entriesList = document.getElementById("entries-list");
const datetime = document.getElementById("datetime");
const themeToggle = document.getElementById("theme-toggle");

let entries = JSON.parse(localStorage.getItem("diaryEntries")) || [];
let editIndex = null;

function renderEntries() {
  entriesList.innerHTML = "";
  entries.forEach((entry, i) => {
    const div = document.createElement("div");
    div.className = "entry";
    div.innerHTML = `
      <div><span class="mood">${entry.mood || ""}</span>${entry.text}</div>
      <small>${entry.date}</small>
      <div class="actions">
        <button onclick="editEntry(${i})">✏️</button>
        <button onclick="deleteEntry(${i})">🗑️</button>
      </div>
    `;
    entriesList.appendChild(div);
  });
}

function saveEntry() {
  const text = diaryText.value.trim();
  const mood = moodSelect.value;

  if (!text) return;

  const now = new Date();
  const formattedDate = now.toLocaleString();

  if (editIndex !== null) {
    entries[editIndex] = { text, mood, date: formattedDate };
    editIndex = null;
  } else {
    entries.unshift({ text, mood, date: formattedDate });
  }

  localStorage.setItem("diaryEntries", JSON.stringify(entries));
  diaryText.value = "";
  moodSelect.value = "";
  renderEntries();
}

function deleteEntry(index) {
  if (confirm("Delete this entry?")) {
    entries.splice(index, 1);
    localStorage.setItem("diaryEntries", JSON.stringify(entries));
    renderEntries();
  }
}

function editEntry(index) {
  const entry = entries[index];
  diaryText.value = entry.text;
  moodSelect.value = entry.mood;
  editIndex = index;
  diaryText.scrollIntoView({ behavior: "smooth" });
}

saveBtn.addEventListener("click", saveEntry);

// Update clock
setInterval(() => {
  const now = new Date();
  datetime.textContent =
    now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) +
    " | " +
    now.toLocaleDateString();
}, 1000);

// Theme toggle
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
}
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  localStorage.setItem(
    "theme",
    document.body.classList.contains("dark") ? "dark" : "light"
  );
});

renderEntries();
