# Temple & Event Booking System

A **comprehensive Temple/Event Booking System** built with **HTML, CSS, and JavaScript** frontend paired with a **Node.js Express backend API**. Features real-time data management, dynamic seat capacity tracking, and booking confirmations.

## What Makes This Project Special?

✅ **Full-Stack Architecture** - Frontend (HTML, CSS, JS) + Backend (Node.js Express)  
✅ **REST API Backend** - RESTful endpoints for events, sessions, and bookings  
✅ **Real-Time Data** - Dynamic seat availability and capacity management  
✅ **Professional Setup** - npm dependencies, scalable structure  
✅ **Easy to Understand** - Clean code, well-organized for learners  
✅ **Production-Ready** - Proper error handling and data validation  

## Project Files

```
project/
├── index.html          # Events listing page
├── event-details.html  # Event details & sessions
├── booking.html        # Booking form page
├── my-bookings.html    # View your bookings
├── styles.css          # CSS styling for all pages
├── script.js           # Frontend JavaScript
├── server.js           # Express.js backend API
├── package.json        # Node.js dependencies (Express)
├── requirements.txt    # Python dependencies (optional)
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

### Option 1: With Backend Server (Recommended) ⭐

**Prerequisites:**
- Node.js installed (v14 or higher)

**Steps:**
1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the backend server:
   ```bash
   npm start
   ```
   The API server will run on `http://localhost:3001`

3. Open `index.html` in your browser

### Option 2: Frontend Only (Quick Test)

Just open the `index.html` file directly in your browser without running the server.

**Note:** In frontend-only mode, the app uses browser localStorage instead of the API.

## API Endpoints

The Express backend provides the following REST API endpoints:

### Events
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get event details

### Sessions
- `GET /api/sessions` - Get all sessions
- `GET /api/sessions?eventId=:id` - Get sessions for specific event
- `POST /api/sessions/:id/book` - Update session booking status

### Bookings
- `GET /api/bookings` - Get all bookings
- `POST /api/bookings` - Create new booking
- `GET /api/bookings/:id` - Get booking details
- `DELETE /api/bookings/:id` - Cancel booking
- `GET /api/bookings/search?email=:email` - Search bookings by email

## How Data Works

The system uses an **in-memory data store** with sample data initialized on server startup:

### Events:
1. **Varanasi Temple** - Ancient temple, Capacity: 500
2. **Taj Mahal Tour** - Guided tour, Capacity: 300
3. **Krishna Temple Festival** - Festival, Capacity: 1000

### Sessions:
- Multiple date/time slots for each event
- Real-time capacity tracking and availability
- Bookable seats decremented on confirmation

### Bookings:
- Stored with visitor details, email, phone
- Session and event references
- Booking status tracking
- Search functionality by email
// [{ id, eventId, sessionDate, startTime, endTime, capacity, bookedSeats }, ...]

// Bookings stored as JSON array
localStorage.getItem('bookings')
// [{ id, eventId, sessionId, visitorName, email, phone, numberOfVisitors, status, notes, createdAt }, ...]
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
- ✅ Real-time seat availability tracking

### Technical Features:
- REST API architecture
- Form validation (name, email, phone, visitors)
- Real-time seat availability tracking
- Automatic capacity management
- Booking status tracking
- Search and filter functionality
- Responsive mobile design
- Error and success messages

## Testing the Application

### Test 1: Check API Status
1. Start the server: `npm start`
2. Visit `http://localhost:3001` in browser
3. Should see "Temple & Event Booking API is running"

### Test 2: Browse Events
1. Open `index.html` in browser
2. See 3 sample events displayed
3. Click "View & Book" on any event

### Test 3: View Sessions
1. On event details page
2. See available sessions with dates/times
3. See seat availability

### Test 4: Make a Booking
1. Click "Book Now" on a session
2. Fill booking form with details
3. Complete booking
4. See confirmation

### Test 5: View Your Bookings
1. Go to "My Bookings" page
2. Enter your email used during booking
3. Click "Search Bookings"
4. See all your bookings with details
5. Cancel bookings as needed

## Backend Architecture

### Server Setup:
- **Framework:** Express.js (Node.js)
- **Port:** 3001
- **API Format:** JSON REST
- **Data Store:** In-memory (can be extended to database)

### Data Models:
```javascript
Event: { id, name, description, location, capacity }
Session: { id, eventId, sessionDate, startTime, endTime, capacity, bookedSeats }
Booking: { id, eventId, sessionId, visitorName, email, phone, numberOfVisitors, status, notes }
```

## Technology Stack

**Frontend:**
- HTML5
- CSS3 (Flexbox, Grid, Responsive)
- Vanilla JavaScript (ES6+)

**Backend:**
- Node.js
- Express.js
- REST API

**Optional:**
- Flask (included in requirements.txt, not currently used)

## What You Learn

### Frontend Concepts:
- ✅ HTML structure and semantic markup
- ✅ CSS Grid, Flexbox, Responsive Design
- ✅ JavaScript DOM manipulation
- ✅ Fetch API for backend communication
- ✅ Form validation and error handling

### Backend Concepts:
- ✅ Express.js routing and middleware
- ✅ RESTful API design
- ✅ JSON data handling
- ✅ Server-side logic

### Full-Stack Development:
- ✅ Client-server architecture
- ✅ HTTP requests and responses
- ✅ Data flow between frontend and backend
- ✅ Error handling across layers

## Project Highlights

- **Professional Structure:** Proper separation of frontend and backend
- **Scalable Design:** Easy to extend with database later
- **Real-World Patterns:** Follows REST API conventions
- **Learning Tool:** Demonstrates full-stack concepts
- **Easy to Deploy:** Can be hosted on Node.js platforms

## Next Steps to Enhance

1. Replace in-memory storage with a real database (MongoDB, PostgreSQL)
2. Add user authentication (login/signup)
3. Add email notifications for bookings
4. Add admin dashboard for event management
5. Implement payment integration
6. Deploy to cloud platforms (Heroku, Vercel, AWS)

---

**Happy Learning! 🎓**
