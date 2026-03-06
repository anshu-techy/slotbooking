# Slot Booking (HTML + CSS + JS only)

No server or backend. All data is stored in the browser (localStorage).

## How to run

1. Open `index.html` in your browser (double-click or drag into browser).
2. Or use a simple local server, e.g. `npx serve .` or `python -m http.server 8000`, then go to the URL shown.

## Files

- **HTML:** `index.html`, `signup.html`, `login.html`, `dashboard.html`, `book-slot.html`, `my-bookings.html`, `admin.html`
- **CSS:** `css/style.css`
- **JS:** `js/app.js` (storage, auth), `js/signup.js`, `js/login.js`, `js/dashboard.js`, `js/book-slot.js`, `js/my-bookings.js`, `js/admin.js`

## Features

- Sign up / Login (email+password, OTP simulation, Google fallback)
- Dashboard, Book slot, My bookings, Cancel booking
- Admin: view bookings, search users, Export to Excel (uses SheetJS from CDN on admin page)
- First user who signs up is admin. Data stays in this browser only.
