(function () {
  if (!requireAuth()) return;

  var user = getCurrentUser();
  if (!user || !user.isAdmin) {
    window.location.href = 'dashboard.html';
    return;
  }

  var searchInput = document.getElementById('search-users');
  var usersList = document.getElementById('users-list');
  var bookingsList = document.getElementById('admin-bookings-list');
  var emptyBookings = document.getElementById('admin-bookings-empty');
  var exportBtn = document.getElementById('export-excel-btn');
  var msgEl = document.getElementById('admin-message');

  function showMessage(text, type) {
    msgEl.textContent = text;
    msgEl.className = 'message ' + (type === 'error' ? 'error' : 'success');
    msgEl.hidden = false;
  }

  function loadUsers() {
    var q = searchInput.value.trim().toLowerCase();
    var users = getUsers().map(function (u) {
      return { id: u.id, name: u.name, email: u.email, phone: u.phone || '' };
    });
    if (q) {
      users = users.filter(function (u) {
        return (u.name && u.name.toLowerCase().indexOf(q) !== -1) ||
          (u.email && u.email.toLowerCase().indexOf(q) !== -1) ||
          (u.phone && u.phone.indexOf(q) !== -1);
      });
    }
    usersList.innerHTML = '';
    users.forEach(function (u) {
      var row = document.createElement('div');
      row.className = 'user-row';
      row.textContent = (u.name || '—') + ' • ' + (u.email || '—') + ' • ' + (u.phone || '—');
      usersList.appendChild(row);
    });
  }

  function loadBookings() {
    var bookings = getBookings().filter(function (b) { return b.status !== 'cancelled'; });
    bookingsList.innerHTML = '';
    if (bookings.length === 0) {
      emptyBookings.classList.remove('hidden');
      return;
    }
    emptyBookings.classList.add('hidden');
    bookings.forEach(function (b) {
      var card = document.createElement('div');
      card.className = 'booking-card';
      card.innerHTML =
        '<div class="booking-info">' +
        '<p><strong>' + b.userName + '</strong> • ' + b.userEmail + ' • ' + (b.userPhone || '—') + '</p>' +
        '<p>' + b.requirement + ' — ' + b.date + ' ' + b.timeSlot + '</p>' +
        '</div>' +
        '<div class="booking-actions">' +
        '<button class="btn btn-danger admin-delete-btn" data-id="' + b.id + '">Delete</button>' +
        '</div>';
      bookingsList.appendChild(card);
    });

    bookingsList.querySelectorAll('.admin-delete-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (!confirm('Delete this booking?')) return;
        var id = btn.getAttribute('data-id');
        var bookings = getBookings();
        var idx = bookings.findIndex(function (b) { return b.id === id; });
        if (idx !== -1) {
          bookings[idx].status = 'cancelled';
          saveBookings(bookings);
          showMessage('Booking deleted.', 'success');
          loadBookings();
        }
      });
    });
  }

  exportBtn.addEventListener('click', function () {
    if (typeof XLSX === 'undefined') {
      showMessage('Excel library not loaded.', 'error');
      return;
    }
    var bookings = getBookings().filter(function (b) { return b.status !== 'cancelled'; });
    var rows = bookings.map(function (b) {
      return {
        'User Name': b.userName,
        'Email': b.userEmail,
        'Phone': b.userPhone,
        'Slot Date': b.date,
        'Slot Time': b.timeSlot,
        'Requirement': b.requirement
      };
    });
    var wb = XLSX.utils.book_new();
    var ws = XLSX.utils.json_to_sheet(rows);
    XLSX.utils.book_append_sheet(wb, ws, 'Bookings');
    XLSX.writeFile(wb, 'bookings.xlsx');
    showMessage('Excel file downloaded.', 'success');
  });

  searchInput.addEventListener('input', loadUsers);
  loadUsers();
  loadBookings();
})();
