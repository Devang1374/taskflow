const menuItems = document.querySelectorAll(".menu li");
const pages = document.querySelectorAll(".page");
let editIndex = null;

menuItems.forEach(item => {
  item.addEventListener("click", () => {

    // Remove active menu highlight
    menuItems.forEach(i => i.classList.remove("active"));
    item.classList.add("active");

    // Hide all pages
    pages.forEach(page => page.classList.remove("active-page"));

    // Show selected page
    const pageId = item.getAttribute("data-page");
    document.getElementById(pageId).classList.add("active-page");

  });
});

// Modal controls
const addBtn = document.querySelector(".add-btn");
const modal = document.getElementById("taskModal");
const closeBtn = document.querySelector(".close-btn");

addBtn.addEventListener("click", () => {
  modal.style.display = "flex";
});

closeBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

// close when clicking outside
window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});

const taskForm = document.getElementById("taskForm");
const taskList = document.getElementById("taskList");

// Load tasks on page start
document.addEventListener("DOMContentLoaded", loadTasks);

// Save task
taskForm.addEventListener("submit", function(e) {
  e.preventDefault();

  const title = document.getElementById("taskTitle").value;
  const subject = document.getElementById("taskSubject").value;
  const date = document.getElementById("taskDate").value;
  const priority = document.getElementById("taskPriority").value;

  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  if (editIndex !== null) {
    // update existing task
    tasks[editIndex] = {
      ...tasks[editIndex],
      title,
      subject,
      date,
      priority
    };
    editIndex = null;
  } else {
    // create new task
    tasks.push({
      title,
      subject,
      date,
      priority,
      completed: false
    });
  }

  localStorage.setItem("tasks", JSON.stringify(tasks));

  taskForm.reset();
  modal.style.display = "none";
  loadTasks();
  updateDashboard();
});

// Save to localStorage
function saveTask(task) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Show task in UI
function addTaskToUI(task, index) {
  const div = document.createElement("div");
  div.classList.add("task");

  if (task.completed) div.classList.add("completed");

  let priorityClass = "";
  if (task.priority === "High") priorityClass = "priority-high";
  if (task.priority === "Medium") priorityClass = "priority-medium";
  if (task.priority === "Low") priorityClass = "priority-low";

  div.innerHTML = `
    <input type="checkbox" ${task.completed ? "checked" : ""} onchange="toggleComplete(${index})">

    <span>
      <strong>${task.title}</strong>
      (${task.subject}) - ${task.date}
      <span class="priority ${priorityClass}">
        ${task.priority}
      </span>
    </span>

    <div>
      <button onclick="editTask(${index})" class="edit-btn">✏️</button>
      <button onclick="deleteTask(${index})" class="delete-btn">❌</button>
    </div>
  `;

  taskList.appendChild(div);
  updateDashboard();
}

// Load saved tasks
function loadTasks() {
  taskList.innerHTML = "";

  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach((task, index) => addTaskToUI(task, index));
}

// Delete task
function deleteTask(index) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  tasks.splice(index, 1);

  localStorage.setItem("tasks", JSON.stringify(tasks));
  loadTasks();
  updateDashboard();
}

// Toggle complete
function toggleComplete(index) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  tasks[index].completed = !tasks[index].completed;

  localStorage.setItem("tasks", JSON.stringify(tasks));
  loadTasks();
  updateDashboard();
}

// ===== Dark Mode =====

const themeToggle = document.getElementById("themeToggle");

// Load saved theme
if (localStorage.getItem("theme") === "dark") {
  document.documentElement.classList.add("dark");
  themeToggle.textContent = "☀️";
}

themeToggle.addEventListener("click", () => {
  document.documentElement.classList.toggle("dark");

  if (document.documentElement.classList.contains("dark")) {
    localStorage.setItem("theme", "dark");
    themeToggle.textContent = "☀️";
  } else {
    localStorage.setItem("theme", "light");
    themeToggle.textContent = "🌙";
  }
});

function editTask(index) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const task = tasks[index];

  // Fill form with existing data
  document.getElementById("taskTitle").value = task.title;
  document.getElementById("taskSubject").value = task.subject;
  document.getElementById("taskDate").value = task.date;
  document.getElementById("taskPriority").value = task.priority;

  editIndex = index;

  modal.style.display = "flex";
  updateDashboard();
}

// ===== SUBJECT SYSTEM =====

const subjectModal = document.getElementById("subjectModal");
const addSubjectBtn = document.getElementById("addSubjectBtn");
const closeSubjectBtn = document.querySelector(".close-subject");
const subjectForm = document.getElementById("subjectForm");
const subjectList = document.getElementById("subjectList");

// open modal
if (addSubjectBtn) {
  addSubjectBtn.addEventListener("click", () => {
    subjectModal.style.display = "flex";
  });
}

// close modal
if (closeSubjectBtn) {
  closeSubjectBtn.addEventListener("click", () => {
    subjectModal.style.display = "none";
  });
}

// load subjects when page loads
document.addEventListener("DOMContentLoaded", loadSubjects);

// save subject
if (subjectForm) {
  subjectForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("subjectName").value;
    const teacher = document.getElementById("subjectTeacher").value;

    let subjects = JSON.parse(localStorage.getItem("subjects")) || [];

    subjects.push({
      name,
      teacher
    });

    localStorage.setItem("subjects", JSON.stringify(subjects));

    subjectForm.reset();
    subjectModal.style.display = "none";
    loadSubjects();
    updateDashboard();
    loadSubjectFilter();
  });
}

// show subjects
function loadSubjects() {
  if (!subjectList) return;

  subjectList.innerHTML = "";

  let subjects = JSON.parse(localStorage.getItem("subjects")) || [];

  subjects.forEach((subject, index) => {
    const div = document.createElement("div");
    div.className = "subject-card";

    div.innerHTML = `
      <h3>${subject.name}</h3>
      <p>${subject.teacher || ""}</p>
      <button onclick="deleteSubject(${index})">Delete</button>
    `;

    subjectList.appendChild(div);
  });
}

// delete subject
function deleteSubject(index) {
  let subjects = JSON.parse(localStorage.getItem("subjects")) || [];
  subjects.splice(index, 1);
  localStorage.setItem("subjects", JSON.stringify(subjects));
  loadSubjects();
  updateDashboard();
  loadSubjectFilter();
}

// ===== EXAM SYSTEM =====

const examModal = document.getElementById("examModal");
const addExamBtn = document.getElementById("addExamBtn");
const closeExamBtn = document.querySelector(".close-exam");
const examForm = document.getElementById("examForm");
const examList = document.getElementById("examList");

// open modal
if (addExamBtn) {
  addExamBtn.addEventListener("click", () => {
    examModal.style.display = "flex";
  });
}

// close modal
if (closeExamBtn) {
  closeExamBtn.addEventListener("click", () => {
    examModal.style.display = "none";
  });
}

// load exams on page load
document.addEventListener("DOMContentLoaded", loadExams);

// save exam
if (examForm) {
  examForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("examName").value;
    const date = document.getElementById("examDate").value;

    let exams = JSON.parse(localStorage.getItem("exams")) || [];

    exams.push({ name, date });

    localStorage.setItem("exams", JSON.stringify(exams));

    examForm.reset();
    examModal.style.display = "none";

    loadExams();
    updateDashboard();
  });
}

// show exams
function loadExams() {
  if (!examList) return;

  examList.innerHTML = "";

  let exams = JSON.parse(localStorage.getItem("exams")) || [];

  exams.forEach((exam, index) => {
    const daysLeft = getDaysLeft(exam.date);

    const div = document.createElement("div");
    div.className = "exam-card";

    div.innerHTML = `
      <h3>${exam.name}</h3>
      <p class="exam-date">${exam.date}</p>
      <p class="countdown">${daysLeft}</p>
      <button onclick="deleteExam(${index})">Delete</button>
    `;

    examList.appendChild(div);
  });
}

// calculate days left
function getDaysLeft(date) {
  const examDate = new Date(date);
  const today = new Date();

  const diff = examDate - today;
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

  if (days < 0) return "Exam finished";
  if (days === 0) return "Today!";
  return days + " days left";
}

// delete exam
function deleteExam(index) {
  let exams = JSON.parse(localStorage.getItem("exams")) || [];
  exams.splice(index, 1);
  localStorage.setItem("exams", JSON.stringify(exams));
  loadExams();
  updateExamStats();
}

// ===== DASHBOARD STATS =====

document.addEventListener("DOMContentLoaded", updateDashboard);

// update stats
function updateDashboard() {
  updateTaskStats();
  updateSubjectStats();
  updateExamStats();
}

// ===== TASK STATS =====
function updateTaskStats() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const pending = total - completed;

  setText("totalTasks", total);
  setText("completedTasks", completed);
  setText("pendingTasks", pending);
}

// ===== SUBJECT STATS =====
function updateSubjectStats() {
  const subjects = JSON.parse(localStorage.getItem("subjects")) || [];
  setText("totalSubjects", subjects.length);
}

// ===== EXAM STATS =====
function updateExamStats() {
  const exams = JSON.parse(localStorage.getItem("exams")) || [];

  const today = new Date();

  const upcoming = exams.filter(exam => {
    return new Date(exam.date) >= today;
  });

  setText("upcomingExams", upcoming.length);
}

// helper
function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

// ===== LOAD SUBJECTS INTO TASK FORM =====
function loadSubjectsIntoDropdown() {
  const dropdown = document.getElementById("taskSubject");
  if (!dropdown) return;

  const subjects = JSON.parse(localStorage.getItem("subjects")) || [];

  dropdown.innerHTML = `<option value="">No Subject</option>`;

  subjects.forEach(subject => {
    const option = document.createElement("option");
    option.value = subject.name;
    option.textContent = subject.name;
    dropdown.appendChild(option);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  loadSubjectsIntoDropdown();
});

const taskSearch = document.getElementById("taskSearch");

if (taskSearch) {
  taskSearch.addEventListener("input", () => {
    const searchText = taskSearch.value.toLowerCase();
    filterTasks(searchText);
  });
}

function filterTasks(searchText) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  const filtered = tasks.filter(task =>
    task.title.toLowerCase().includes(searchText)
  );

  renderFilteredTasks(filtered);
}

function renderFilteredTasks(filteredTasks) {
  const taskContainer = document.getElementById("taskList"); // your task container id
  if (!taskContainer) return;

  taskContainer.innerHTML = "";

  filteredTasks.forEach((task, index) => {
    const div = document.createElement("div");
    div.className = "task-card";

    div.innerHTML = `
      <h3>${task.title}</h3>
      <p>${task.subject || "No Subject"}</p>
    `;

    taskContainer.appendChild(div);
  });
}

// ===== LOAD SUBJECTS INTO FILTER =====
function loadSubjectFilter() {
  const filter = document.getElementById("subjectFilter");
  if (!filter) return;

  const subjects = JSON.parse(localStorage.getItem("subjects")) || [];

  filter.innerHTML = `<option value="">All Subjects</option>`;
    
  subjects.forEach(subject => {
    const option = document.createElement("option");
    option.value = subject.name;
    option.textContent = subject.name;
    filter.appendChild(option);
  });
}

document.addEventListener("DOMContentLoaded", loadSubjectFilter);


const subjectFilter = document.getElementById("subjectFilter");

if (subjectFilter) {
  subjectFilter.addEventListener("change", applyTaskFilters);
}

function applyTaskFilters() {
  const searchText = document.getElementById("taskSearch")?.value.toLowerCase() || "";
  const selectedSubject = document.getElementById("subjectFilter")?.value || "";

  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  const filtered = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchText);
    const matchesSubject = !selectedSubject || task.subject === selectedSubject;

    return matchesSearch && matchesSubject;
  });

  renderFilteredTasks(filtered);
}

taskSearch.addEventListener("input", applyTaskFilters);