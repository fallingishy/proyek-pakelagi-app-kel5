// NAVIGASI
function goTo(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const target = document.getElementById(pageId);
  if (target) {
    target.classList.add('active');
    // Reset scroll
    target.scrollTop = 0;
    // Clear errors when navigating
    clearErrors();
  }
}

// ── TOGGLE PASSWORD VISIBILITY ──
function togglePass(inputId, btn) {
  const input = document.getElementById(inputId);
  if (!input) return;
  const isHidden = input.type === 'password';
  input.type = isHidden ? 'text' : 'password';
  btn.textContent = isHidden ? '🙈' : '👁';
}

// BANTUAN VALIDASI
function showError(fieldId, msg) {
  const errEl = document.getElementById(fieldId);
  if (errEl) errEl.textContent = msg;
  const inputId = fieldId.replace('err-', '');
  const inp = document.getElementById(inputId);
  if (inp) inp.classList.add('error');
}

function clearError(fieldId) {
  const errEl = document.getElementById(fieldId);
  if (errEl) errEl.textContent = '';
  const inputId = fieldId.replace('err-', '');
  const inp = document.getElementById(inputId);
  if (inp) inp.classList.remove('error');
}

function clearErrors() {
  document.querySelectorAll('.field-error').forEach(el => el.textContent = '');
  document.querySelectorAll('.form-input').forEach(el => el.classList.remove('error'));
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
  return /^0[0-9]{8,12}$/.test(phone.replace(/\s/g, ''));
}

function isStrongPassword(pass) {
  // Min 6 chars, 1 digit, 1 special char
  return pass.length >= 6 && /[0-9]/.test(pass) && /[^a-zA-Z0-9]/.test(pass);
}

// ── TOAST NOTIFICATION ──
let toastTimer;
function showToast(msg, duration = 3000) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), duration);
}

// STATUS LOADING
function setLoading(btn, loading) {
  if (loading) {
    btn.dataset.originalText = btn.textContent;
    btn.textContent = 'Memproses...';
    btn.disabled = true;
    btn.style.opacity = '0.7';
  } else {
    btn.textContent = btn.dataset.originalText || btn.textContent;
    btn.disabled = false;
    btn.style.opacity = '1';
  }
}

// PENANGANAN LOGIN
function handleLogin() {
  clearErrors();

  const email = document.getElementById('login-email')?.value.trim() || '';
  const pass = document.getElementById('login-pass')?.value || '';

  let hasError = false;

  if (!email) {
    showError('err-login-email', 'Email wajib diisi.');
    hasError = true;
  } else if (!isValidEmail(email)) {
    showError('err-login-email', 'Format email tidak valid.');
    hasError = true;
  }

  if (!pass) {
    showError('err-login-pass', 'Kata sandi wajib diisi.');
    hasError = true;
  } else if (pass.length < 6) {
    showError('err-login-pass', 'Kata sandi minimal 6 karakter.');
    hasError = true;
  }

  if (hasError) return;

  // SIMULASI LOGIN
  const btn = document.querySelector('#page-login .btn-primary');
  setLoading(btn, true);

  setTimeout(() => {
    setLoading(btn, false);
    document.getElementById('success-msg').textContent = `Selamat datang kembali! Anda berhasil masuk sebagai ${email}`;
    goTo('page-success');
    showToast('✓ Login berhasil!');
    // Reset form
    document.getElementById('login-email').value = '';
    document.getElementById('login-pass').value = '';
  }, 1500);
}

// PENANGANAN REGISTER
function handleRegister() {
  clearErrors();

  const email = document.getElementById('reg-email')?.value.trim() || '';
  const phone = document.getElementById('reg-phone')?.value.trim() || '';
  const name  = document.getElementById('reg-name')?.value.trim() || '';
  const pass  = document.getElementById('reg-pass')?.value || '';

  let hasError = false;

  if (!email) {
    showError('err-reg-email', 'Email wajib diisi.');
    hasError = true;
  } else if (!isValidEmail(email)) {
    showError('err-reg-email', 'Format email tidak valid.');
    hasError = true;
  }

  if (!phone) {
    showError('err-reg-phone', 'Nomor telepon wajib diisi.');
    hasError = true;
  } else if (!isValidPhone(phone)) {
    showError('err-reg-phone', 'Format nomor tidak valid. Contoh: 08xxxxxxxxxx');
    hasError = true;
  }

  if (!pass) {
    showError('err-reg-pass', 'Kata sandi wajib diisi.');
    hasError = true;
  } else if (!isStrongPassword(pass)) {
    showError('err-reg-pass', 'Min. 6 karakter, 1 angka, dan 1 karakter khusus (!@#$...)');
    hasError = true;
  }

  if (hasError) return;

  // Simulasi Registrasi
  const btn = document.querySelector('#page-register .btn-primary');
  setLoading(btn, true);

  setTimeout(() => {
    setLoading(btn, false);
    const displayName = name || email.split('@')[0];
    document.getElementById('success-msg').textContent = `Akun berhasil dibuat! Halo, ${displayName}. Selamat berbelanja di PakeLagi 🎉`;
    goTo('page-success');
    showToast('✓ Registrasi berhasil!');
    // Reset form
    document.getElementById('reg-email').value = '';
    document.getElementById('reg-phone').value = '';
    document.getElementById('reg-name').value = '';
    document.getElementById('reg-pass').value = '';
  }, 1800);
}

// ── LIVE VALIDATION (menghapus error pada input) ──
document.addEventListener('DOMContentLoaded', () => {
  const fieldMap = {
    'login-email': 'err-login-email',
    'login-pass':  'err-login-pass',
    'reg-email':   'err-reg-email',
    'reg-phone':   'err-reg-phone',
    'reg-pass':    'err-reg-pass',
  };

  Object.entries(fieldMap).forEach(([inputId, errId]) => {
    const el = document.getElementById(inputId);
    if (el) {
      el.addEventListener('input', () => clearError(errId));
    }
  });

  // Enter key support
  document.querySelectorAll('.form-input').forEach(input => {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const page = input.closest('.page');
        if (page?.id === 'page-login') handleLogin();
        if (page?.id === 'page-register') handleRegister();
      }
    });
  });
});
