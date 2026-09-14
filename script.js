const username = "yeenci";

document.getElementById("year").textContent = new Date().getFullYear();

const menuBtn = document.querySelector(".menu-btn");
const nav = document.querySelector(".nav");

menuBtn?.addEventListener("click", () => {
  nav.classList.toggle("open");
});

document.querySelectorAll(".nav a").forEach(link => {
  link.addEventListener("click", () => nav.classList.remove("open"));
});

const fallbackProjects = [
  {
    name: "applaydu-talking-toys",
    description: "Websocket-based tooling and smoke/load testing for a talking toys platform.",
    language: "JavaScript",
    html_url: `https://github.com/${username}`
  },
  {
    name: "vietnamese-folk-music-classification",
    description: "CNN-based classification of Vietnamese folk music genres.",
    language: "Python",
    html_url: `https://github.com/${username}`
  }
];

function renderProjects(repos) {
  const container = document.querySelector("#github-projects");

  container.innerHTML = repos
    .filter(repo => !repo.fork)
    .slice(0, 6)
    .map(repo => `
      <a class="project-card" href="${repo.html_url}" target="_blank" rel="noreferrer">
        <span class="project-type">GITHUB PROJECT</span>
        <h3>${escapeHtml(repo.name)}</h3>
        <p>${escapeHtml(repo.description || "No description yet.")}</p>
        <div class="repo-meta">
          ${repo.language ? escapeHtml(repo.language).toUpperCase() : "CODE"}
          &nbsp; / &nbsp; VIEW REPOSITORY ↗
        </div>
      </a>
    `).join("");

  if (!container.innerHTML) {
    renderFallback();
  }
}

function renderFallback() {
  const container = document.querySelector("#github-projects");
  container.innerHTML = fallbackProjects.map(repo => `
    <a class="project-card" href="${repo.html_url}" target="_blank" rel="noreferrer">
      <span class="project-type">SELECTED PROJECT</span>
      <h3>${escapeHtml(repo.name)}</h3>
      <p>${escapeHtml(repo.description)}</p>
      <div class="repo-meta">${repo.language.toUpperCase()} &nbsp; / &nbsp; VIEW GITHUB ↗</div>
    </a>
  `).join("");
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[char]));
}

fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=12`)
  .then(response => {
    if (!response.ok) throw new Error("GitHub API request failed");
    return response.json();
  })
  .then(renderProjects)
  .catch(renderFallback);
