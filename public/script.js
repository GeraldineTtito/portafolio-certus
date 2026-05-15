const documentElement = document.documentElement;
const themeToggle = document.querySelector("#themeToggle");
const menuToggle = document.querySelector("#menuToggle");
const navMenu = document.querySelector("#navMenu");
const navLinks = [...document.querySelectorAll(".nav-menu a")];
const contactForm = document.querySelector("#contactForm");
const formStatus = document.querySelector("#formStatus");

const storageKeys = Object.freeze({
  theme: "ana-portfolio-theme",
});

const getPreferredTheme = () => {
  const savedTheme = localStorage.getItem(storageKeys.theme);
  if (savedTheme) return savedTheme;
  return globalThis.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

const setTheme = (theme) => {
  documentElement.dataset.theme = theme;
  localStorage.setItem(storageKeys.theme, theme);
  themeToggle.setAttribute(
    "aria-label",
    theme === "dark" ? "Cambiar a tema claro" : "Cambiar a tema oscuro",
  );
};

const toggleTheme = () => {
  const nextTheme = documentElement.dataset.theme === "dark" ? "light" : "dark";
  setTheme(nextTheme);
};

const setMenuState = (isOpen) => {
  navMenu.classList.toggle("is-open", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Cerrar menú" : "Abrir menú");
};

const closeMenu = () => setMenuState(false);

const updateActiveLink = () => {
  const currentSection = [...document.querySelectorAll("main section[id]")]
    .findLast((section) => section.getBoundingClientRect().top <= 140);

  if (!currentSection) return;

  navLinks.forEach((link) => {
    link.classList.toggle(
      "is-active",
      link.getAttribute("href") === `#${currentSection.id}`,
    );
  });
};

const validateForm = (formData) => {
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const message = String(formData.get("message") || "").trim();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!name || !email || !message)
    return "Completa todos los campos para enviar el mensaje.";
  if (!emailPattern.test(email)) return "Ingresa un email válido.";
  return "";
};

const handleSubmit = (event) => {
  event.preventDefault();
  const formData = new FormData(contactForm);
  const errorMessage = validateForm(formData);

  if (errorMessage) {
    formStatus.style.color = "var(--color-primary-dark)";
    formStatus.textContent = errorMessage;
    return;
  }

  formStatus.style.color = "var(--color-success)";
  formStatus.textContent =
    "Mensaje listo para enviar. Conecta este formulario a tu backend o servicio de email.";
  contactForm.reset();
};

setTheme(getPreferredTheme());

themeToggle.addEventListener("click", toggleTheme);
menuToggle.addEventListener("click", () =>
  setMenuState(!navMenu.classList.contains("is-open")),
);
navLinks.forEach((link) => link.addEventListener("click", closeMenu));
contactForm.addEventListener("submit", handleSubmit);
window.addEventListener("scroll", updateActiveLink, { passive: true });
window.addEventListener("resize", () => {
  if (window.innerWidth > 860) closeMenu();
});
updateActiveLink();
