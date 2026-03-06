(function () {
  if (!requireAuth()) return;

  var form = document.getElementById('book-slot-form');
  var msg = document.getElementById('book-message');
  var dateInput = document.getElementById('slot-date');

  var today = new Date().toISOString().split('T')[0];
  if (dateInput) dateInput.setAttribute('min', today);

  function showMessage(text, type) {
    msg.textContent = text;
    msg.className = 'message ' + (type === 'error' ? 'error' : 'success');
    msg.hidden = false;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    msg.hidden = true;

    var date = document.getElementById('slot-date').value;
    var timeSlot = document.getElementById('slot-time').value;
    var requirement = document.getElementById('slot-requirement').value;
    var user = getCurrentUser();
    if (!user) return;

    var bookings = getBookings();
    var conflict = bookings.some(function (b) {
      return b.date === date && b.timeSlot === timeSlot && b.status !== 'cancelled';
    });
    if (conflict) {
      showMessage('This slot is already booked', 'error');
      return;
    }
    var sameSlot = bookings.some(function (b) {
      return b.userId === user.id && b.date === date && b.timeSlot === timeSlot && b.status !== 'cancelled';
    });
    if (sameSlot) {
      showMessage('You have already booked this slot', 'error');
      return;
    }

    var booking = {
      id: Date.now().toString(),
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      userPhone: user.phone || '',
      date: date,
      timeSlot: timeSlot,
      requirement: requirement,
      status: 'confirmed',
      createdAt: new Date().toISOString()
    };
    bookings.push(booking);
    saveBookings(bookings);

    showMessage('Slot booked successfully! Date: ' + date + ', ' + timeSlot, 'success');
    form.reset();
    dateInput.setAttribute('min', today);
  });
})();
