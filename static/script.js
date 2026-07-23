document.addEventListener("DOMContentLoaded", () => {
  const bootProgress = document.getElementById("bootProgress");
  const bootPercent = document.getElementById("bootPercent");
  const bootMessage = document.getElementById("bootMessage");
  const projectsPanel = document.getElementById("projectsPanel");
  const openProjects = document.querySelector("[data-open-projects]");
  const closeProjects = document.querySelector("[data-close-projects]");

  const compactBoot = window.matchMedia("(max-width: 1024px)").matches;
  const stepDelay = compactBoot ? 190 : 310;
  const firstStepDelay = compactBoot ? 180 : 260;
  const readyDelay = compactBoot ? 1050 : 1600;
  const cleanupDelay = compactBoot ? 2200 : 3000;

  const bootSteps = [
    { value: 12, message: "Powering display..." },
    { value: 28, message: "Checking interface modules..." },
    { value: 47, message: "Loading portfolio index..." },
    { value: 66, message: "Mounting project links..." },
    { value: 84, message: "Calibrating display..." },
    { value: 100, message: "Ready." }
  ];

  document.body.classList.add("is-booting");

  bootSteps.forEach((step, index) => {
    window.setTimeout(() => {
      bootProgress.style.width = `${step.value}%`;
      bootPercent.textContent = `${step.value}%`;
      bootMessage.textContent = step.message;
    }, firstStepDelay + index * stepDelay);
  });

  window.setTimeout(() => {
    document.body.classList.add("is-ready");
  }, readyDelay);

  window.setTimeout(() => {
    document.body.classList.remove("is-booting");
  }, cleanupDelay);

  const setProjectsOpen = (isOpen) => {
    projectsPanel.classList.toggle("is-open", isOpen);
    projectsPanel.setAttribute("aria-hidden", String(!isOpen));
    document.body.style.overflow = isOpen ? "hidden" : "";

    if (isOpen) {
      closeProjects.focus();
    } else {
      openProjects.focus();
    }
  };

  openProjects.addEventListener("click", () => setProjectsOpen(true));
  closeProjects.addEventListener("click", () => setProjectsOpen(false));

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && projectsPanel.classList.contains("is-open")) {
      setProjectsOpen(false);
    }
  });

  const transitionLinks = document.querySelectorAll("[data-transition]");

  transitionLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const destination = link.href;

      if (
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        link.target === "_blank"
      ) {
        return;
      }

      event.preventDefault();
      document.body.classList.add("is-leaving");

      window.setTimeout(() => {
        window.location.href = destination;
      }, 390);
    });
  });
});
