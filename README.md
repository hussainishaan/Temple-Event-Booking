# Temple & Event Booking System

A **simple, student-friendly** Temple/Event Booking System built with **only HTML, CSS, and JavaScript** using browser `localStorage` for data management. No backend server, no database connection - everything runs locally in the browser!

## What Makes This Project Special?

✅ **Frontend Only** - HTML, CSS, JavaScript  
✅ **No Backend** - No Python, Flask, or Node.js  
✅ **No Database Connection** - Data stored in browser localStorage  
✅ **No Server Setup** - Just open HTML files in browser  
✅ **Easy to Understand** - Simple code, perfect for students  
✅ **Works Offline** - Completely independent  

## Project Files

```
project/
├── index.html          # Events listing page
├── event-details.html  # Event details & sessions
├── booking.html        # Booking form page
├── my-bookings.html    # View your bookings
├── styles.css          # CSS styling for all pages
├── script.js           # JavaScript with localStorage
└── README.md           # This file
```

## Features

### For Visitors:
- 🏛️ Browse all available events/temples
- 📍 View event locations and capacities
- 📅 Select available dates/sessions
- ⏰ View session timings
- 👥 Book for multiple visitors
- 📝 Add special notes/requirements
- ✉️ Search bookings by email
- 🔍 View complete booking details
- ❌ Cancel bookings
- 💾 All data saved locally in browser

### Technical Features:
- Form validation (name, email, phone, visitors)
- Real-time seat availability tracking
- Automatic capacity management
- Booking status tracking (Confirmed/Cancelled)
- Search and filter functionality
- Modal dialog for details
- Responsive mobile design
- Error and success messages

## How to Run

### Step 1: No Installation Needed! ✅

Just open the `index.html` file in your web browser.

**Options:**
1. **Direct Open** - Right-click `index.html` → Open with Browser
2. **Using Local Server** (Optional):
   ```bash
   python -m http.server 8000
   ```
   Then visit `http://localhost:8000` in browser

That's it! 🎉

## Sample Data

The system comes with sample data automatically loaded into browser localStorage:

### Events:
1. **Varanasi Temple** - Ancient temple, Capacity: 500
2. **Taj Mahal Tour** - Guided tour, Capacity: 300
3. **Krishna Temple Festival** - Festival, Capacity: 1000

### Sessions:
- Multiple date/time slots for each event
- Capacity tracking and availability
- Some pre-booked seats for demo

### Sample Bookings:
- A few sample bookings to show the booking system works
- Search by email to view

## How Data Works (localStorage)

### What is localStorage?
- Browser feature to store data locally on user's computer
- Data persists even after closing browser
- Max ~5-10MB storage per website
- No server needed, no internet required for demo

### Data Structure:
```javascript
// Events stored as JSON array
localStorage.getItem('events')
// [{ id, name, description, location, capacity }, ...]

// Sessions stored as JSON array
localStorage.getItem('sessions')
// [{ id, eventId, sessionDate, startTime, endTime, capacity, bookedSeats }, ...]

// Bookings stored as JSON array
localStorage.getItem('bookings')
// [{ id, eventId, sessionId, visitorName, email, phone, numberOfVisitors, status, notes, createdAt }, ...]
```

### JavaScript Functions (in script.js):
```javascript
// Save data to localStorage
localStorage.setItem('key', JSON.stringify(data))

// Get data from localStorage
const data = JSON.parse(localStorage.getItem('key'))

// This is how all operations work - no server calls!
```

## Testing the Application

### Test 1: Browse Events
1. Open `index.html`
2. See 3 sample events displayed
3. Click "View & Book" on any event

### Test 2: View Sessions
1. On event details page
2. See available sessions with dates/times
3. See seat availability

### Test 3: Make a Booking
1. Click "Book Now" on a session
2. Fill booking form
3. Complete booking
4. See confirmation with booking ID

### Test 4: View Your Bookings
1. Go to "My Bookings" page
2. Enter your email used during booking
3. Click "Search Bookings"
4. See all your bookings
5. Click "View Details" to see full info
6. Click "Cancel" to cancel booking

### Test 5: Verify Data Persistence
1. Make a booking
2. Close browser completely
3. Open `index.html` again
4. Go to "My Bookings"
5. Your booking is still there! ✅

## Browser's Developer Tools - Check localStorage

Press `F12` in browser to open DevTools:

1. Go to **Application** tab
2. Click **Local Storage**
3. Click website URL
4. See stored events, sessions, and bookings as JSON

This shows exactly where and how data is stored!

## Validation Rules Explained

### Booking Form Validation:
```javascript
// Name: Cannot be empty
// Email: Must have @ and . format
// Phone: At least 10 digits required
// Visitors: Between 1-50, cannot exceed available seats
```

### Session Capacity:
```javascript
Available Seats = Session Capacity - Booked Seats
// If booking exceeds available seats → Error shown
// When booking confirmed → Booked seats updated
// When booking cancelled → Booked seats decreased
```

## Code Structure (script.js)

### 1. localStorage Functions (Lines 1-150)
- `initializeLocalStorage()` - Create sample data
- `getEvents()`, `getEventById()` - Retrieve events
- `getSessionsByEventId()` - Get sessions for event
- `getAllBookings()`, `getBookingsByEmail()` - Retrieve bookings
- `createBooking()` - Add new booking
- `cancelBooking()` - Cancel booking

### 2. Utility Functions (Lines 151-250)
- `formatDate()`, `formatTime()` - Format display
- `validateEmail()`, `validatePhone()` - Validation
- `showError()`, `hideError()` - UI feedback
- `getQueryParam()` - Get URL parameters

### 3. Page Functions (Lines 251-end)
- `loadEventsPage()` - Load events with search
- `loadEventDetailsPage()` - Show event & sessions
- `loadBookingPage()` - Show booking form
- `initializeMyBookingsPage()` - Manage bookings

### 4. Event Listeners (At end)
- Form submit, button clicks
- Search functionality
- Modal open/close

## What Student Learns

### Frontend Concepts:
- ✅ HTML form elements and structure
- ✅ CSS Grid, Flexbox, Responsive Design
- ✅ JavaScript DOM manipulation
- ✅ Event listeners (click, submit, keypress)
- ✅ Form validation and error handling

### Data Management:
- ✅ JSON data format
- ✅ Array methods (map, filter, find)
- ✅ Object manipulation
- ✅ Client-side data storage

### Best Practices:
- ✅ Function organization
- ✅ Code reusability
- ✅ User feedback (success/error messages)
- ✅ Mobile-responsive design

## Important Notes for Teacher Explanation

1. **No Backend Needed** - Everything runs in browser
2. **localStorage is Limited** - For demo/learning only
3. **No Real Persistence** - Data lost if localStorage cleared
4. **Real Projects** - Would use actual database with server

## Real-World Next Steps

After understanding this project, students can learn:
- Backend development (Python/Flask, Node.js)
- Database design (SQLite, MySQL, MongoDB)
- API development (REST endpoints)
- Server deployment

## Troubleshooting

### Bookings not saving?
- Check if localStorage is enabled in browser
- DevTools → Application → Local Storage (should exist)
- If cleared, restart project

### Can't see booked sessions?
- Open browser DevTools (F12)
- Check Local Storage for 'sessions' data
- Make sure sessions have `bookedSeats` value

### Styling looks broken?
- Make sure `styles.css` is in same folder as HTML
- Hard refresh browser (Ctrl+Shift+R)

## Clear All Data

To reset and start fresh:
1. Open DevTools (F12)
2. Application → Local Storage
3. Right-click website URL → Clear
4. Refresh page

Sample data will reload automatically!

## Author's Notes

This project demonstrates:
✅ Complete frontend development workflow
✅ Data management without backend
✅ Professional UI/UX design
✅ Form validation and error handling
✅ Responsive web design
✅ JavaScript programming fundamentals

Perfect for students to understand web development concepts before diving into backend technologies!

---

**Happy Learning! 🎓**
