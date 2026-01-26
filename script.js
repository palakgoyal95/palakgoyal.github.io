/* DARK / LIGHT MODE */
const toggleBtn = document.getElementById("themeToggle");
const html = document.documentElement;

toggleBtn.addEventListener("click", () => {
  html.classList.toggle("dark");
  toggleBtn.textContent = html.classList.contains("dark") ? "☀️" : "🌙";
});

/* TYPING ANIMATION */
const texts = [
  "Python Developer",
  "Django Backend Enthusiast",
  "Tailwind CSS Lover",
  "Problem Solver"
];

let textIndex = 0, charIndex = 0, deleting = false;
const typingEl = document.getElementById("typing");

function typeEffect() {
  const current = texts[textIndex];
  typingEl.textContent = deleting
    ? current.slice(0, --charIndex)
    : current.slice(0, ++charIndex);

  if (!deleting && charIndex === current.length) deleting = true;
  if (deleting && charIndex === 0) {
    deleting = false;
    textIndex = (textIndex + 1) % texts.length;
  }

  setTimeout(typeEffect, deleting ? 60 : 120);
}
typeEffect();

/* SCROLL REVEAL */
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => e.isIntersecting && e.target.classList.add("active"));
}, { threshold: 0.15 });

document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

/* CURSOR GLOW */
const glow = document.getElementById("cursor-glow");
document.addEventListener("mousemove", e => {
  glow.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
});
