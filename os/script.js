const buttons = document.querySelectorAll("[data-window]");
const windows = document.querySelectorAll(".window");

function openWindow(id) {
  windows.forEach((windowEl) => {
    windowEl.classList.toggle("active", windowEl.id === id);
  });

  buttons.forEach((button) => {
    button.classList.toggle("active", button.dataset.window === id);
  });
}

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    openWindow(button.dataset.window);
  });
});

function updateClock() {
  const clock = document.getElementById("clock");
  const now = new Date();
  clock.textContent = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

updateClock();
setInterval(updateClock, 1000);

// Forward basic mouse/key events to parent iframe host when used inside the 3D monitor.
["mousemove", "mousedown", "mouseup", "keydown", "keyup"].forEach((type) => {
  window.addEventListener(type, (event) => {
    if (window.parent) {
      window.parent.postMessage(
        {
          type,
          clientX: event.clientX,
          clientY: event.clientY,
          key: event.key,
        },
        "*"
      );
    }
  });
});
