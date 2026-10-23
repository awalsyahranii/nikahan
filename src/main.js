/**
 * SORA BOTANICA - DIGITAL WEDDING INVITATION LOGIC
 * Baso & Indah | 13 Desember 2026
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. GUEST NAME FROM URL PARAMETER (?to=...)
  initGuestName();

  // 2. COVER & AUDIO INITIALIZATION
  initCoverAndMusic();

  // 3. COUNTDOWN TIMER
  initCountdown();


  // 5. GALLERY LIGHTBOX
  initGalleryLightbox();

  // 6. COPY ACCOUNT NUMBER & TOASTS
  initCopyAccount();

  // 7. CALENDAR INTEGRATION
  initCalendar();

  // 8. RSVP & WISHES WITH STICKERS
  initWishesAndRSVP();

  // 9. BOTANICAL LEAF CANVAS PARTICLES
  initLeafCanvas();

  // 10. NAVIGATION SMOOTH SCROLL & ACTIVE SPY
  initNavigation();
});

/* ==========================================================================
   1. GUEST NAME PARSER
   ========================================================================== */
function initGuestName() {
  const urlParams = new URLSearchParams(window.location.search);
  const guestParam = urlParams.get('to') || urlParams.get('u') || urlParams.get('nama');
  
  if (guestParam) {
    const formattedGuest = decodeURIComponent(guestParam).replace(/\+/g, ' ');
    const guestDisplay = document.getElementById('guest-name-display');
    const leftGuestDisplay = document.getElementById('left-guest-display');
    
    if (guestDisplay) guestDisplay.textContent = formattedGuest;
    if (leftGuestDisplay) leftGuestDisplay.textContent = formattedGuest;
    
    // Also prefill name in the RSVP form
    const nameInput = document.getElementById('input-name');
    if (nameInput) nameInput.value = formattedGuest;
  }
}

/* ==========================================================================
   2. COVER OPENING & MUSIC PLAYER (iOS & Android Universal)
   ========================================================================== */
function initCoverAndMusic() {
  const coverOverlay = document.getElementById('cover-overlay');
  const btnOpen = document.getElementById('btn-open-invitation');
  const musicBtn = document.getElementById('music-btn');

  let isPlaying = false;

  function getActiveAudio() {
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
    const audioAndroid = document.getElementById("musikAndroid");
    const audioIOS = document.getElementById("musikiPhone");
    const fallback = document.getElementById("wedding-audio");
    return (isIOS ? audioIOS : audioAndroid) || fallback;
  }

  // lagu
  function startAudio() {
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

    const audioAndroid = document.getElementById("musikAndroid");
    const audioIOS = document.getElementById("musikiPhone");

    if (isIOS) {
      if (audioIOS) {
        audioIOS.muted = false;
        audioIOS.play().then(() => {
          isPlaying = true;
          if (musicBtn) {
            musicBtn.classList.remove('paused');
            musicBtn.classList.add('rotating');
          }
        }).catch(() => {});
      }
    } else {
      if (audioAndroid) {
        audioAndroid.muted = false;
        audioAndroid.play().then(() => {
          isPlaying = true;
          if (musicBtn) {
            musicBtn.classList.remove('paused');
            musicBtn.classList.add('rotating');
          }
        }).catch(() => {});
      }
    }

    document.removeEventListener("touchstart", startAudio);
    document.removeEventListener("click", startAudio);
    document.removeEventListener("scroll", startAudio);
  }

  document.addEventListener("touchstart", startAudio, { once: true });
  document.addEventListener("click", startAudio, { once: true });
  document.addEventListener("scroll", startAudio, { once: true });

  const pauseAudio = () => {
    const active = getActiveAudio();
    if (active) {
      active.pause();
    }
    isPlaying = false;
    if (musicBtn) {
      musicBtn.classList.add('paused');
      musicBtn.classList.remove('rotating');
    }
  };

  if (btnOpen && coverOverlay) {
    btnOpen.addEventListener('click', () => {
      coverOverlay.classList.add('opened');
      startAudio();
    });
  }

  if (musicBtn) {
    musicBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (isPlaying) {
        pauseAudio();
        showToast('Musik dijeda');
      } else {
        startAudio();
        showToast('Musik diputar 🎵');
      }
    });
  }
}

/* ==========================================================================
   3. COUNTDOWN TIMER
   ========================================================================== */
function initCountdown() {
  // Target: 13 Desember 2026, 09:00:00 WITA (GMT+8)
  const targetDate = new Date('2026-12-13T09:00:00+08:00').getTime();

  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');

  if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

  function update() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance <= 0) {
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minutesEl.textContent = '00';
      secondsEl.textContent = '00';
      return;
    }

    const d = Math.floor(distance / (1000 * 60 * 60 * 24));
    const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((distance % (1000 * 60)) / 1000);

    daysEl.textContent = String(d).padStart(2, '0');
    hoursEl.textContent = String(h).padStart(2, '0');
    minutesEl.textContent = String(m).padStart(2, '0');
    secondsEl.textContent = String(s).padStart(2, '0');
  }

  update();
  setInterval(update, 1000);
}


/* ==========================================================================
   5. GALLERY LIGHTBOX
   ========================================================================== */
function initGalleryLightbox() {
  const bentoItems = document.querySelectorAll('.bento-item');
  const modal = document.getElementById('lightbox-modal');
  const modalImg = document.getElementById('lightbox-image');
  const btnClose = document.getElementById('lightbox-close');
  const btnPrev = document.getElementById('lightbox-prev');
  const btnNext = document.getElementById('lightbox-next');

  if (!modal || !modalImg) return;

  const images = Array.from(bentoItems).map(item => {
    const img = item.querySelector('img');
    return img ? img.src : '';
  });

  let currentIndex = 0;

  function openImage(index) {
    currentIndex = index;
    modalImg.src = images[currentIndex];
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeImage() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % images.length;
    modalImg.src = images[currentIndex];
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    modalImg.src = images[currentIndex];
  }

  bentoItems.forEach((item, idx) => {
    item.addEventListener('click', () => openImage(idx));
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openImage(idx);
      }
    });
  });

  if (btnClose) btnClose.addEventListener('click', closeImage);
  if (btnNext) btnNext.addEventListener('click', showNext);
  if (btnPrev) btnPrev.addEventListener('click', showPrev);

  modal.addEventListener('click', (e) => {
    if (e.target.classList.contains('lightbox-backdrop')) {
      closeImage();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('active')) return;
    if (e.key === 'Escape') closeImage();
    if (e.key === 'ArrowRight') showNext();
    if (e.key === 'ArrowLeft') showPrev();
  });
}

/* ==========================================================================
   6. COPY ACCOUNT NUMBER & TOASTS
   ========================================================================== */
function initCopyAccount() {
  const btnCopy = document.getElementById('btn-copy-bca');
  const accNumber = document.getElementById('bca-number');

  if (btnCopy && accNumber) {
    btnCopy.addEventListener('click', () => {
      const textToCopy = accNumber.textContent.trim();
      navigator.clipboard.writeText(textToCopy).then(() => {
        showToast('Nomor rekening BCA berhasil disalin!');
      }).catch(() => {
        showToast(`No. Rekening: ${textToCopy}`);
      });
    });
  }
}

function showToast(message) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

/* ==========================================================================
   7. CALENDAR INTEGRATION
   ========================================================================== */
function initCalendar() {
  const calendarButtons = document.querySelectorAll('.btn-calendar');
  calendarButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const title = encodeURIComponent(btn.getAttribute('data-title') || 'Pernikahan Baso & Indah');
      const location = encodeURIComponent(btn.getAttribute('data-location') || 'Sinjai');
      const details = encodeURIComponent('Pernikahan Baso Salahuddin, S.Pd & Haslinda, S.Pd (Indah). Merupakan suatu kehormatan atas kehadiran Anda.');
      
      // Google Calendar format: YYYYMMDDTHHMMSSZ (UTC or local)
      // Akad: 2026-12-13 09:00 WITA (01:00 UTC) - 12:00 WITA (04:00 UTC)
      const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=20261213T010000Z/20261213T040000Z&details=${details}&location=${location}`;
      window.open(gcalUrl, '_blank');
      showToast('Membuka Google Calendar...');
    });
  });
}

/* ==========================================================================
   8. RSVP & WISHES DENGAN INTEGRASI GOOGLE SHEETS & STIKER REAKSI
   ========================================================================== */

// Masukkan URL Google Apps Script Web App Anda di bawah ini:
// (Contoh: 'https://script.google.com/macros/s/AKfycbx.../exec')
// Jika belum diisi, data RSVP & ucapan tetap tersimpan otomatis di LocalStorage browser.
const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbzZ6BoZ29bj15V3MHNkeOIjSt0UR-Lr6SCVBn84pNpwft2g9kwBPRPkscpPzCHoGotp5w/exec';

function initWishesAndRSVP() {
  const form = document.getElementById('rsvp-wishes-form');
  const stickerPicker = document.getElementById('sticker-picker');
  const wishesList = document.getElementById('wishes-list');
  const wishesCountEl = document.getElementById('wishes-count');
  const attendingCountEl = document.getElementById('attending-count');

  if (!form || !wishesList) return;

  let selectedStickerUrl = '';
  let selectedStickerName = 'Tanpa Stiker (Polos)';

  // Sticker Picker click handler
  if (stickerPicker) {
    const stickerButtons = stickerPicker.querySelectorAll('.sticker-option');
    stickerButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        stickerButtons.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        selectedStickerUrl = btn.getAttribute('data-sticker') || '';
        selectedStickerName = btn.getAttribute('data-sticker-name') || btn.getAttribute('title') || 'Tanpa Stiker (Polos)';
      });
    });
  }

  // Initial Sample Wishes if empty (Disesuaikan dengan Mempelai Baso & Indah)
  const defaultWishes = [
    {
      name: "Budi Santoso & Keluarga",
      attendance: "Hadir",
      pax: "2 Orang",
      message: "Barakallahu lakuma wa baraka 'alaikuma wa jama'a bainakuma fii khoir. Selamat menempuh hidup baru Baso dan Indah, semoga menjadi keluarga sakinah, mawaddah, warahmah!",
      sticker: "./stickers/quby-cheering-2590833d.gif",
      stickerName: "Quby Cheering",
      time: "10 menit yang lalu"
    },
    {
      name: "Siti Rahmawati",
      attendance: "Hadir",
      pax: "1 Orang",
      message: "MasyaAllah Indah cantik banget! Selamat yaa lancar sampai hari H nanti, can't wait to see you both on your special day! ❤️",
      sticker: "./stickers/dancing-celebration-86cd222f.gif",
      stickerName: "Dancing",
      time: "1 jam yang lalu"
    },
    {
      name: "Randy & Partner",
      attendance: "Hadir",
      pax: "2 Orang",
      message: "Congrats bro Baso! Akhirnya berlabuh ke pelaminan. Semoga langgeng bahagia dunia akhirat. Aamiin!",
      sticker: "./stickers/cheers.png",
      stickerName: "Cheers",
      time: "3 jam yang lalu"
    }
  ];

  // Load from LocalStorage
  let storedWishes = [];
  try {
    const raw = localStorage.getItem('sora_botanica_wishes');
    if (raw) {
      storedWishes = JSON.parse(raw);
      // Auto-normalize any legacy sticker paths from /stickers to ./stickers
      storedWishes.forEach(w => {
        if (w.sticker && w.sticker.startsWith('/stickers/')) {
          w.sticker = '.' + w.sticker;
        }
      });
    } else {
      storedWishes = defaultWishes;
      localStorage.setItem('sora_botanica_wishes', JSON.stringify(storedWishes));
    }
  } catch (e) {
    storedWishes = defaultWishes;
  }

  function renderWishes() {
    wishesList.innerHTML = '';

    // Hitung total ucapan dan total tamu yang konfirmasi hadir
    let totalAttendingGuests = 0;
    storedWishes.forEach(item => {
      const isAttending = item.attendance === 'Hadir' || 
        (item.attendance && item.attendance.toLowerCase().includes('hadir') && !item.attendance.toLowerCase().includes('tidak'));
      
      if (isAttending) {
        const paxStr = String(item.pax || '1 Orang').toLowerCase();
        if (paxStr.includes('rombongan') || paxStr.includes('>4') || paxStr.includes('5')) {
          totalAttendingGuests += 5; // Estimasi minimal tamu rombongan
        } else {
          const num = parseInt(paxStr, 10);
          totalAttendingGuests += isNaN(num) ? 1 : num;
        }
      }
    });

    if (wishesCountEl) wishesCountEl.textContent = `${storedWishes.length} Ucapan`;
    if (attendingCountEl) attendingCountEl.textContent = `${totalAttendingGuests} Tamu Hadir`;

    storedWishes.forEach(item => {
      const wishEl = document.createElement('div');
      wishEl.className = 'wish-item';

      let attendanceClass = 'hadir';
      let icon = '✓';
      if (item.attendance === 'Tidak Hadir') {
        attendanceClass = 'tidak-hadir';
        icon = '✕';
      } else if (item.attendance === 'Masih Ragu') {
        attendanceClass = 'ragu';
        icon = '?';
      }

      // Tampilkan jumlah tamu jika hadir
      let paxText = '';
      if (item.attendance === 'Hadir' || (item.attendance && !item.attendance.toLowerCase().includes('tidak') && !item.attendance.toLowerCase().includes('ragu'))) {
        paxText = ` (${escapeHtml(item.pax || '1 Orang')})`;
      }

      let stickerHtml = '';
      if (item.sticker) {
        stickerHtml = `<div class="wish-sticker"><img src="${item.sticker}" alt="${escapeHtml(item.stickerName || 'Stiker')}" loading="lazy"></div>`;
      }

      wishEl.innerHTML = `
        <div class="wish-header">
          <span class="wish-name">${escapeHtml(item.name)}</span>
          <span class="wish-attendance ${attendanceClass}">${icon} ${escapeHtml(item.attendance || 'Hadir')}${paxText}</span>
        </div>
        <div class="wish-body">
          ${stickerHtml}
          <p class="wish-text">${escapeHtml(item.message)}</p>
        </div>
        <div class="wish-time">${item.time || 'Baru saja'}</div>
      `;

      wishesList.appendChild(wishEl);
    });
  }

  renderWishes();

  // Jika URL Google Sheet sudah diisi, ambil data ucapan terbaru secara live
  if (GOOGLE_SHEET_URL && GOOGLE_SHEET_URL.trim() !== '') {
    fetch(GOOGLE_SHEET_URL)
      .then(res => res.json())
      .then(result => {
        if (result && result.status === 'success' && Array.isArray(result.data) && result.data.length > 0) {
          storedWishes = result.data;
          try {
            localStorage.setItem('sora_botanica_wishes', JSON.stringify(storedWishes));
          } catch (err) {}
          renderWishes();
        }
      })
      .catch(err => {
        console.info('Menggunakan data ucapan cache lokal:', err);
      });
  }

  // Form Submit Handler
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('input-name');
    const attendanceSelect = document.getElementById('select-attendance');
    const paxSelect = document.getElementById('select-pax');
    const messageInput = document.getElementById('input-message');
    const submitBtn = form.querySelector('.btn-submit-wish');

    const rawName = nameInput.value.trim();
    const rawAttendance = attendanceSelect.value;
    const rawPax = paxSelect.value;
    const rawMessage = messageInput.value.trim();

    if (!rawName || !rawMessage) {
      return;
    }

    // Format timestamp waktu Indonesia Tengah (WITA)
    const now = new Date();
    const formattedTimestamp = now.toLocaleString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }) + ' WITA';

    const newWish = {
      name: rawName,
      attendance: rawAttendance,
      pax: rawPax,
      message: rawMessage,
      sticker: selectedStickerUrl,
      stickerName: selectedStickerName || 'Tanpa Stiker (Polos)',
      time: 'Baru saja'
    };

    // Ubah tampilan tombol ke state loading (hanya menampilkan 'Mengirim...')
    let originalBtnHtml = '';
    if (submitBtn) {
      originalBtnHtml = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="spinner-icon"></span><span>Mengirim...</span>';
    }

    // 1. Kirim data ke Google Sheets Web App di latar belakang
    if (GOOGLE_SHEET_URL && GOOGLE_SHEET_URL.trim() !== '') {
      try {
        const formData = new FormData();
        formData.append('timestamp', formattedTimestamp);
        formData.append('name', rawName);
        formData.append('attendance', rawAttendance);
        formData.append('pax', rawPax);
        formData.append('sticker', selectedStickerUrl);
        formData.append('stickerName', selectedStickerName);
        formData.append('message', rawMessage);

        await fetch(GOOGLE_SHEET_URL, {
          method: 'POST',
          mode: 'no-cors',
          body: formData
        });
      } catch (sheetErr) {
        console.warn('Gagal sinkronisasi Google Sheet:', sheetErr);
      }
    }

    // 2. Simpan juga ke cache lokal (optimistic UI update langsung tampil)
    storedWishes.unshift(newWish);
    try {
      localStorage.setItem('sora_botanica_wishes', JSON.stringify(storedWishes));
    } catch (err) {}

    // 3. Render ulang list ucapan & bersihkan form
    renderWishes();
    messageInput.value = '';

    // Kembalikan pilihan stiker ke default polos
    if (stickerPicker) {
      const stickerButtons = stickerPicker.querySelectorAll('.sticker-option');
      stickerButtons.forEach(b => b.classList.remove('selected'));
      const defaultSticker = stickerPicker.querySelector('.sticker-option[data-sticker=""]');
      if (defaultSticker) defaultSticker.classList.add('selected');
      selectedStickerUrl = '';
      selectedStickerName = 'Tanpa Stiker (Polos)';
    }

    // Kembalikan tombol submit ke state semula
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnHtml;
    }

    // Scroll otomatis ke daftar ucapan terbaru
    wishesList.scrollTop = 0;
  });
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/* ==========================================================================
   9. BOTANICAL LEAF CANVAS PARTICLES
   ========================================================================== */
function initLeafCanvas() {
  const canvas = document.getElementById('leaf-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const leafCount = 10;
  const leaves = [];

  const colors = [
    'rgba(197, 160, 89, 0.28)', // Antique Gold
    'rgba(61, 110, 150, 0.22)', // Soft Slate Navy
    'rgba(26, 54, 93, 0.25)',   // Deep Regal Navy
    'rgba(235, 217, 180, 0.30)' // Soft Champagne Gold
  ];

  for (let i = 0; i < leafCount; i++) {
    leaves.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 8 + 6,
      speedX: Math.random() * 1 - 0.5,
      speedY: Math.random() * 1 + 0.6,
      angle: Math.random() * 360,
      spin: Math.random() * 0.03 - 0.015,
      color: colors[Math.floor(Math.random() * colors.length)],
      oscillation: Math.random() * Math.PI * 2
    });
  }

  function drawLeaf(ctx, x, y, size, angle, color) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(0, -size);
    ctx.quadraticCurveTo(size * 0.7, 0, 0, size);
    ctx.quadraticCurveTo(-size * 0.7, 0, 0, -size);
    ctx.fill();
    ctx.restore();
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    leaves.forEach(leaf => {
      leaf.oscillation += 0.02;
      leaf.x += leaf.speedX + Math.sin(leaf.oscillation) * 0.8;
      leaf.y += leaf.speedY;
      leaf.angle += leaf.spin;

      if (leaf.y > height + 20) {
        leaf.y = -20;
        leaf.x = Math.random() * width;
      }
      if (leaf.x > width + 20) leaf.x = -20;
      if (leaf.x < -20) leaf.x = width + 20;

      drawLeaf(ctx, leaf.x, leaf.y, leaf.size, leaf.angle, leaf.color);
    });

    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   10. NAVIGATION SMOOTH SCROLL & ACTIVE SPY
   ========================================================================== */
function initNavigation() {
  const navItems = document.querySelectorAll('.nav-item');
  const sections = document.querySelectorAll('.inv-section');

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const targetId = item.getAttribute('data-target');
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ScrollSpy
  window.addEventListener('scroll', () => {
    let currentId = '';
    const scrollPos = window.scrollY + 250;

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = sec.id;
      }
    });

    if (currentId) {
      navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-target') === currentId) {
          item.classList.add('active');
        }
      });
    }
  }, { passive: true });
}
