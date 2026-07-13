document.getElementById("year").textContent = new Date().getFullYear();

const revealItems = document.querySelectorAll(
  ".workflow-step, .feature-card, .stack-card, .arch-node, .terminal-panel"
);

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14 }
);

revealItems.forEach((item) => {
  item.classList.add("reveal-item");
  observer.observe(item);
});
