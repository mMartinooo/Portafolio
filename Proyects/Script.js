/* ============================
   FILTRO + ANIMACIONES PRO
============================ */

function filterProjects(category) {
  const cards = document.querySelectorAll(".card");
  const buttons = document.querySelectorAll(".filters button");

  // Estado activo del botón
  buttons.forEach(btn => {
    btn.classList.remove("active");
    if (btn.textContent.toLowerCase().includes(category) || 
        (category === "all" && btn.textContent.toLowerCase() === "todos")) {
      btn.classList.add("active");
    }
  });

  // Ocultar todas primero
  cards.forEach(card => {
    card.style.transitionDelay = "0ms";
    card.classList.remove("visible");
    card.classList.add("hidden");
  });

  setTimeout(() => {
    cards.forEach((card, index) => {
      const cat = card.dataset.category;
      const show = category === "all" || cat === category;

      if (show) {
        card.style.display = "block";

        // Forzar reflow real
        card.getBoundingClientRect();

        card.classList.remove("hidden");
        card.classList.add("visible");

        // Cascada
        card.style.transitionDelay = `${index * 80}ms`;
      } else {
        card.style.display = "none";
      }
    });
  }, 180);
}

/* ============================
   ANIMACION GLOBAL ENTRADA
============================ */

window.addEventListener("load", () => {
  const elements = document.querySelectorAll(
  ".cabeza, .filters, .grid, footer"
);


  // Estado inicial
  elements.forEach(el => {
    el.classList.add("page-enter");
  });

  // Revelar
  setTimeout(() => {
    elements.forEach(el => {
      el.classList.add("page-visible");
    });

    // Animar cards al cargar
    filterProjects("all");
  }, 100);
});
