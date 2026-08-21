const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();

const cursor = document.querySelector(".cursor-glow");
if (cursor) {
  window.addEventListener("pointermove", (e) => {
    cursor.style.left = `${e.clientX}px`;
    cursor.style.top = `${e.clientY}px`;
  });
}

/* ============================================================
   RESPONSIVE FULL-PAGE SCROLL FRAME ENGINE
   
   - Laptops / Desktops / Tablets (> 767px) ALWAYS use Desktop frames
   - Mobile Phones (<= 767px) ALWAYS use Mobile frames
   - Background pre-fetching does NOT hijack activeType
   ============================================================ */

const canvas = document.getElementById("frame-canvas");
const ctx = canvas ? canvas.getContext("2d", { alpha: true }) : null;

const sequences = {
  desktop: {
    folder: "assets/frames/desktop",
    frames: [],
    count: 239,
    digits: 4,
    ext: "webp"
  },
  mobile: {
    folder: "assets/frames/mobile",
    frames: [],
    count: 300,
    digits: 4,
    ext: "webp"
  }
};

let activeType = null;
let currentFrame = 0;
let raf = 0;
let loadToken = 0;

function isMobile() {
  // Mobile sequence ONLY for phone viewports <= 767px
  return window.innerWidth <= 767;
}

function getType() {
  return isMobile() ? "mobile" : "desktop";
}

function formatFramePath(type, index) {
  const seq = sequences[type];
  const digits = seq.digits || 4;
  const ext = seq.ext || "webp";
  return `${seq.folder}/frame_${String(index).padStart(digits, "0")}.${ext}`;
}

function resizeCanvas() {
  if (!canvas || !ctx) return;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.round(window.innerWidth * dpr);
  canvas.height = Math.round(window.innerHeight * dpr);
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  drawFrame(currentFrame);
}

function drawFrame(index) {
  if (!ctx || !activeType) return;
  const sequence = sequences[activeType];
  let image = sequence?.frames[index];

  // Nearest frame fallback if current target frame is downloading
  if (!image || !image.complete || !image.naturalWidth) {
    for (let fallback = index; fallback >= 0; fallback--) {
      if (sequence?.frames[fallback]?.complete && sequence?.frames[fallback]?.naturalWidth) {
        image = sequence.frames[fallback];
        break;
      }
    }
  }

  if (!image || !image.complete || !image.naturalWidth) return;

  const w = window.innerWidth;
  const h = window.innerHeight;

  ctx.clearRect(0, 0, w, h);

  if (activeType === "desktop") {
    /* Desktop sequence rendering for Laptops & Desktops */
    const scale = Math.max(w / image.naturalWidth, h / image.naturalHeight);
    const dw = image.naturalWidth * scale;
    const dh = image.naturalHeight * scale;

    const dx = (w - dw) / 2;
    const dy = Math.max(0, (h - dh) / 2);

    ctx.drawImage(image, dx, dy, dw, dh);
  } else {
    /* Mobile sequence rendering for Phones */
    const scale = Math.max(w / image.naturalWidth, h / image.naturalHeight);
    const dw = image.naturalWidth * scale;
    const dh = image.naturalHeight * scale;

    const dx = (w - dw) / 2;
    const dy = (h - dh) / 2;

    ctx.drawImage(image, dx, dy, dw, dh);
  }
}

function renderFromScroll() {
  const maxScroll = Math.max(
    1,
    document.documentElement.scrollHeight - window.innerHeight
  );

  const progress = Math.min(
    1,
    Math.max(0, window.scrollY / maxScroll)
  );

  const sequence = sequences[activeType];
  if (!sequence || sequence.count <= 0) return;

  const target = Math.min(
    sequence.count - 1,
    Math.floor(progress * (sequence.count - 1))
  );

  if (target !== currentFrame) {
    currentFrame = target;
    drawFrame(currentFrame);
  }

  raf = 0;
}

function requestFrameRender() {
  if (!raf) raf = requestAnimationFrame(renderFromScroll);
}

function loadSequence(type, isBackgroundPreload = false) {
  const sequence = sequences[type];
  const token = ++loadToken;

  if (!isBackgroundPreload) {
    activeType = type;
  }

  // Preload frame 0 immediately
  if (!sequence.frames[0]) {
    const f0 = new Image();
    f0.decoding = "sync";
    f0.onload = () => {
      sequence.frames[0] = f0;
      if (!isBackgroundPreload && token === loadToken && activeType === type) {
        resizeCanvas();
        drawFrame(0);
      }
    };
    f0.src = formatFramePath(type, 0);
  } else if (!isBackgroundPreload && token === loadToken && activeType === type) {
    resizeCanvas();
    drawFrame(currentFrame);
  }

  // Preload all frames in sequence
  for (let i = 0; i < sequence.count; i++) {
    if (sequence.frames[i]) continue;

    const img = new Image();
    img.decoding = "async";
    img.onload = () => {
      sequence.frames[i] = img;
      if (!isBackgroundPreload && token === loadToken && activeType === type && (i === currentFrame || i === 0)) {
        drawFrame(currentFrame);
      }
    };
    img.src = formatFramePath(type, i);
  }
}

function switchSequenceIfNeeded() {
  const nextType = getType();

  if (nextType !== activeType) {
    activeType = nextType;
    currentFrame = 0;
    loadSequence(nextType, false);
  }

  resizeCanvas();
  requestFrameRender();
}

window.addEventListener("scroll", requestFrameRender, { passive: true });
window.addEventListener("resize", switchSequenceIfNeeded);
window.addEventListener("orientationchange", switchSequenceIfNeeded);

/* Initialize sequence on page load */
function initSequence() {
  activeType = getType();
  resizeCanvas();
  loadSequence(activeType, false);

  // Background preloading for secondary sequence (does NOT hijack activeType)
  window.setTimeout(() => {
    const other = activeType === "desktop" ? "mobile" : "desktop";
    loadSequence(other, true);
  }, 1200);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initSequence);
} else {
  initSequence();
}

/* Scroll reveal animation */
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add("visible");
  });
}, { threshold: 0.1 });

document.querySelectorAll(".reveal").forEach((el, i) => {
  el.style.transitionDelay = `${Math.min(i % 5, 4) * 70}ms`;
  observer.observe(el);
});

/* Active navigation tracking */
const trackedSections = document.querySelectorAll("section[id], main[id]");
const navLinks = document.querySelectorAll(".nav-pill a");

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute("id");
      navLinks.forEach(link => {
        const href = link.getAttribute("href");
        if (href === `#${id}`) {
          navLinks.forEach(l => l.classList.remove("active"));
          link.classList.add("active");
        }
      });
    }
  });
}, { rootMargin: "-30% 0px -50% 0px", threshold: 0 });

trackedSections.forEach(sec => navObserver.observe(sec));
