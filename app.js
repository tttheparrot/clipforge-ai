const form = document.getElementById("clipForm");
const progress = document.getElementById("progress");
const results = document.getElementById("results");
const statusEl = document.getElementById("status");
const percentEl = document.getElementById("percent");
const barFill = document.getElementById("barFill");
const grid = document.getElementById("clipGrid");
const titleEl = document.getElementById("videoTitle");
const button = document.getElementById("generate");

let timer;

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const url = document.getElementById("url").value.trim();
  const count = document.getElementById("count").value;
  const maxLength = document.getElementById("length").value;

  button.disabled = true;
  button.style.opacity = ".65";
  results.classList.add("hidden");
  progress.classList.remove("hidden");
  statusEl.textContent = "Starting…";
  percentEl.textContent = "0%";
  barFill.style.width = "0%";

  try {
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ url, count, maxLength })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Could not start the job.");
    poll(data.jobId);
  } catch (err) {
    statusEl.textContent = err.message;
    button.disabled = false;
    button.style.opacity = "1";
  }
});

async function poll(jobId) {
  clearTimeout(timer);
  try {
    const response = await fetch(`/api/jobs/${jobId}`);
    const job = await response.json();
    statusEl.textContent = job.message || "Processing…";
    const pct = Number(job.progress || 0);
    percentEl.textContent = `${pct}%`;
    barFill.style.width = `${pct}%`;

    if (job.status === "done") {
      renderResults(job);
      button.disabled = false;
      button.style.opacity = "1";
      return;
    }
    if (job.status === "error") {
      statusEl.textContent = `Error: ${job.message}`;
      button.disabled = false;
      button.style.opacity = "1";
      return;
    }
    timer = setTimeout(() => poll(jobId), 1200);
  } catch (err) {
    statusEl.textContent = "Connection lost. Retrying…";
    timer = setTimeout(() => poll(jobId), 2000);
  }
}

function renderResults(job) {
  progress.classList.add("hidden");
  results.classList.remove("hidden");
  titleEl.textContent = job.videoTitle || "";
  grid.innerHTML = "";

  for (const clip of job.clips || []) {
    const card = document.createElement("article");
    card.className = "clip";
    card.innerHTML = `
      <video controls playsinline preload="metadata" src="${clip.url}"></video>
      <div class="clip-info">
        <div class="clip-title">${escapeHtml(clip.title)}</div>
        <div class="reason">${escapeHtml(clip.reason)}</div>
        <a class="download" href="${clip.url}" download>Download MP4</a>
      </div>`;
    grid.appendChild(card);
  }
  results.scrollIntoView({behavior:"smooth", block:"start"});
}

document.getElementById("newJob").addEventListener("click", () => {
  results.classList.add("hidden");
  form.reset();
  document.getElementById("url").focus();
  window.scrollTo({top:0, behavior:"smooth"});
});

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, c => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[c]));
}
