document.getElementById("year").textContent = new Date().getFullYear();

const revealItems = document.querySelectorAll(".reveal-item, .pipeline article, .engineering-grid article");

if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealItems.forEach((item) => {
    item.classList.add("reveal-item");
    observer.observe(item);
  });
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}


// Animate numeric counters in the hero pipeline once it becomes visible.
const pipelineCounters = document.querySelectorAll("[data-pipeline-counter]");
const livePipeline = document.querySelector(".live-pipeline");

function animatePipelineCounters() {
  pipelineCounters.forEach((counter) => {
    const target = Number(counter.dataset.pipelineCounter);
    const duration = 1100;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      counter.textContent = Math.round(target * eased);
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  });
}

if (livePipeline && "IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const pipelineObserver = new IntersectionObserver((entries) => {
    if (entries.some((entry) => entry.isIntersecting)) {
      animatePipelineCounters();
      pipelineObserver.disconnect();
    }
  }, { threshold: 0.35 });
  pipelineObserver.observe(livePipeline);
} else {
  pipelineCounters.forEach((counter) => {
    counter.textContent = counter.dataset.pipelineCounter;
  });
}
