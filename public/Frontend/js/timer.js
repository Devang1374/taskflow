// ===== STUDY TIMER (FIXED VERSION) =====

let time = 25 * 60;
let timerInterval = null;

document.addEventListener("DOMContentLoaded", () => {

  const timerDisplay = document.getElementById("timerDisplay");
  const startBtn = document.getElementById("startTimer");
  const pauseBtn = document.getElementById("pauseTimer");
  const resetBtn = document.getElementById("resetTimer");

  if (!timerDisplay) return;

  // update display
  function updateTimerDisplay() {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;

    timerDisplay.textContent =
      String(minutes).padStart(2, "0") +
      ":" +
      String(seconds).padStart(2, "0");
  }

  // start
  startBtn?.addEventListener("click", () => {
    if (timerInterval) return;

    timerInterval = setInterval(() => {
      if (time > 0) {
        time--;
        updateTimerDisplay();
      } else {
        clearInterval(timerInterval);
        timerInterval = null;
        alert("Study session completed!");
      }
    }, 1000);
  });

  // pause
  pauseBtn?.addEventListener("click", () => {
    clearInterval(timerInterval);
    timerInterval = null;
  });

  // reset
  resetBtn?.addEventListener("click", () => {
    clearInterval(timerInterval);
    timerInterval = null;
    time = 25 * 60;
    updateTimerDisplay();
  });

  updateTimerDisplay();
});