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
      <div class="entry-snippet">${entry.text}</div>
      <small>${entry.date} ${entry.mood ? "- Mood: " + entry.mood : ""}</small>
      <div class="actions">
        <button onclick="event.stopPropagation(); editEntry(${i})">✏️</button>
        <button onclick="event.stopPropagation(); deleteEntry(${i})">🗑️</button>
      </div>
    `;

    div.addEventListener("click", () => {
      document.getElementById("modal-text").textContent = entry.text;
      document.getElementById("modal-mood").textContent = entry.mood;
      document.getElementById("entry-modal").style.display = "block";
    });

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
  localStorage.setItem(
    "theme",
    document.body.classList.contains("dark") ? "dark" : "light"
  );
});

document.querySelector(".close-btn").addEventListener("click", () => {
  document.getElementById("entry-modal").style.display = "none";
});
window.addEventListener("click", (e) => {
  if (e.target.id === "entry-modal") {
    document.getElementById("entry-modal").style.display = "none";
  }
});

renderEntries();
