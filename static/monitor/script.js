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

const desktop = document.querySelector(".desktop");

function showWelcome() {
  if (!desktop) return;

  desktop.innerHTML = `
    <section class="welcome-screen">
      <div class="welcome-card">
        <p class="welcome-kicker">EgeOS boot sequence interrupted</p>
        <h1>Welcome, visitor.</h1>
        <p>
          You found the close button. Nice.
          This is Ege Aksoy’s tiny operating system for projects,
          experiments, crypto signals, automation, and unfinished ideas that might become something serious.
        </p>

        <button class="enter-os-button" id="enterEgeOS">
          Enter EgeOS
        </button>
      </div>
    </section>
  `;

  const enterButton = document.getElementById("enterEgeOS");

  enterButton.addEventListener("click", () => {
    window.location.reload();
  });
}

const closeButtons = document.querySelectorAll(".traffic span:first-child");

closeButtons.forEach((closeButton) => {
  closeButton.style.cursor = "pointer";
  closeButton.addEventListener("click", showWelcome);
});

if (closeButton) {
  closeButton.style.cursor = "pointer";
  closeButton.addEventListener("click", showWelcome);
}

const terminalInput = document.getElementById("terminalInput");
const terminalBox = document.getElementById("terminalBox");

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
  if (!terminalBox) return;
  const p = document.createElement("p");
  p.textContent = text;
  terminalBox.appendChild(p);
  terminalBox.scrollTop = terminalBox.scrollHeight;
}

if (terminalInput && terminalBox) {
  terminalInput.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") return;

    const command = terminalInput.value.trim().toLowerCase();
    terminalInput.value = "";

    if (!command) return;

    writeTerminalLine(`ege@egeos:~$ ${command}`);

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
  });
}