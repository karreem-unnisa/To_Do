document.addEventListener("DOMContentLoaded", () => {
    const taskInput = document.getElementById("taskInput");
    const addTaskBtn = document.getElementById("addTask");
    const taskList = document.getElementById("taskList");

    // Load tasks from localStorage
    loadTasks();

    // Add Task
    addTaskBtn.addEventListener("click", () => {
        if (taskInput.value.trim() !== "") {
            const taskText = taskInput.value.trim();
            const task = {
                text: taskText,
                completed: false
            };
            saveTask(task);
            addTaskToDOM(task);
            taskInput.value = "";
        }
    });

    // Add task to DOM
    function addTaskToDOM(task) {
        const li = document.createElement("li");
        li.innerHTML = `
            <input type="checkbox" class="taskCheckbox" ${task.completed ? "checked" : ""}>
            <span ${task.completed ? ' color: gray;"' : ''}>${task.text}</span>
            <button class="delete">❌</button>
        `;
        taskList.appendChild(li);

        // Mark as complete (Green tick)
        const checkbox = li.querySelector(".taskCheckbox");
        checkbox.addEventListener("change", () => {
            task.completed = checkbox.checked;
            updateTaskInStorage();
            if (checkbox.checked) {
                
                li.querySelector("span").style.color = "green";
            } else {
                li.querySelector("span").style.textDecoration = "none";
                li.querySelector("span").style.color = "black";
            }
        });

        // Delete task
        li.querySelector(".delete").addEventListener("click", (e) => {
            e.stopPropagation();
            li.remove();
            removeTaskFromStorage(task);
        });
    }

    // Save task to localStorage
    function saveTask(task) {
        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        tasks.push(task);
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    // Remove task from localStorage
    function removeTaskFromStorage(task) {
        let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        tasks = tasks.filter(t => t.text !== task.text); // Remove the task
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    // Update task in localStorage
    function updateTaskInStorage() {
        const tasks = Array.from(taskList.children).map(li => {
            const checkbox = li.querySelector(".taskCheckbox");
            const taskText = li.querySelector("span").textContent;
            return {
                text: taskText,
                completed: checkbox.checked
            };
        });
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    // Load tasks from localStorage
    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        tasks.forEach(task => {
            addTaskToDOM(task);
        });
    }
});



// Get theme toggle button
const themeToggle = document.getElementById('theme-toggle');

// Check if a theme is stored in localStorage
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    document.body.classList.add(savedTheme);
}

// Function to toggle dark and light themes
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    
    // Save the theme preference in localStorage
    if (document.body.classList.contains('dark-theme')) {
        localStorage.setItem('theme', 'dark-theme');
        themeToggle.textContent = '🌞'; // Switch to light theme
    } else {
        localStorage.setItem('theme', 'light-theme');
        themeToggle.textContent = '🌑'; // Switch to dark theme
    }
});

// Set initial button text based on current theme
if (document.body.classList.contains('dark-theme')) {
    themeToggle.textContent = '🌞'; // Switch to light theme
} else {
    themeToggle.textContent = '🌑'; // Switch to dark theme
}

const quotes = [
    "A well-organized day leads to a productive life! ✨",
    "Little steps of organization create big waves of success! 🌊",
    "Your future self will thank you for today's organization! 💡",
    "Declutter your mind by organizing your tasks! 📝",
    "Great things happen when you plan and take action! 🚀",
    "Time isn’t the main thing. It’s the only thing. ⏳",
    "Lost time is never found again. ⌛",
    "You may delay, but time will not. 🕰️",
    "The key is in not spending time, but in investing it. 💡",
    "Time is what we want most, but what we use worst. ⏰",
    "Don’t watch the clock; do what it does. Keep going. 🚀",
    "A man who dares to waste one hour of time has not discovered the value of life. 🌍",
    "Your future is created by what you do today, not tomorrow. 🎯",
    "Either you run the day, or the day runs you. 🏃‍♂️",
    "Small changes in your daily routine create a massive impact on your time management. 🔄",
    "For every minute spent organizing, an hour is earned. 🗂️",
    "Clutter is nothing more than postponed decisions. 🏠",
    "A clear space leads to a clear mind. ☁️",
    "Plan your work for today and every day, then work your plan. 📅",
    "Success is the sum of small efforts, repeated day in and day out. 🔁",
    "Set a goal so big that you can’t achieve it until you grow into the person who can. 🌱",
    "The best way to predict your future is to create it. ✨",
    "A goal properly set is halfway reached. 🎯",
    "Discipline is the bridge between goals and accomplishment. 🏆",
    "Dream big, start small, but most of all, start. 🚀",
    "A dream becomes a goal when action is taken toward its achievement. ✅",
    "It always seems impossible until it’s done. 🎖️",
    "The only way to do great work is to love what you do. ❤️",
    "Action is the foundational key to all success. 🔑",
    "Opportunities don’t happen. You create them. 💼",
    "Start where you are. Use what you have. Do what you can. 🔥",
    "Do something today that your future self will thank you for. 💪",
    "The secret to success is to start before you’re ready. ⏳",
    "If you want to achieve greatness, stop asking for permission. 🚦",
    "Don’t be busy, be productive. 🛠️",
    "A year from now, you’ll wish you had started today. 🕒",
    "Great things never come from comfort zones. ⚡",
    "Don’t limit your challenges. Challenge your limits. 🌟",
    "Your time is limited, so don’t waste it living someone else’s life. 🎭",
    "You don’t have to be great to start, but you have to start to be great. 🚀",
    "Make today so amazing that yesterday gets jealous. 😃",
    "Productivity is never an accident. It is the result of commitment, planning, and effort. 🛠️",
    "Work smarter, not harder. 💡",
    "Small steps every day lead to big results. 👣",
    "You get what you focus on, so focus on what you want. 🎯",
    "Big goals require big discipline. 🔥",
    "Stay focused, stay consistent, stay motivated. 💪",
    "Turn your ‘I wish’ into ‘I will.’ ✨",
    "You are only as organized as your last decision. 🗂️",
    "Success starts with self-discipline. 🏆",
    "Start now, because later becomes never. ⏳",
    "Done is better than perfect. ✅",
    "Consistency beats motivation. 🔁",
    "A productive day starts the night before. 🌙",
    "The best investment you can make is in yourself. 💰",
    "Motivation gets you started. Habit keeps you going. 🔄"
];


// Select a random quote
const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

// Display the quote in the HTML
document.getElementById("motivational-quote").innerText = randomQuote;

document.addEventListener("DOMContentLoaded", () => {
    const dateTimeDisplay = document.getElementById("currentDateTime");

    function getFormattedDateTime() {
        const now = new Date();
        const options = {
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit'
        };
        return now.toLocaleDateString('en-US', options);
    }

    function updateDateTime() {
        dateTimeDisplay.textContent = getFormattedDateTime();
    }

    setInterval(updateDateTime, 1000);
    updateDateTime(); // Initial call
});
