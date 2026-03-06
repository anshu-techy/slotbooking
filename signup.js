(function () {
  var form = document.getElementById('signup-form');
  var msg = document.getElementById('signup-message');

  function showMessage(text, type) {
    msg.textContent = text;
    msg.className = 'message ' + (type === 'error' ? 'error' : 'success');
    msg.hidden = false;
  }

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    msg.hidden = true;

    var name = document.getElementById('signup-name').value.trim();
    var email = document.getElementById('signup-email').value.trim();
    var password = document.getElementById('signup-password').value;
    var phone = document.getElementById('signup-phone').value.trim().replace(/\s/g, '');

    if (password.length < 6) {
      showMessage('Password must be at least 6 characters', 'error');
      return;
    }

    var users = getUsers();
    if (users.some(function (u) { return u.email.toLowerCase() === email.toLowerCase(); })) {
      showMessage('Email already registered', 'error');
      return;
    }
    if (users.some(function (u) { return u.phone === phone; })) {
      showMessage('Phone number already registered', 'error');
      return;
    }

    var passwordHash = await hashPassword(password);
    var isFirst = users.length === 0;
    var user = {
      id: Date.now().toString(),
      name: name,
      email: email.toLowerCase(),
      passwordHash: passwordHash,
      phone: phone,
      isAdmin: isFirst,
      createdAt: new Date().toISOString()
    };
    users.push(user);
    saveUsers(users);

    setCurrentUser({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      isAdmin: user.isAdmin
    });
    showMessage('Account created! Redirecting...', 'success');
    setTimeout(function () { window.location.href = 'dashboard.html'; }, 800);
  });
})();
