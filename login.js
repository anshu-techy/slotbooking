(function () {
  var loginForm = document.getElementById('login-form');
  var otpRequestForm = document.getElementById('otp-request-form');
  var otpVerifyForm = document.getElementById('otp-verify-form');
  var googleBtn = document.getElementById('google-login-btn');
  var msg = document.getElementById('login-message');
  var tabs = document.querySelectorAll('.login-tabs a');
  var panelEmail = document.getElementById('login-email');
  var panelOtp = document.getElementById('login-otp');
  var otpVerifyWrap = document.getElementById('otp-verify-form');
  var otpDevHint = document.getElementById('otp-dev-hint');

  var otpPhone = '';

  function showMessage(text, type) {
    msg.textContent = text;
    msg.className = 'message ' + (type === 'error' ? 'error' : 'success');
    msg.hidden = false;
  }

  tabs.forEach(function (t) {
    t.addEventListener('click', function (e) {
      e.preventDefault();
      tabs.forEach(function (x) { x.classList.remove('active'); });
      t.classList.add('active');
      var tab = t.getAttribute('data-tab');
      if (tab === 'email') {
        panelEmail.classList.remove('hidden');
        panelOtp.classList.add('hidden');
      } else {
        panelEmail.classList.add('hidden');
        panelOtp.classList.remove('hidden');
      }
      msg.hidden = true;
    });
  });

  if (loginForm) {
    loginForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      msg.hidden = true;
      var email = document.getElementById('login-email-input').value.trim();
      var password = document.getElementById('login-password').value;
      var users = getUsers();
      var user = users.find(function (u) { return u.email.toLowerCase() === email.toLowerCase(); });
      if (!user) {
        showMessage('Invalid email or password', 'error');
        return;
      }
      var ok = await verifyPassword(password, user.passwordHash);
      if (!ok) {
        showMessage('Invalid email or password', 'error');
        return;
      }
      setCurrentUser({
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        isAdmin: user.isAdmin
      });
      showMessage('Login successful! Redirecting...', 'success');
      setTimeout(function () { window.location.href = 'dashboard.html'; }, 800);
    });
  }

  if (otpRequestForm) {
    otpRequestForm.addEventListener('submit', function (e) {
      e.preventDefault();
      msg.hidden = true;
      otpPhone = document.getElementById('otp-phone').value.trim().replace(/\s/g, '');
      var otp = String(Math.floor(100000 + Math.random() * 900000));
      setOtp(otpPhone, otp);
      otpRequestForm.classList.add('hidden');
      otpVerifyWrap.classList.remove('hidden');
      otpDevHint.textContent = 'Your OTP is: ' + otp + ' (valid 5 min)';
      otpDevHint.classList.remove('hidden');
      showMessage('OTP sent. Enter it below.', 'success');
    });
  }

  if (otpVerifyForm) {
    otpVerifyForm.addEventListener('submit', function (e) {
      e.preventDefault();
      msg.hidden = true;
      var otp = document.getElementById('otp-code').value.trim();
      var stored = getOtp(otpPhone);
      if (!stored || stored !== otp) {
        showMessage('Invalid or expired OTP', 'error');
        return;
      }
      deleteOtp(otpPhone);
      var users = getUsers();
      var user = users.find(function (u) { return u.phone === otpPhone; });
      if (!user) {
        user = {
          id: Date.now().toString(),
          name: 'User',
          email: '',
          passwordHash: '',
          phone: otpPhone,
          isAdmin: false,
          createdAt: new Date().toISOString()
        };
        users.push(user);
        saveUsers(users);
      }
      setCurrentUser({
        id: user.id,
        name: user.name,
        email: user.email || '',
        phone: user.phone,
        isAdmin: user.isAdmin
      });
      showMessage('Verified! Redirecting...', 'success');
      setTimeout(function () { window.location.href = 'dashboard.html'; }, 800);
    });
  }

  if (googleBtn) {
    googleBtn.addEventListener('click', function () {
      msg.hidden = true;
      var name = prompt('Enter your name (optional):') || '';
      var email = prompt('Enter your Google email:');
      if (!email) {
        showMessage('Email is required for Google login', 'error');
        return;
      }
      var users = getUsers();
      var user = users.find(function (u) { return u.email.toLowerCase() === email.toLowerCase(); });
      if (!user) {
        user = {
          id: Date.now().toString(),
          name: name || email.split('@')[0],
          email: email.toLowerCase(),
          passwordHash: '',
          phone: '',
          isAdmin: false,
          createdAt: new Date().toISOString()
        };
        users.push(user);
        saveUsers(users);
      }
      setCurrentUser({
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        isAdmin: user.isAdmin
      });
      showMessage('Login successful! Redirecting...', 'success');
      setTimeout(function () { window.location.href = 'dashboard.html'; }, 800);
    });
  }
})();
