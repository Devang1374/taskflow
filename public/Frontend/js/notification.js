function requestNotificationPermission() {
  if ("Notification" in window && Notification.permission !== "granted") {
    Notification.requestPermission();
  }
}

document.addEventListener("DOMContentLoaded", requestNotificationPermission);

// ===== EXAM REMINDERS =====

function checkExamReminders() {
  if (!("Notification" in window)) return;
  if (Notification.permission !== "granted") return;

  const exams = JSON.parse(localStorage.getItem("exams")) || [];
  const today = new Date();

  exams.forEach(exam => {
    const examDate = new Date(exam.date);
    const diffDays = Math.ceil(
      (examDate - today) / (1000 * 60 * 60 * 24)
    );

    // notify 1 day before exam
    if (diffDays === 1) {
      new Notification(`📢 ${exam.name} exam is tomorrow!`);
    }

    // notify on exam day
    if (diffDays === 0) {
      new Notification(`🔥 ${exam.name} exam is today!`);
    }
  });
}

document.addEventListener("DOMContentLoaded", checkExamReminders);