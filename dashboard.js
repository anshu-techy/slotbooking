(function () {
  if (!requireAuth()) return;

  var user = getCurrentUser();
  if (!user) {
    window.location.href = 'login.html';
    return;
  }

  document.getElementById('profile-name').textContent = user.name || '—';
  document.getElementById('profile-email').textContent = user.email || '—';
  document.getElementById('profile-phone').textContent = user.phone || '—';

  var navUser = document.getElementById('nav-user');
  if (navUser) navUser.textContent = user.name || user.email;

  var adminLink = document.getElementById('admin-link');
  if (adminLink && user.isAdmin) adminLink.classList.remove('hidden');
})();
