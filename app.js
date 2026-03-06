const KEY_USERS = 'slotbook_users';
const KEY_BOOKINGS = 'slotbook_bookings';
const KEY_CURRENT = 'slotbook_currentUser';
const KEY_OTP = 'slotbook_otp';

function getUsers() {
  try {
    return JSON.parse(localStorage.getItem(KEY_USERS) || '[]');
  } catch {
    return [];
  }
}

function saveUsers(users) {
  localStorage.setItem(KEY_USERS, JSON.stringify(users));
}

function getBookings() {
  try {
    return JSON.parse(localStorage.getItem(KEY_BOOKINGS) || '[]');
  } catch {
    return [];
  }
}

function saveBookings(bookings) {
  localStorage.setItem(KEY_BOOKINGS, JSON.stringify(bookings));
}

function getCurrentUser() {
  try {
    const u = localStorage.getItem(KEY_CURRENT);
    return u ? JSON.parse(u) : null;
  } catch {
    return null;
  }
}

function setCurrentUser(user) {
  localStorage.setItem(KEY_CURRENT, user ? JSON.stringify(user) : '');
}

function clearCurrentUser() {
  localStorage.removeItem(KEY_CURRENT);
}

async function hashPassword(password) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(password));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

async function verifyPassword(password, storedHash) {
  const hash = await hashPassword(password);
  return hash === storedHash;
}

function requireAuth() {
  if (!getCurrentUser()) {
    window.location.href = 'login.html';
    return false;
  }
  return true;
}

function setOtp(phone, otp) {
  const data = { phone, otp, expires: Date.now() + 5 * 60 * 1000 };
  localStorage.setItem(KEY_OTP, JSON.stringify(data));
}

function getOtp(phone) {
  try {
    var data = JSON.parse(localStorage.getItem(KEY_OTP) || 'null');
    if (!data || data.phone !== phone) return null;
    if (data.expires < Date.now()) {
      localStorage.removeItem(KEY_OTP);
      return null;
    }
    return data.otp;
  } catch (e) {
    return null;
  }
}

function deleteOtp(phone) {
  const data = JSON.parse(localStorage.getItem(KEY_OTP) || 'null');
  if (data && data.phone === phone) localStorage.removeItem(KEY_OTP);
}

document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('#logout-btn').forEach(function (el) {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      clearCurrentUser();
      window.location.href = 'index.html';
    });
  });
});
