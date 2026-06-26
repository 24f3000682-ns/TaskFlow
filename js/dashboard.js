// ===============================
// Authentication
// ===============================

if (localStorage.getItem("loggedIn") !== "true") {
    window.location.href = "login.html";
}

// ===============================
// Elements
// ===============================

const logoutBtn = document.getElementById("logoutBtn");
const addTaskBtn = document.getElementById("addTaskBtn");
const searchTask = document.getElementById("searchTask");
const taskModal = document.getElementById("taskModal");
const closeModal = document.getElementById("closeModal");
const saveTask = document.getElementById("saveTask");
const toast = document.getElementById("toast");
const chartCanvas = document.getElementById("taskChart");

let taskChart;
const filterButtons = document.querySelectorAll(".filter-btn");

let currentFilter = "all";
const taskTitle = document.getElementById("taskTitle");
const taskDescription = document.getElementById("taskDescription");
const taskPriority = document.getElementById("taskPriority");
const taskCategory = document.getElementById("taskCategory");
const taskDate = document.getElementById("taskDate");
const sortTasks = document.getElementById("sortTasks");



const editingTaskId = document.getElementById("editingTaskId");
const taskList = document.getElementById("taskList");

const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const pendingTasks = document.getElementById("pendingTasks");
function showToast(message, color = "#16a34a") {

    toast.textContent = message;

    toast.style.background = color;

    toast.classList.add("show");

    setTimeout(() => {

        toast.classList.remove("show");

    }, 2500);

}
// ===============================
// Local Storage
// ===============================

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// ===============================
// Logout
// ===============================

logoutBtn.addEventListener("click", () => {

    localStorage.removeItem("loggedIn");

    window.location.href = "login.html";

});

// ===============================
// Modal
// ===============================

addTaskBtn.addEventListener("click", () => {

    taskModal.style.display = "flex";

});

closeModal.addEventListener("click", () => {

    taskModal.style.display = "none";

});

window.addEventListener("click", (e) => {

    if (e.target === taskModal) {

        taskModal.style.display = "none";

    }

});

// ===============================
// Save Task
// ===============================

saveTask.addEventListener("click", () => {

    if(taskTitle.value.trim() === ""){

        showToast("Please enter a task title!", "#ef4444");

        return;

    }

    const editingId = editingTaskId.value;

    if(editingId){

        tasks = tasks.map(task => {

            if(task.id == editingId){

                task.title = taskTitle.value;
                task.description = taskDescription.value;
                task.priority = taskPriority.value;
                task.priority = taskPriority.value;
                task.dueDate = taskDate.value;

            }

            return task;

        });

        editingTaskId.value = "";

    }else{

        const task = {
       id: Date.now(),

        title: taskTitle.value,

        description: taskDescription.value,

        priority: taskPriority.value,

        category: taskCategory.value,

        dueDate: taskDate.value,

        completed:false


        };

        tasks.push(task);

    }

    localStorage.setItem("tasks", JSON.stringify(tasks));
if(editingId){

    showToast("Task updated successfully!");

}else{

    showToast("Task added successfully!");

}
    taskTitle.value = "";
    taskDescription.value = "";
    taskDate.value = "";

    taskModal.style.display = "none";

    renderTasks();

});

   

// ===============================
// Edit Task
// ===============================
function editTask(id){

    const task = tasks.find(task => task.id === id);

    if(!task){
        return;
    }

    taskTitle.value = task.title;
    taskDescription.value = task.description;
    taskPriority.value = task.priority;
    taskCategory.value = task.category || "Study";
    taskDate.value = task.dueDate;

    editingTaskId.value = task.id;

    taskModal.style.display = "flex";

}
function deleteTask(id){

    if(!confirm("Delete this task?")){

        return;

    }

    tasks = tasks.filter(task => task.id !== id);

    localStorage.setItem("tasks",JSON.stringify(tasks));
    showToast("Task deleted successfully!", "#dc2626");
    renderTasks();

}
// ===============================
// Complete Task
// ===============================

function completeTask(id){

    tasks = tasks.map(task => {

        if(task.id === id){

            task.completed = !task.completed;

        }

        return task;

    });

    localStorage.setItem("tasks", JSON.stringify(tasks));

    renderTasks();

}
function getCategoryIcon(category){

    switch(category){

        case "Study":
            return "📚";

        case "Work":
            return "💼";

        case "Personal":
            return "🏠";

        case "Shopping":
            return "🛒";

        default:
            return "📌";

    }

}
function getDueStatus(date){

    if(!date) return "No Due Date";

    const today = new Date();

    const due = new Date(date);

    today.setHours(0,0,0,0);
    due.setHours(0,0,0,0);

    if(due.getTime() === today.getTime()){

        return "🟢 Due Today";

    }

    if(due < today){

        return "🔴 Overdue";

    }

    return "📅 " + date;

}
// ===============================
// Render Tasks
// ===============================

function renderTasks(){

    taskList.innerHTML = "";
    let visibleTasks = 0;
    const keyword = searchTask.value.toLowerCase();
    let completed = 0;
let sortedTasks = [...tasks];

if(sortTasks.value === "newest"){

    sortedTasks.sort((a,b)=>b.id-a.id);

}
else if(sortTasks.value === "oldest"){

    sortedTasks.sort((a,b)=>a.id-b.id);

}
else if(sortTasks.value === "priority"){

    const order = {
        High:3,
        Medium:2,
        Low:1
    };

    sortedTasks.sort((a,b)=>order[b.priority]-order[a.priority]);

}
else if(sortTasks.value === "duedate"){

    sortedTasks.sort((a,b)=>new Date(a.dueDate)-new Date(b.dueDate));

}
   sortedTasks
.filter(task => {

    const matchesSearch =
        task.title.toLowerCase().includes(keyword) ||
        task.description.toLowerCase().includes(keyword);

    if(currentFilter === "completed"){

        return matchesSearch && task.completed;

    }

    if(currentFilter === "pending"){

        return matchesSearch && !task.completed;

    }

    return matchesSearch;

})
.forEach(task => {

      
    visibleTasks++;

    if(task.completed) completed++;

    taskList.innerHTML += `

        <div class="task-card ${task.completed ? "completed" : ""}">
           <div class="task-header">

    <div>

        <h3>${task.title}</h3>

        <p class="category">

            ${getCategoryIcon(task.category)}
            ${task.category}

        </p>

    </div>

    <span class="priority ${task.priority.toLowerCase()}">
        ${task.priority}
    </span>

</div>

<p>${task.description || ""}</p>

            <div class="task-footer">

                <span class="due-date">
                ${getDueStatus(task.dueDate)}
                   </span>

                <div class="task-actions">

                     <button
                       class="edit-btn"
                         onclick="editTask(${task.id})">
 
                           ✏️

                       </button>

                         <button
                     class="complete-btn"
                      onclick="completeTask(${task.id})">

                            ✓

                                </button>

                             <button
                                class="delete-btn"
                                 onclick="deleteTask(${task.id})">
 
                                        🗑

                          </button>

                </div>

            </div>

        </div>

        `;

    });
if (visibleTasks === 0) {

    taskList.innerHTML = `
        <div class="empty-state">

            <div class="empty-icon">📋</div>

            <h2>No Tasks Yet</h2>

            <p>Click <strong>+ Add Task</strong> to create your first task.</p>

        </div>
    `;

}
    totalTasks.textContent = tasks.length;
    completedTasks.textContent = completed;
    pendingTasks.textContent = tasks.length - completed;
// Progress Bar
const progress = tasks.length === 0
    ? 0
    : Math.round((completed / tasks.length) * 100);

document.getElementById("progressBar").style.width = progress + "%";
document.getElementById("progressText").textContent = progress + "%";

updateChart();
}
// ===============================
// Start App
// ===============================

renderTasks();
searchTask.addEventListener("input", () => {

    renderTasks();

});
filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        filterButtons.forEach(btn =>
            btn.classList.remove("active")
        );

        button.classList.add("active");

        currentFilter = button.dataset.filter;

        renderTasks();
     
    });

});
// ==========================
// Dark Mode
// ==========================

const themeBtn = document.getElementById("themeBtn");

if(localStorage.getItem("theme") === "dark"){

    document.body.classList.add("dark");
    themeBtn.textContent = "☀️";

}

themeBtn.addEventListener("click",()=>{

    document.body.classList.toggle("dark");

    if(document.body.classList.contains("dark")){

        localStorage.setItem("theme","dark");
        themeBtn.textContent="☀️";

    }else{

        localStorage.setItem("theme","light");
        themeBtn.textContent="🌙";

    }

});
// ==========================
// Sidebar Navigation
// ==========================

const dashboardNav = document.getElementById("dashboardNav");
const myTasksNav = document.getElementById("myTasksNav");
const completedNav = document.getElementById("completedNav");
const taskSection = document.getElementById("taskSection");

// Dashboard
dashboardNav.addEventListener("click", () => {

    currentFilter = "all";

    filterButtons.forEach(btn => btn.classList.remove("active"));
    document.querySelector('[data-filter="all"]').classList.add("active");

    renderTasks();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

});

// My Tasks
myTasksNav.addEventListener("click", () => {

    currentFilter = "all";

    filterButtons.forEach(btn => btn.classList.remove("active"));
    document.querySelector('[data-filter="all"]').classList.add("active");

    renderTasks();
taskSection.scrollIntoView({
    behavior: "smooth"
});
});

// Completed
completedNav.addEventListener("click", () => {

    currentFilter = "completed";

    filterButtons.forEach(btn => btn.classList.remove("active"));
    document.querySelector('[data-filter="completed"]').classList.add("active");

    renderTasks();
taskSection.scrollIntoView({
    behavior: "smooth"
});
});
function updateChart(){

    const completed = tasks.filter(task => task.completed).length;

    const pending = tasks.length - completed;

    if(taskChart){

        taskChart.destroy();

    }

    taskChart = new Chart(chartCanvas,{

        type:"doughnut",

        data:{

            labels:["Completed","Pending"],

            datasets:[{

                data:[completed,pending],

                backgroundColor:[
                    "#22c55e",
                    "#6366f1"
                ]

            }]

        },

        options:{

            plugins:{

                legend:{

                    position:"bottom"

                }

            }

        }

    });

}
// ==========================
// Settings Modal
// ==========================

const settingsNav = document.getElementById("settingsNav");
const settingsModal = document.getElementById("settingsModal");
const closeSettingsBtn = document.getElementById("closeSettingsBtn");

const toggleThemeBtn = document.getElementById("toggleThemeBtn");
const clearTasksBtn = document.getElementById("clearTasksBtn");
const aboutBtn = document.getElementById("aboutBtn");
settingsNav.addEventListener("click", (e) => {

    e.stopPropagation();

    settingsModal.style.display = "flex";

});




closeSettingsBtn.addEventListener("click", () => {

    settingsModal.style.display = "none";
 });
// Toggle Theme
toggleThemeBtn.addEventListener("click", () => {

    themeBtn.click();

});

// Clear All Tasks
clearTasksBtn.addEventListener("click", () => {

    if(confirm("Delete ALL tasks?")){

        tasks = [];

        localStorage.setItem("tasks", JSON.stringify(tasks));

        renderTasks();

        settingsModal.style.display = "none";

        showToast("All tasks deleted!", "#dc2626");

    }

});

// About
aboutBtn.addEventListener("click", () => {

    alert(
`TaskFlow

Version 1.0

Developed by:
Nikhil Sharma

Built using:
HTML
CSS
JavaScript`
    );

});


window.addEventListener("click", (e) => {

    if(e.target === settingsModal){

        settingsModal.style.display = "none";

    }

});
sortTasks.addEventListener("change", renderTasks);