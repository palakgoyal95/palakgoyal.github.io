// 🌙 Dark Mode Toggle
function toggleDarkMode() {
  document.documentElement.classList.toggle("dark");
}

// ⌨️ Typing Effect
const texts = ["Web Developer", "Python & Django", "Tailwind CSS Lover"];
let i = 0, j = 0, deleting = false;
const typing = document.getElementById("typing");

function typeEffect() {
  if (!typing) return;

  typing.textContent = texts[i].slice(0, j);

  if (!deleting && j++ === texts[i].length) deleting = true;
  if (deleting && j-- === 0) {
    deleting = false;
    i = (i + 1) % texts.length;
  }

  setTimeout(typeEffect, deleting ? 60 : 120);
}
typeEffect();

// 👀 Scroll Reveal
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("active");
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

// 📊 Skill Bar Animation
document.querySelectorAll(".bar").forEach(bar => {
  setTimeout(() => {
    bar.style.width = bar.dataset.level + "%";
  }, 600);
});
