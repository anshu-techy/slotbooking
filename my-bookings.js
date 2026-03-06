(function () {
  if (!requireAuth()) return;

  var listEl = document.getElementById('bookings-list');
  var emptyEl = document.getElementById('bookings-empty');
  var msgEl = document.getElementById('bookings-message');

  function showMessage(text, type) {
    msgEl.textContent = text;
    msgEl.className = 'message ' + (type === 'error' ? 'error' : 'success');
    msgEl.hidden = false;
  }

  function render(bookings) {
    listEl.innerHTML = '';
    if (bookings.length === 0) {
      emptyEl.classList.remove('hidden');
      return;
    }
    emptyEl.classList.add('hidden');
    var user = getCurrentUser();
    bookings.forEach(function (b) {
      var card = document.createElement('div');
      card.className = 'booking-card';
      card.innerHTML =
        '<div class="booking-info">' +
        '<p><strong>' + b.requirement + '</strong></p>' +
        '<p>Date: ' + b.date + ' | ' + b.timeSlot + '</p>' +
        '</div>' +
        '<div class="booking-actions">' +
        '<button class="btn btn-danger cancel-btn" data-id="' + b.id + '">Cancel</button>' +
        '</div>';
      listEl.appendChild(card);
    });

    listEl.querySelectorAll('.cancel-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (!confirm('Cancel this booking?')) return;
        var id = btn.getAttribute('data-id');
        var bookings = getBookings();
        var idx = bookings.findIndex(function (b) { return b.id === id && b.userId === user.id; });
        if (idx === -1) return;
        bookings[idx].status = 'cancelled';
        saveBookings(bookings);
        showMessage('Booking cancelled.', 'success');
        load();
      });
    });
  }

  function load() {
    msgEl.hidden = true;
    var user = getCurrentUser();
    var bookings = getBookings().filter(function (b) {
      return b.userId === user.id && b.status !== 'cancelled';
    });
    render(bookings);
  }

  load();
})();
