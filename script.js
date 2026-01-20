// Dark mode toggle
function toggleDarkMode() {
  document.documentElement.classList.toggle("dark");
}

// Dynamic projects data
const projects = [
  {
    title: "Portfolio Website",
    desc: "Personal portfolio built using Tailwind CSS",
  },
  {
    title: "Django Blog",
    desc: "Blog application using Django and SQLite",
  },
  {
    title: "Web3 Wallet App",
    desc: "Connect wallet using MetaMask and JavaScript",
  }
];

// Load projects dynamically
const projectList = document.getElementById("projectList");

projects.forEach(project => {
  const div = document.createElement("div");
  div.className =
    "p-6 rounded-xl bg-white dark:bg-slate-800 shadow hover:scale-105 transition";

  div.innerHTML = `
    <h4 class="font-bold text-lg mb-2">${project.title}</h4>
    <p class="text-gray-600 dark:text-gray-400">${project.desc}</p>
  `;

  projectList.appendChild(div);
});


