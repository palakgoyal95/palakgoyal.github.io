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

  const currentText = texts[i];

  if (deleting) {
    typing.textContent = currentText.slice(0, j);
    if (j === 0) {
      deleting = false;
      i = (i + 1) % texts.length;
    } else {
      j--;
    }
  } else {
    typing.textContent = currentText.slice(0, j);
    if (j === currentText.length) {
      deleting = true;
      setTimeout(typeEffect, 1500); // Pause at end
      return;
    } else {
      j++;
    }
  }

  setTimeout(typeEffect, deleting ? 50 : 100);
}
typeEffect();

// 👀 Scroll Reveal
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => e.isIntersecting && e.target.classList.add("active"));
}, { threshold: 0.15 });

document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

// 📊 Skill Bar Animation
document.querySelectorAll(".bar").forEach(bar => {
  setTimeout(() => bar.style.width = bar.dataset.level + "%", 600);
});
