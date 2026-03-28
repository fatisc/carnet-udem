/* ============================================
   CARNET VIRTUAL - Universidad de Medellín
   Main Application Logic  v4
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
  registerSW();
  initNavigation();
  initCarousel();
  generateQR();
  initBarcode();
});

/* === Register Service Worker for offline support === */
function registerSW() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js');
  }
}

/* === Tab navigation === */
function initNavigation() {
  var btns = document.querySelectorAll('.nav-btn');
  var tabs = document.querySelectorAll('.tab-content');
  btns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      btns.forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');
      var target = btn.dataset.tab;
      tabs.forEach(function(t) {
        t.classList.remove('active');
        if (t.id === 'tab-' + target) t.classList.add('active');
      });
    });
  });
}

/* === Carousel with floating animation + timer === */
var TIMER_SECONDS = 30;
var timerInterval = null;
var currentSlide = 0;

function initCarousel() {
  var slides = document.querySelectorAll('.slide');
  var arrowL = document.getElementById('arrow-left');
  var arrowR = document.getElementById('arrow-right');
  var qrBtn = document.getElementById('qr-icon-btn');
  var qrWrap = document.querySelector('.qr-large-wrap');

  function go(idx) {
    if (idx < 0 || idx >= slides.length) return;
    var prev = slides[currentSlide];
    currentSlide = idx;
    var next = slides[currentSlide];

    // Animate out old slide
    prev.classList.remove('active', 'float-in');
    prev.classList.add('float-out');
    prev.style.display = 'flex';
    prev.style.position = 'absolute';

    // After animation, hide it
    setTimeout(function() {
      prev.style.display = '';
      prev.style.position = '';
      prev.classList.remove('float-out');
    }, 300);

    // Animate in new slide
    next.classList.add('active', 'float-in');

    // Timer logic
    updateTimer(currentSlide);
  }

  arrowL.addEventListener('click', function() {
    go(currentSlide === 0 ? slides.length - 1 : currentSlide - 1);
  });
  arrowR.addEventListener('click', function() {
    go(currentSlide === slides.length - 1 ? 0 : currentSlide + 1);
  });

  // QR icon → go to QR slide
  if (qrBtn) {
    qrBtn.addEventListener('click', function() { go(1); });
  }

  // Click on QR area → go back to photo
  if (qrWrap) {
    qrWrap.addEventListener('click', function() { go(0); });
  }

  // Touch swipe
  var startX = 0;
  var carousel = document.getElementById('carnet-carousel');
  carousel.addEventListener('touchstart', function(e) {
    startX = e.touches[0].clientX;
  }, { passive: true });
  carousel.addEventListener('touchend', function(e) {
    var diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      go(diff > 0 ? Math.min(currentSlide + 1, slides.length - 1) : Math.max(currentSlide - 1, 0));
    }
  }, { passive: true });

  updateTimer(0);
}

function updateTimer(slideIdx) {
  var fill = document.getElementById('timer-fill');
  if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }

  var bar = document.querySelector('.timer-bar');
  if (slideIdx === 0) {
    // Photo slide: hide bar completely
    bar.classList.remove('visible');
    fill.style.width = '0%';
    return;
  }
  bar.classList.add('visible');

  // QR slide: red bar counts down from 100% → 0%
  var elapsed = 0;
  var totalMs = TIMER_SECONDS * 1000;
  var step = 50;
  fill.style.width = '100%';

  timerInterval = setInterval(function() {
    elapsed += step;
    var pct = Math.max(0, 100 - (elapsed / totalMs * 100));
    fill.style.width = pct + '%';
    if (elapsed >= totalMs) {
      clearInterval(timerInterval);
      timerInterval = null;
      // Regenerate QR and go back to photo
      generateQR();
      // Trigger go(0) via arrow simulation
      var slides = document.querySelectorAll('.slide');
      var prev = slides[currentSlide];
      currentSlide = 0;
      prev.classList.remove('active', 'float-in');
      prev.style.display = 'none';
      slides[0].classList.add('active', 'float-in');
      fill.style.width = '0%';
    }
  }, step);
}

/* === QR Code (simple: just the student ID) === */
function generateQR() {
  if (typeof QRCode === 'undefined') return;

  var studentId = document.getElementById('student-id-number').textContent;

  QRCode.toDataURL(studentId, {
    width: 400,
    margin: 2,
    color: { dark: '#000000', light: '#ffffff' },
    errorCorrectionLevel: 'M'
  }).then(function(url) {
    var img = document.getElementById('qr-large');
    if (img) img.src = url;
  }).catch(function(err) {
    console.error('QR error:', err);
  });
}

/* === Barcode === */
function initBarcode() {
  var canvas = document.getElementById('barcode-canvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var id = document.getElementById('student-id-number').textContent;
  canvas.width = 300;
  canvas.height = 60;
  var bin = toBin(id);
  var w = canvas.width / bin.length;
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#000';
  for (var i = 0; i < bin.length; i++) {
    if (bin[i] === '1') ctx.fillRect(Math.floor(i * w), 0, Math.ceil(w), canvas.height);
  }
}

function toBin(id) {
  var b = '11010010100';
  for (var i = 0; i < id.length; i++) {
    var c = id.charCodeAt(i).toString(2);
    while (c.length < 8) c = '0' + c;
    b += c + '0';
  }
  return b + '11000101101';
}
