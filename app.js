/* ==========================================================================
   HARI GURU NASIONAL 2026 — LIGHTWEIGHT INTERACTIVE ENGINE
   Pure Vanilla JS • YouTube IFrame API (1dFJZvr4pA8) • Mobile-First
   ========================================================================== */

(() => {
  "use strict";

  const YOUTUBE_VIDEO_ID = "1dFJZvr4pA8";
  const STORAGE_BLOOMS_KEY = "hariguru2026_blooms_v1";
  const STORAGE_WISHES_KEY = "hariguru2026_wishes_v2";

  const DEFAULT_WISHES = [
    {
      name: "Ridho Dzaky Raihan",
      message:
        "Selamat Hari Guru Nasional! Terima kasih atas segala ilmu, kesabaran, dan kasih sayang yang selalu menguatkan langkah kami. Semoga selalu sehat dan bahagia.",
      time: "25 Nov 2026",
    },
    {
      name: "Doa untuk Dua Guru Hebat",
      message:
        "Bangga sekali memiliki dua sosok guru hebat yang penuh ketulusan. Semoga setiap ilmu yang diajarkan menjadi amal jariyah yang mengalir tanpa henti.",
      time: "25 Nov 2026",
    },
    {
      name: "Untuk Pelita Ilmu",
      message:
        "Seperti lirik Guruku Tersayang — tanpamu apa jadinya kami. Terima kasih telah mendidik dengan hati yang lapang dan senyum yang meneduhkan.",
      time: "25 Nov 2026",
    },
  ];

  // DOM References
  const coverOverlay = document.getElementById("coverOverlay");
  const openCardBtn = document.getElementById("openCardBtn");
  const openSilentBtn = document.getElementById("openSilentBtn");
  const scrollProgress = document.getElementById("scrollProgress");
  const ambientPetals = document.getElementById("ambientPetals");

  // Music Player DOM
  const musicPill = document.querySelector(".music-pill");
  const musicPlayBtn = document.getElementById("musicPlayBtn");
  const musicMuteBtn = document.getElementById("musicMuteBtn");
  const musicVideoToggleBtn = document.getElementById("musicVideoToggleBtn");
  const footerPlayBtn = document.getElementById("footerPlayBtn");
  const musicStatus = document.getElementById("musicStatus");
  const ytDrawer = document.getElementById("ytDrawer");
  const ytDrawerClose = document.getElementById("ytDrawerClose");

  // Lightbox DOM
  const galleryCards = Array.from(document.querySelectorAll(".polaroid-card"));
  const lightbox = document.getElementById("lightbox");
  const lightboxBackdrop = document.getElementById("lightboxBackdrop");
  const lightboxClose = document.getElementById("lightboxClose");
  const lightboxPrev = document.getElementById("lightboxPrev");
  const lightboxNext = document.getElementById("lightboxNext");
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxTitle = document.getElementById("lightboxTitle");
  const lightboxCaption = document.getElementById("lightboxCaption");
  const lightboxCounter = document.getElementById("lightboxCounter");
  const lightboxStage = document.getElementById("lightboxStage");

  // Bloom & Wish Wall DOM
  const sendBloomBtn = document.getElementById("sendBloomBtn");
  const bloomCountEl = document.getElementById("bloomCount");
  const bloomToast = document.getElementById("bloomToast");
  const wishForm = document.getElementById("wishForm");
  const senderNameInput = document.getElementById("senderName");
  const wishMessageInput = document.getElementById("wishMessage");
  const wishWall = document.getElementById("wishWall");
  const confettiCanvas = document.getElementById("confettiCanvas");

  // =========================================================================
  // 1. YOUTUBE IFRAME PLAYER API (Guruku Tersayang)
  // =========================================================================
  let ytPlayer = null;
  let ytReady = false;
  let pendingPlay = false;
  let isPlaying = false;
  let isMuted = false;

  function updateMusicUI() {
    if (!musicPill) return;
    musicPill.classList.toggle("is-playing", isPlaying);
    musicPill.classList.toggle("is-muted", isMuted);
    musicPlayBtn?.setAttribute("aria-pressed", String(isPlaying));

    if (musicStatus) {
      if (isPlaying && isMuted) {
        musicStatus.textContent = "Diputar (bisu)";
      } else if (isPlaying) {
        musicStatus.textContent = "Sedang diputar";
      } else if (pendingPlay) {
        musicStatus.textContent = "Memuat lagu...";
      } else {
        musicStatus.textContent = "Dijeda — ketuk putar";
      }
    }

    if (footerPlayBtn) {
      footerPlayBtn.textContent = isPlaying ? "Jeda Lagu" : "Putar Lagu";
    }
  }

  function loadYouTubeAPI() {
    if (window.YT && window.YT.Player) {
      initYouTubePlayer();
      return;
    }
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    tag.async = true;
    document.head.appendChild(tag);
  }

  function initYouTubePlayer() {
    if (ytPlayer) return;
    ytPlayer = new window.YT.Player("ytPlayer", {
      videoId: YOUTUBE_VIDEO_ID,
      playerVars: {
        autoplay: 0,
        controls: 1,
        loop: 1,
        playlist: YOUTUBE_VIDEO_ID,
        modestbranding: 1,
        rel: 0,
        playsinline: 1,
      },
      events: {
        onReady: () => {
          ytReady = true;
          try {
            ytPlayer.setVolume(80);
          } catch (_) {}
          if (pendingPlay) {
            pendingPlay = false;
            playMusic();
          }
        },
        onStateChange: (event) => {
          const state = event.data;
          if (state === window.YT.PlayerState.PLAYING) {
            isPlaying = true;
            pendingPlay = false;
          } else if (
            state === window.YT.PlayerState.PAUSED ||
            state === window.YT.PlayerState.ENDED
          ) {
            isPlaying = false;
          } else if (state === window.YT.PlayerState.BUFFERING) {
            if (musicStatus) musicStatus.textContent = "Memuat lagu...";
          }
          updateMusicUI();
        },
        onError: () => {
          isPlaying = false;
          pendingPlay = false;
          if (musicStatus) musicStatus.textContent = "Buka lewat ikon video";
          updateMusicUI();
        },
      },
    });
  }

  window.onYouTubeIframeAPIReady = initYouTubePlayer;

  function playMusic() {
    if (!ytReady || !ytPlayer) {
      pendingPlay = true;
      updateMusicUI();
      return;
    }
    try {
      ytPlayer.unMute();
      isMuted = false;
      ytPlayer.playVideo();
      isPlaying = true;
      updateMusicUI();
    } catch (_) {
      isPlaying = false;
      updateMusicUI();
    }
  }

  function togglePlayMusic() {
    if (!ytReady || !ytPlayer) {
      pendingPlay = !pendingPlay;
      updateMusicUI();
      return;
    }
    if (isPlaying) {
      ytPlayer.pauseVideo();
      isPlaying = false;
    } else {
      ytPlayer.playVideo();
      isPlaying = true;
    }
    updateMusicUI();
  }

  function toggleMuteMusic() {
    if (!ytReady || !ytPlayer) return;
    if (isMuted) {
      ytPlayer.unMute();
      isMuted = false;
    } else {
      ytPlayer.mute();
      isMuted = true;
    }
    updateMusicUI();
  }

  function toggleVideoDrawer(forceState) {
    if (!ytDrawer) return;
    const nextState =
      typeof forceState === "boolean" ? forceState : !ytDrawer.classList.contains("is-open");
    ytDrawer.classList.toggle("is-open", nextState);
    ytDrawer.setAttribute("aria-hidden", String(!nextState));
  }

  musicPlayBtn?.addEventListener("click", togglePlayMusic);
  footerPlayBtn?.addEventListener("click", togglePlayMusic);
  musicMuteBtn?.addEventListener("click", toggleMuteMusic);
  musicVideoToggleBtn?.addEventListener("click", () => toggleVideoDrawer());
  ytDrawerClose?.addEventListener("click", () => toggleVideoDrawer(false));

  // Preload YouTube API immediately so it's ready by the time user clicks open
  loadYouTubeAPI();

  // =========================================================================
  // 2. WELCOME ENVELOPE OPENING
  // =========================================================================
  function openLandingPage(withMusic) {
    if (!coverOverlay) return;
    coverOverlay.classList.add("is-opening");

    if (withMusic) {
      playMusic();
    } else if (musicStatus) {
      musicStatus.textContent = "Ketuk putar kapan saja";
    }

    window.setTimeout(() => {
      coverOverlay.classList.add("is-hidden");
      document.body.classList.remove("cover-locked");
      triggerScrollRevealCheck();
      launchConfetti(window.innerWidth / 2, window.innerHeight * 0.35, 28);
    }, 450);
  }

  openCardBtn?.addEventListener("click", () => openLandingPage(true));
  openSilentBtn?.addEventListener("click", () => openLandingPage(false));

  // =========================================================================
  // 3. READING PROGRESS BAR & LIGHTWEIGHT AMBIENT PETALS
  // =========================================================================
  function updateScrollProgress() {
    if (!scrollProgress) return;
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0;
    scrollProgress.style.width = `${pct}%`;
  }

  window.addEventListener("scroll", updateScrollProgress, { passive: true });

  function spawnAmbientPetals() {
    if (!ambientPetals) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const count = window.innerWidth < 640 ? 7 : 13;
    const frag = document.createDocumentFragment();
    for (let i = 0; i < count; i++) {
      const petal = document.createElement("span");
      petal.className = "petal";
      petal.style.left = `${Math.random() * 100}%`;
      petal.style.animationDuration = `${11 + Math.random() * 9}s`;
      petal.style.animationDelay = `${Math.random() * 10}s`;
      petal.style.setProperty("--drift", `${(Math.random() - 0.5) * 90}px`);
      const scale = 0.7 + Math.random() * 0.7;
      petal.style.transform = `scale(${scale})`;
      frag.appendChild(petal);
    }
    ambientPetals.appendChild(frag);
  }

  spawnAmbientPetals();

  // =========================================================================
  // 4. SCROLL REVEAL (INTERSECTION OBSERVER)
  // =========================================================================
  const revealElements = Array.from(document.querySelectorAll(".reveal"));
  let revealObserver = null;

  function triggerScrollRevealCheck() {
    if (!("IntersectionObserver" in window)) {
      revealElements.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    if (!revealObserver) {
      revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              revealObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -30px 0px" }
      );
      revealElements.forEach((el) => revealObserver.observe(el));
    }
  }

  triggerScrollRevealCheck();

  // =========================================================================
  // 5. POLAROID GALLERY LIGHTBOX (TOUCH SWIPE + KEYBOARD)
  // =========================================================================
  let currentPhotoIndex = 0;
  let touchStartX = 0;

  function renderLightboxPhoto(index) {
    const total = galleryCards.length;
    if (!total) return;
    currentPhotoIndex = (index + total) % total;
    const card = galleryCards[currentPhotoIndex];

    if (lightboxImg) {
      lightboxImg.src = card.dataset.src || "";
      lightboxImg.alt = card.dataset.title || "Foto Kenangan Hari Guru";
    }
    if (lightboxTitle) lightboxTitle.textContent = card.dataset.title || "";
    if (lightboxCaption) lightboxCaption.textContent = card.dataset.caption || "";
    if (lightboxCounter) lightboxCounter.textContent = `${currentPhotoIndex + 1} / ${total}`;
  }

  function openLightbox(index) {
    renderLightboxPhoto(index);
    lightbox?.classList.add("is-open");
    lightbox?.setAttribute("aria-hidden", "false");
    document.body.classList.add("lightbox-open");
    lightboxClose?.focus();
  }

  function closeLightbox() {
    lightbox?.classList.remove("is-open");
    lightbox?.setAttribute("aria-hidden", "true");
    document.body.classList.remove("lightbox-open");
  }

  galleryCards.forEach((card, idx) => {
    card.addEventListener("click", () => openLightbox(idx));
  });

  lightboxClose?.addEventListener("click", closeLightbox);
  lightboxBackdrop?.addEventListener("click", closeLightbox);
  lightboxPrev?.addEventListener("click", () => renderLightboxPhoto(currentPhotoIndex - 1));
  lightboxNext?.addEventListener("click", () => renderLightboxPhoto(currentPhotoIndex + 1));

  document.addEventListener("keydown", (e) => {
    if (!lightbox?.classList.contains("is-open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") renderLightboxPhoto(currentPhotoIndex - 1);
    if (e.key === "ArrowRight") renderLightboxPhoto(currentPhotoIndex + 1);
  });

  lightboxStage?.addEventListener(
    "touchstart",
    (e) => {
      touchStartX = e.changedTouches[0].clientX;
    },
    { passive: true }
  );

  lightboxStage?.addEventListener(
    "touchend",
    (e) => {
      const diff = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(diff) > 45) {
        renderLightboxPhoto(currentPhotoIndex + (diff < 0 ? 1 : -1));
      }
    },
    { passive: true }
  );

  // =========================================================================
  // 6. INTERACTIVE BLOOM COUNTER & LIGHTWEIGHT CANVAS CONFETTI
  // =========================================================================
  let bloomCount = 25;
  try {
    const savedCount = parseInt(localStorage.getItem(STORAGE_BLOOMS_KEY) || "", 10);
    if (!Number.isNaN(savedCount) && savedCount >= 25) bloomCount = savedCount;
  } catch (_) {}

  if (bloomCountEl) bloomCountEl.textContent = String(bloomCount);

  const BLOOM_MESSAGES = [
    "Doa & bunga terkirim! Semoga kedua guru selalu diberi kesehatan.",
    "Terima kasih atas apresiasinya — semoga kebaikan ini berbalas berlipat.",
    "Bunga kebahagiaan terkirim untuk dua pelita ilmu tercinta!",
    "Satu lagi doa tulus terangkai di Hari Guru Nasional 2026.",
  ];

  // Lightweight self-stopping Canvas Confetti
  const particles = [];
  let confettiAnimId = null;

  function resizeConfettiCanvas() {
    if (!confettiCanvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    confettiCanvas.width = window.innerWidth * dpr;
    confettiCanvas.height = window.innerHeight * dpr;
    const ctx = confettiCanvas.getContext("2d");
    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  window.addEventListener("resize", resizeConfettiCanvas, { passive: true });
  resizeConfettiCanvas();

  function launchConfetti(originX, originY, amount = 34) {
    if (!confettiCanvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const colors = ["#D6AF62", "#B88A38", "#466952", "#B55D45", "#FAF6EE"];
    for (let i = 0; i < amount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2.5 + Math.random() * 5.5;
      particles.push({
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 3.5,
        size: 5 + Math.random() * 6,
        color: colors[i % colors.length],
        rot: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.2,
        alpha: 1,
      });
    }

    if (!confettiAnimId) {
      animateConfetti();
    }
  }

  function animateConfetti() {
    const ctx = confettiCanvas?.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.14;
      p.vx *= 0.99;
      p.rot += p.vRot;
      p.alpha -= 0.014;

      if (p.alpha <= 0 || p.y > window.innerHeight + 30) {
        particles.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.ellipse(0, 0, p.size * 0.7, p.size * 0.42, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    if (particles.length > 0) {
      confettiAnimId = window.requestAnimationFrame(animateConfetti);
    } else {
      confettiAnimId = null;
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    }
  }

  sendBloomBtn?.addEventListener("click", (e) => {
    bloomCount += 1;
    if (bloomCountEl) bloomCountEl.textContent = String(bloomCount);
    try {
      localStorage.setItem(STORAGE_BLOOMS_KEY, String(bloomCount));
    } catch (_) {}

    const rect = sendBloomBtn.getBoundingClientRect();
    const x = e.clientX || rect.left + rect.width / 2;
    const y = e.clientY || rect.top + rect.height / 2;
    launchConfetti(x, y, 36);

    if (bloomToast) {
      bloomToast.textContent = BLOOM_MESSAGES[bloomCount % BLOOM_MESSAGES.length];
    }
  });

  // =========================================================================
  // 7. WISH WALL (SAFE DOM RENDERING + LOCALSTORAGE)
  // =========================================================================
  function loadWishes() {
    try {
      const raw = localStorage.getItem(STORAGE_WISHES_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (_) {}
    return [...DEFAULT_WISHES];
  }

  function saveWishes(list) {
    try {
      localStorage.setItem(STORAGE_WISHES_KEY, JSON.stringify(list.slice(0, 24)));
    } catch (_) {}
  }

  function createWishCardElement(wish) {
    const card = document.createElement("article");
    card.className = "wish-card";

    const head = document.createElement("div");
    head.className = "wish-card-head";

    const author = document.createElement("span");
    author.className = "wish-card-author";
    author.textContent = wish.name;

    const time = document.createElement("span");
    time.className = "wish-card-time";
    time.textContent = wish.time;

    const body = document.createElement("p");
    body.className = "wish-card-body";
    body.textContent = wish.message;

    head.appendChild(author);
    head.appendChild(time);
    card.appendChild(head);
    card.appendChild(body);
    return card;
  }

  let wishes = loadWishes();

  function renderWishWall() {
    if (!wishWall) return;
    wishWall.innerHTML = "";
    const frag = document.createDocumentFragment();
    wishes.forEach((wish) => frag.appendChild(createWishCardElement(wish)));
    wishWall.appendChild(frag);
  }

  renderWishWall();

  wishForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = (senderNameInput?.value || "").trim();
    const message = (wishMessageInput?.value || "").trim();

    if (!name || !message) {
      if (!name) senderNameInput?.focus();
      else wishMessageInput?.focus();
      return;
    }

    const nowLabel = new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date());

    const newWish = { name, message, time: nowLabel };
    wishes.unshift(newWish);
    saveWishes(wishes);

    if (wishWall) {
      wishWall.prepend(createWishCardElement(newWish));
    }

    wishForm.reset();
    launchConfetti(window.innerWidth / 2, window.innerHeight * 0.55, 26);
  });

  // =========================================================================
  // 8. COPY POEM BUTTON (HANDY FOR WHATSAPP SHARING ON MOBILE)
  // =========================================================================
  document.querySelectorAll("[data-poem-copy]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const card = btn.closest(".poem-card");
      if (!card) return;
      const title = card.querySelector(".poem-title")?.textContent?.trim() || "";
      const stanzas = Array.from(card.querySelectorAll(".poem-body p")).map((p) =>
        p.innerText.trim()
      );
      const footer = card.querySelector(".poem-footer")?.textContent?.trim() || "";
      const fullText = `${title}\n\n${stanzas.join("\n\n")}\n\n${footer}`;

      try {
        await navigator.clipboard.writeText(fullText);
        btn.textContent = "Tersalin ✓";
        btn.classList.add("is-copied");
        window.setTimeout(() => {
          btn.textContent = "Salin";
          btn.classList.remove("is-copied");
        }, 2000);
      } catch (_) {
        btn.textContent = "Pilih teks";
      }
    });
  });
})();
