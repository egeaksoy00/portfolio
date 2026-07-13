const appButtons = document.querySelectorAll("[data-window]");
const windows = document.querySelectorAll(".window");
const activeAppName = document.getElementById("activeAppName");

function setActiveAppName(windowEl) {
  if (!activeAppName) return;

  activeAppName.textContent = windowEl
    ? windowEl.dataset.appTitle || "EgeOS"
    : "Desktop";
}

function openWindow(id) {
  const target = document.getElementById(id);
  if (!target) return;

  windows.forEach((windowEl) => {
    windowEl.classList.toggle("active", windowEl === target);
  });

  setActiveAppName(target);
}

appButtons.forEach((button) => {
  button.addEventListener("click", () => {
    openWindow(button.dataset.window);
  });
});

windows.forEach((windowEl) => {
  const closeButton = windowEl.querySelector(".window-control.close");

  closeButton?.addEventListener("click", (event) => {
    event.stopPropagation();
    windowEl.classList.remove("active");
    setActiveAppName(null);
  });
});

function updateClock() {
  const clock = document.getElementById("clock");
  if (!clock) return;

  const now = new Date();

  clock.textContent = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

updateClock();
setInterval(updateClock, 1000);

// Forward mouse events to the 3D monitor host.
// Keyboard events stay inside EgeOS so terminal input works normally.
["mousemove", "mousedown", "mouseup"].forEach((type) => {
  window.addEventListener(type, (event) => {
    if (window.parent && window.parent !== window) {
      window.parent.postMessage(
        {
          type,
          clientX: event.clientX,
          clientY: event.clientY,
        },
        "*"
      );
    }
  });
});

const commands = {
  help: [
    "Available commands:",
    "about     → who is Ege?",
    "projects  → show selected projects",
    "skills    → show tech stack",
    "contact   → show contact links",
    "money     → run financial motivation protocol",
    "clear     → clear terminal",
  ],
  about: [
    "Ege Aksoy — Information Systems student at Bilkent University.",
    "Focus: software engineering, automation, crypto systems, and networking.",
  ],
  projects: [
    "01 Real-Time Opportunity Detector",
    "02 Frontend Black Tile Game",
    "03 Selenium-Cucumber Framework",
    "04 DriveEase Car Rental System",
  ],
  skills: [
    "Java · Python · JavaScript · HTML · CSS · C",
    "Selenium · Maven · n8n · Power Automate · GitHub",
  ],
  contact: [
    "Email: egeaksoy@ug.bilkent.edu.tr",
    "GitHub: github.com/egeaksoy00",
    "LinkedIn: linkedin.com/in/egeaksoy00",
  ],
  money: [
    "Running money protocol...",
    "Status: ambition detected.",
    "Advice: build, ship, iterate, repeat.",
  ],
};

function writeTerminalLine(text) {
  const terminalBox = document.getElementById("terminalBox");
  if (!terminalBox) return;

  const p = document.createElement("p");
  p.textContent = text;
  terminalBox.appendChild(p);
  terminalBox.scrollTop = terminalBox.scrollHeight;
}

function runTerminalCommand() {
  const terminalInput = document.getElementById("terminalInput");
  const terminalBox = document.getElementById("terminalBox");

  if (!terminalInput || !terminalBox) return;

  const command = terminalInput.value.trim().toLowerCase();
  terminalInput.value = "";

  if (!command) return;

  writeTerminalLine(`user@egeos:~$ ${command}`);

  if (command === "clear") {
    terminalBox.innerHTML = "";
    return;
  }

  const response = commands[command];

  if (response) {
    response.forEach(writeTerminalLine);
  } else {
    writeTerminalLine(`Command not found: ${command}`);
    writeTerminalLine("Type 'help' to see available commands.");
  }
}

const terminalInput = document.getElementById("terminalInput");

terminalInput?.addEventListener("keydown", (event) => {
  if (event.key !== "Enter") return;

  event.preventDefault();
  event.stopPropagation();
  runTerminalCommand();
});


// EgeOS paged credits sequence.
// Each page advances after 3 seconds or immediately when "Click to continue..." is pressed.
const creditsWindow = document.getElementById("credits");
const creditSlides = Array.from(document.querySelectorAll(".credit-slide"));
const creditContinue = document.getElementById("creditContinue");
const creditProgress = document.getElementById("creditProgress");
const creditTimerBar = document.querySelector("#creditTimer span");

let creditIndex = 0;
let creditTimeout = null;

function renderCreditProgress() {
  if (!creditProgress) return;

  creditProgress.innerHTML = "";

  creditSlides.forEach((_, index) => {
    const dot = document.createElement("span");
    dot.classList.toggle("active", index === creditIndex);
    creditProgress.appendChild(dot);
  });
}

function restartCreditTimer() {
  window.clearTimeout(creditTimeout);

  if (creditTimerBar) {
    creditTimerBar.classList.remove("running");
    void creditTimerBar.offsetWidth;
    creditTimerBar.classList.add("running");
  }

  creditTimeout = window.setTimeout(() => {
    showCreditSlide((creditIndex + 1) % creditSlides.length);
  }, 3000);
}

function showCreditSlide(index) {
  if (!creditSlides.length) return;

  creditIndex = (index + creditSlides.length) % creditSlides.length;

  creditSlides.forEach((slide, slideIndex) => {
    slide.classList.toggle("active", slideIndex === creditIndex);
  });

  renderCreditProgress();

  if (creditsWindow?.classList.contains("active")) {
    restartCreditTimer();
  }
}

creditContinue?.addEventListener("click", (event) => {
  event.stopPropagation();
  showCreditSlide((creditIndex + 1) % creditSlides.length);
});

const creditsObserver = creditsWindow
  ? new MutationObserver(() => {
      if (creditsWindow.classList.contains("active")) {
        showCreditSlide(0);
      } else {
        window.clearTimeout(creditTimeout);
        creditTimerBar?.classList.remove("running");
      }
    })
  : null;

if (creditsWindow && creditsObserver) {
  creditsObserver.observe(creditsWindow, {
    attributes: true,
    attributeFilter: ["class"],
  });
}

renderCreditProgress();
