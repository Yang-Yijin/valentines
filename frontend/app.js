const titleEl = document.getElementById("title");
const subtitleEl = document.getElementById("subtitle");
const letterEl = document.getElementById("letter");
const galleryEl = document.getElementById("gallery");
const daysEl = document.getElementById("days");
const returnCountdownEl = document.getElementById("returnCountdown");
const surpriseText = document.getElementById("surpriseText");
const signatureEl = document.getElementById("signature");
const bgm = document.getElementById("bgm");
const imageModal = document.getElementById("imageModal");
const modalImage = document.getElementById("modalImage");

const secretInput = document.getElementById("secretInput");
const secretBtn = document.getElementById("secretBtn");
const secretHint = document.getElementById("secretHint");
const secretMessage = document.getElementById("secretMessage");
const noteRainBtn = document.getElementById("noteRainBtn");
const noteRainLayer = document.getElementById("noteRainLayer");

const SECRET_CODE = "0719";
const noteTexts = [
  "宝宝还有五天就回来啦",
  "每一天都想和你一起过",
  "老婆对我好 我对老婆好",
  "没蹬~",
  "老婆宝宝大人要越来越爱我"
];

const unlockAudio = new Audio();
unlockAudio.preload = "auto";
unlockAudio.playsInline = true;

let secretMusicUrl = "";

function typeWriter(text) {
  letterEl.textContent = "";
  let i = 0;
  const timer = setInterval(() => {
    letterEl.textContent += text[i] ?? "";
    i += 1;
    if (i >= text.length) {
      clearInterval(timer);
    }
  }, 45);
}

function calculateDaysTogether(startDate) {
  const now = new Date();
  const start = new Date(startDate);
  const diffMs = now - start;
  return Math.max(1, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
}

function calculateCountdownDays(targetDate) {
  const now = new Date();
  const target = new Date(targetDate);
  const diffMs = target.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
}

function renderGallery(photos) {
  galleryEl.innerHTML = "";
  photos.forEach((url) => {
    const img = document.createElement("img");
    img.src = url;
    img.alt = "家庭美照";
    galleryEl.appendChild(img);
  });
}

function openImageModal(src, alt) {
  modalImage.src = src;
  modalImage.alt = alt ?? "大图预览";
  imageModal.classList.remove("hidden");
}

function closeImageModal() {
  imageModal.classList.add("hidden");
  modalImage.src = "";
}

function normalizeDate(rawDate) {
  if (typeof rawDate === "string") {
    return rawDate;
  }

  if (rawDate && typeof rawDate === "object") {
    const year = String(rawDate.year);
    const month = String(rawDate.month).padStart(2, "0");
    const day = String(rawDate.day).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  return new Date().toISOString().slice(0, 10);
}

async function tryPlayBgm() {
  try {
    await bgm.play();
    return true;
  } catch {
    return false;
  }
}

function registerFirstInteractionPlay() {
  const resume = async () => {
    const ok = await tryPlayBgm();
    if (ok) {
      window.removeEventListener("pointerdown", resume);
      window.removeEventListener("keydown", resume);
      window.removeEventListener("touchstart", resume);
    }
  };

  window.addEventListener("pointerdown", resume, { once: true });
  window.addEventListener("keydown", resume, { once: true });
  window.addEventListener("touchstart", resume, { once: true });
}

async function playSecretAudio() {
  if (!secretMusicUrl) {
    return;
  }

  bgm.pause();

  if (unlockAudio.src !== new URL(secretMusicUrl, window.location.origin).href) {
    unlockAudio.src = secretMusicUrl;
  }

  unlockAudio.currentTime = 0;
  await unlockAudio.play();
}

function initSecretUnlock() {
  const onUnlock = async () => {
    const input = secretInput.value.trim();

    if (input === SECRET_CODE) {
      secretHint.textContent = "解锁成功";
      secretMessage.classList.remove("hidden");
      secretInput.value = "";

      try {
        await playSecretAudio();
      } catch {
        secretHint.textContent = "解锁成功，但新音频播放失败，请检查 /music/secret.m4a";
      }
      return;
    }

    secretHint.textContent = "密码不对哦笨蛋蛋宝";
    secretMessage.classList.add("hidden");
  };

  secretBtn.addEventListener("click", () => {
    void onUnlock();
  });

  secretInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      void onUnlock();
    }
  });
}

function spawnNote(text) {
  const note = document.createElement("div");
  note.className = "note-item";
  note.textContent = text;
  note.style.left = `${Math.random() * 82 + 4}%`;
  note.style.animationDuration = `${Math.random() * 1.8 + 3.2}s`;
  note.style.transform = `rotate(${Math.random() * 16 - 8}deg)`;

  noteRainLayer.appendChild(note);
  setTimeout(() => {
    note.remove();
  }, 5500);
}

function startNoteRain() {
  let launched = 0;
  const total = 18;
  const timer = setInterval(() => {
    const text = noteTexts[Math.floor(Math.random() * noteTexts.length)];
    spawnNote(text);
    launched += 1;
    if (launched >= total) {
      clearInterval(timer);
    }
  }, 160);
}

function initNoteRain() {
  noteRainBtn.addEventListener("click", startNoteRain);
}

async function loadData() {
  const response = await fetch("/api/valentine");
  const data = await response.json();

  titleEl.textContent = data.title;
  subtitleEl.textContent = `给 ${data.girlfriendName}`;
  typeWriter(data.loveLetter);
  renderGallery(data.photos ?? []);

  daysEl.textContent = String(calculateDaysTogether(normalizeDate(data.relationshipStartDate)));
  returnCountdownEl.textContent = String(calculateCountdownDays("2026-02-19T00:00:00"));
  surpriseText.textContent = data.surpriseMessage;
  signatureEl.textContent = data.signature;
  secretMusicUrl = typeof data.secretMusicUrl === "string" ? data.secretMusicUrl : "";

  if (data.musicUrl) {
    bgm.src = data.musicUrl;
    bgm.autoplay = true;
    bgm.playsInline = true;

    const started = await tryPlayBgm();
    if (!started) {
      registerFirstInteractionPlay();
    }
  }
}

loadData().catch(() => {
  titleEl.textContent = "加载失败";
  subtitleEl.textContent = "请确认后端接口正常运行";
});

initSecretUnlock();
initNoteRain();

galleryEl.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLImageElement)) {
    return;
  }

  openImageModal(target.src, target.alt);
});

imageModal.addEventListener("click", (event) => {
  if (event.target === imageModal) {
    closeImageModal();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !imageModal.classList.contains("hidden")) {
    closeImageModal();
  }
});
