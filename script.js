// 🌙 Dark mode
function toggleDarkMode() {
  document.documentElement.classList.toggle("dark");
}

// ⌨️ Typing animation
const text = ["Web Developer", "Tailwind CSS Lover", "Python & Web3 Enthusiast"];
let i = 0, j = 0, current = "", isDeleting = false;
const typingEl = document.getElementById("typing");

function type() {
  if (i < text.length) {
    if (!isDeleting && j <= text[i].length) {
      current = text[i].slice(0, ++j);
    } else if (isDeleting && j > 0) {
      current = text[i].slice(0, --j);
    }

    typingEl.textContent = current;

    if (j === text[i].length) isDeleting = true;
    if (isDeleting && j === 0) {
      isDeleting = false;
      i = (i + 1) % text.length;
    }
  }
  setTimeout(type, isDeleting ? 60 : 120);
}
type();

// 📊 Counter animation
document.querySelectorAll("[data-count]").forEach(el => {
  let target = +el.dataset.count;
  let count = 0;
  let step = target / 50;

  let interval = setInterval(() => {
    count += step;
    if (count >= target) {
      el.textContent = target;
      clearInterval(interval);
    } else {
      el.textContent = Math.floor(count);
    }
  }, 30);
});

// 🧩 Projects
const projects = [
  { title: "Portfolio Website", desc: "Animated portfolio using Tailwind CSS" },
  { title: "Django Blog", desc: "Blog platform with authentication" },
  { title: "Web3 Wallet App", desc: "MetaMask wallet connect demo" }
];

const projectList = document.getElementById("projectList");

projects.forEach(p => {
  const div = document.createElement("div");
  div.className = "glass text-left";
  div.innerHTML = `
    <h4 class="text-xl font-bold mb-2">${p.title}</h4>
    <p class="text-gray-600 dark:text-gray-400">${p.desc}</p>
  `;
  projectList.appendChild(div);
});



