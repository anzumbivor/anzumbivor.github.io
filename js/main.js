(function(){
  // -------------------------
  // Mobile menu
  // -------------------------
  const menuBtn = document.getElementById("menuBtn");
  if(menuBtn){
    menuBtn.addEventListener("click", ()=>{
      const nav = document.getElementById("navLinks");
      if(nav) nav.classList.toggle("open");
    });
  }

  // -------------------------
  // Theme toggle (light default)
  // Requires: <button id="themeBtn" class="themebtn" type="button">Theme</button>
  // CSS uses: html[data-theme="dark"] { ... }
  // -------------------------
  const themeBtn = document.getElementById("themeBtn");
  const root = document.documentElement;

  function applyTheme(theme){
    if(theme === "dark") root.setAttribute("data-theme", "dark");
    else root.removeAttribute("data-theme"); // light default
  }

  // Initialize theme:
  // 1) localStorage theme if set
  // 2) otherwise system preference
  try{
    const saved = localStorage.getItem("theme"); // "light" | "dark" | null
    if(saved === "dark" || saved === "light"){
      applyTheme(saved);
    }else{
      const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
      applyTheme(prefersDark ? "dark" : "light");
    }
  }catch(e){
    // If storage is blocked, fall back to system preference
    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    applyTheme(prefersDark ? "dark" : "light");
  }

  // Optional: keep button text meaningful
  function syncBtnLabel(){
    if(!themeBtn) return;
    const isDark = root.getAttribute("data-theme") === "dark";
    themeBtn.textContent = isDark ? "Light" : "Dark";
    themeBtn.setAttribute("aria-label", isDark ? "Switch to light theme" : "Switch to dark theme");
    themeBtn.setAttribute("title", isDark ? "Switch to light theme" : "Switch to dark theme");
  }

  syncBtnLabel();

  if(themeBtn){
    themeBtn.addEventListener("click", ()=>{
      const isDark = root.getAttribute("data-theme") === "dark";
      const next = isDark ? "light" : "dark";
      applyTheme(next);
      syncBtnLabel();
      try{ localStorage.setItem("theme", next); }catch(e){}
    });
  }

  // -------------------------
  // Active nav link for multi-page
  // -------------------------
  const path = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  document.querySelectorAll('a[data-nav]').forEach(a=>{
    const href = (a.getAttribute("href")||"").toLowerCase();
    if(href === path) a.setAttribute("aria-current","page");
  });

  // Footer year
  const y = document.getElementById("year");
  if(y) y.textContent = new Date().getFullYear();
})();

// -------------------------
// Research galleries
// -------------------------
document.querySelectorAll("[data-gallery]").forEach(gallery => {
  const imgs = Array.from(gallery.querySelectorAll(".rimg"));
  if(imgs.length <= 1) return;

  const prev = gallery.querySelector(".prev");
  const next = gallery.querySelector(".next");
  const dotsWrap = gallery.querySelector(".rdots");

  let i = imgs.findIndex(x => x.classList.contains("active"));
  if (i < 0) i = 0;

  // If dots container exists, build dots
  let dots = [];
  if(dotsWrap){
    dotsWrap.innerHTML = "";
    dots = imgs.map((_, idx) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "rdot" + (idx === i ? " active" : "");
      b.setAttribute("aria-label", `Show image ${idx + 1}`);
      b.addEventListener("click", () => show(idx));
      dotsWrap.appendChild(b);
      return b;
    });
  }

  function show(idx){
    imgs[i].classList.remove("active");
    if(dots[i]) dots[i].classList.remove("active");

    i = (idx + imgs.length) % imgs.length;

    imgs[i].classList.add("active");
    if(dots[i]) dots[i].classList.add("active");
  }

  prev?.addEventListener("click", () => show(i - 1));
  next?.addEventListener("click", () => show(i + 1));
});
