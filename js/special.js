document.addEventListener("DOMContentLoaded", () => {
  const counters = document.querySelectorAll(".counter-display");
  const speed = 100; // lower = faster

  counters.forEach(counter => {
    const updateCount = () => {
      const target = +counter.getAttribute("data-target");
      const count = +counter.innerText.replace("+", "");
      const increment = target / speed;

      if (count < target) {
        counter.innerText = Math.ceil(count + increment) + "+";
        setTimeout(updateCount, 20); // smooth animation
      } else {
        counter.innerText = target + "+";
      }
    };

    updateCount();
  });
});
