const overlay = document.getElementById("commandOverlay");
const openButton = document.getElementById("commandHint");
const closeButton = document.getElementById("closeCommand");

function openCommandMenu() {
  overlay.classList.add("is-open");
  overlay.setAttribute("aria-hidden", "false");
}

function closeCommandMenu() {
  overlay.classList.remove("is-open");
  overlay.setAttribute("aria-hidden", "true");
}

openButton.addEventListener("click", openCommandMenu);
closeButton.addEventListener("click", closeCommandMenu);

overlay.addEventListener("click", (event) => {
  if (event.target === overlay) closeCommandMenu();
});

document.addEventListener("keydown", (event) => {
  const isShortcut = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "j";

  if (isShortcut) {
    event.preventDefault();
    overlay.classList.contains("is-open") ? closeCommandMenu() : openCommandMenu();
  }

  if (event.key === "Escape") {
    closeCommandMenu();
  }
});
