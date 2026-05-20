/* Copy-to-clipboard for code blocks */
document.querySelectorAll(".code").forEach((block) => {
  const btn = block.querySelector(".copy-btn");
  if (!btn) return;
  btn.addEventListener("click", () => {
    const code = block.dataset.code || block.querySelector("pre").textContent;
    navigator.clipboard.writeText(code).then(() => {
      const orig = btn.textContent;
      btn.textContent = "Copied ✓";
      btn.classList.add("copied");
      setTimeout(() => {
        btn.textContent = orig;
        btn.classList.remove("copied");
      }, 1500);
    });
  });
});

/* Sidebar active-link tracking */
const links = [...document.querySelectorAll(".nav-link")];
const sections = links.map((l) => document.querySelector(l.getAttribute("href"))).filter(Boolean);

function setActive() {
  const scrollTop = window.scrollY + 120;
  let activeIdx = 0;
  sections.forEach((sec, i) => {
    if (sec.offsetTop <= scrollTop) activeIdx = i;
  });
  links.forEach((l, i) => {
    if (i === activeIdx) {
      l.style.background = "#f5f3ff";
      l.style.color = "#7c3aed";
      l.style.fontWeight = "500";
    } else {
      l.style.background = "";
      l.style.color = "";
      l.style.fontWeight = "";
    }
  });
}
window.addEventListener("scroll", setActive, { passive: true });
setActive();
