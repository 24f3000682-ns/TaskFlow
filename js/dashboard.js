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
const filterButtons = document.querySelectorAll(".filter-btn");

let currentFilter = "all";
const taskTitle = document.getElementById("taskTitle");
const taskDescription = document.getElementById("taskDescription");
const taskPriority = document.getElementById("taskPriority");
const taskDate = document.getElementById("taskDate");
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

// ===============================
// Render Tasks
// ===============================

function renderTasks(){

    taskList.innerHTML = "";
    const keyword = searchTask.value.toLowerCase();
    let completed = 0;

    tasks
   tasks
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

        if(task.completed) completed++;

        taskList.innerHTML += `

        <div class="task-card ${task.completed ? "completed" : ""}">

            <div class="task-header">

                <h3>${task.title}</h3>

                <span class="priority ${task.priority.toLowerCase()}">
                    ${task.priority}
                </span>

            </div>

            <p>${task.description || ""}</p>

            <div class="task-footer">

                <span>📅 ${task.dueDate || "No Due Date"}</span>

                <div>

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

    totalTasks.textContent = tasks.length;
    completedTasks.textContent = completed;
    pendingTasks.textContent = tasks.length - completed;
// Progress Bar
const progress = tasks.length === 0
    ? 0
    : Math.round((completed / tasks.length) * 100);

document.getElementById("progressBar").style.width = progress + "%";
document.getElementById("progressText").textContent = progress + "%";
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