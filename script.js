// ===== localStorage STORAGE MANAGEMENT =====

function initializeLocalStorage() {
    // Initialize with sample data if not already present
    if (!localStorage.getItem('events')) {
        const sampleEvents = [
            {
                id: 1,
                name: 'Varanasi Temple',
                description: 'Ancient temple of Lord Shiva with spiritual significance',
                location: 'Varanasi, Uttar Pradesh',
                capacity: 500
            },
            {
                id: 2,
                name: 'Taj Mahal Tour',
                description: 'Guided tour of the world-famous monument of love',
                location: 'Agra, Uttar Pradesh',
                capacity: 300
            },
            {
                id: 3,
                name: 'Krishna Temple Festival',
                description: 'Annual festival with cultural events and celebrations',
                location: 'Mathura, Uttar Pradesh',
                capacity: 1000
            }
        ];
        localStorage.setItem('events', JSON.stringify(sampleEvents));
    }

    if (!localStorage.getItem('sessions')) {
        const samplSessions = [
            // Varanasi sessions
            { id: 1, eventId: 1, sessionDate: '2024-12-20', startTime: '09:00', endTime: '12:00', capacity: 100, bookedSeats: 5 },
            { id: 2, eventId: 1, sessionDate: '2024-12-20', startTime: '14:00', endTime: '17:00', capacity: 100, bookedSeats: 8 },
            // Taj Mahal sessions
            { id: 3, eventId: 2, sessionDate: '2024-12-21', startTime: '10:00', endTime: '13:00', capacity: 80, bookedSeats: 3 },
            { id: 4, eventId: 2, sessionDate: '2024-12-21', startTime: '15:00', endTime: '18:00', capacity: 80, bookedSeats: 0 },
            // Krishna Festival sessions
            { id: 5, eventId: 3, sessionDate: '2024-12-25', startTime: '08:00', endTime: '11:00', capacity: 200, bookedSeats: 15 },
            { id: 6, eventId: 3, sessionDate: '2024-12-25', startTime: '12:00', endTime: '15:00', capacity: 200, bookedSeats: 20 }
        ];
        localStorage.setItem('sessions', JSON.stringify(samplSessions));
    }

    if (!localStorage.getItem('bookings')) {
        localStorage.setItem('bookings', JSON.stringify([]));
    }
}

// Get all events from localStorage
function getEvents() {
    const events = localStorage.getItem('events');
    return events ? JSON.parse(events) : [];
}

// Get event by ID from localStorage
function getEventById(eventId) {
    const events = getEvents();
    return events.find(e => e.id == eventId);
}

// Get sessions by event ID from localStorage
function getSessionsByEventId(eventId) {
    const sessions = localStorage.getItem('sessions');
    const allSessions = sessions ? JSON.parse(sessions) : [];
    return allSessions.filter(s => s.eventId == eventId);
}

// Get session by ID from localStorage
function getSessionById(sessionId) {
    const sessions = localStorage.getItem('sessions');
    const allSessions = sessions ? JSON.parse(sessions) : [];
    return allSessions.find(s => s.id == sessionId);
}

// Get all bookings from localStorage
function getAllBookings() {
    const bookings = localStorage.getItem('bookings');
    return bookings ? JSON.parse(bookings) : [];
}

// Get bookings by email from localStorage
function getBookingsByEmail(email) {
    const bookings = getAllBookings();
    return bookings.filter(b => b.email.toLowerCase() === email.toLowerCase());
}

// Get booking by ID from localStorage
function getBookingById(bookingId) {
    const bookings = getAllBookings();
    return bookings.find(b => b.id == bookingId);
}

// Create new booking in localStorage
function createBooking(booking) {
    const bookings = getAllBookings();
    const newId = bookings.length > 0 ? Math.max(...bookings.map(b => b.id)) + 1 : 1;
    booking.id = newId;
    booking.createdAt = new Date().toISOString();
    booking.status = 'confirmed';
    
    bookings.push(booking);
    localStorage.setItem('bookings', JSON.stringify(bookings));
    
    // Update session booked seats
    updateSessionBookedSeats(booking.sessionId, booking.numberOfVisitors, 'add');
    
    return booking;
}

// Update session booked seats
function updateSessionBookedSeats(sessionId, count, operation) {
    const sessions = localStorage.getItem('sessions');
    const allSessions = JSON.parse(sessions) || [];
    
    const session = allSessions.find(s => s.id == sessionId);
    if (session) {
        if (operation === 'add') {
            session.bookedSeats += count;
        } else if (operation === 'remove') {
            session.bookedSeats -= count;
        }
    }
    
    localStorage.setItem('sessions', JSON.stringify(allSessions));
}

// Cancel booking in localStorage
function cancelBooking(bookingId) {
    const bookings = getAllBookings();
    const booking = bookings.find(b => b.id == bookingId);
    
    if (booking && booking.status === 'confirmed') {
        booking.status = 'cancelled';
        booking.cancelledAt = new Date().toISOString();
        localStorage.setItem('bookings', JSON.stringify(bookings));
        
        // Free up seats
        updateSessionBookedSeats(booking.sessionId, booking.numberOfVisitors, 'remove');
        
        return true;
    }
    return false;
}

// ===== UTILITY FUNCTIONS =====

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

function formatTime(timeString) {
    const [hours, minutes] = timeString.split(':');
    const h = parseInt(hours);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const displayHours = h % 12 || 12;
    return `${displayHours}:${minutes} ${ampm}`;
}

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePhone(phone) {
    return /^[0-9]{10,}$/.test(phone.replace(/\D/g, ''));
}

function showError(elementId, message) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = message;
        element.style.display = 'block';
    }
}

function hideError(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.style.display = 'none';
    }
}

function showSuccess(elementId, message) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = message;
        element.style.display = 'block';
    }
}

function hideSuccess(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.style.display = 'none';
    }
}

function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// ===== EVENTS PAGE =====

function loadEventsPage() {
    initializeLocalStorage();
    const events = getEvents();
    displayEvents(events);
    
    // Add search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const filtered = events.filter(event =>
                event.name.toLowerCase().includes(searchTerm) ||
                event.location.toLowerCase().includes(searchTerm)
            );
            displayEvents(filtered);
        });
    }
}

function displayEvents(events) {
    const container = document.getElementById('eventsContainer');
    
    if (events.length === 0) {
        container.innerHTML = '<p style="grid-column: 1/-1;">No events found.</p>';
        return;
    }

    container.innerHTML = events.map(event => `
        <div class="event-card" onclick="goToEventDetails(${event.id})">
            <div class="event-image">🏛️</div>
            <div class="event-content">
                <h3>${event.name}</h3>
                <p>${event.description}</p>
                <div class="event-location">📍 ${event.location}</div>
                <div class="event-capacity">Capacity: ${event.capacity} visitors</div>
                <button class="btn btn-primary" onclick="event.stopPropagation(); goToEventDetails(${event.id})">
                    View & Book
                </button>
            </div>
        </div>
    `).join('');
}

function goToEventDetails(eventId) {
    window.location.href = `event-details.html?event=${eventId}`;
}

// ===== EVENT DETAILS PAGE =====

function loadEventDetailsPage() {
    initializeLocalStorage();
    const eventId = getQueryParam('event');
    
    if (!eventId) {
        document.getElementById('eventDetails').innerHTML = '<p class="error">Event ID not provided</p>';
        return;
    }

    const event = getEventById(eventId);
    if (!event) {
        document.getElementById('eventDetails').innerHTML = '<p class="error">Event not found</p>';
        return;
    }

    displayEventDetails(event);
    
    const sessions = getSessionsByEventId(eventId);
    displaySessions(eventId, sessions);
}

function displayEventDetails(event) {
    const container = document.getElementById('eventDetails');
    container.innerHTML = `
        <div class="event-details">
            <h2>${event.name}</h2>
            <p>${event.description}</p>
            <p class="location"><strong>📍 Location:</strong> ${event.location}</p>
            <p class="capacity"><strong>👥 Total Capacity:</strong> ${event.capacity} visitors</p>
        </div>
    `;
}

function displaySessions(eventId, sessions) {
    const container = document.getElementById('sessionsList');
    
    if (sessions.length === 0) {
        container.innerHTML = '<p>No sessions available for this event.</p>';
        return;
    }

    container.innerHTML = sessions.map(session => {
        const availableSeats = session.capacity - session.bookedSeats;
        let availabilityClass = availableSeats > 10 ? 'available' : availableSeats > 0 ? 'limited' : 'unavailable';
        let availabilityText = availableSeats > 0 ? `${availableSeats} seats available` : 'Sold Out';

        return `
            <div class="session-card">
                <div class="session-date">${formatDate(session.sessionDate)}</div>
                <div class="session-time">${formatTime(session.startTime)} - ${formatTime(session.endTime)}</div>
                <div class="session-availability ${availabilityClass}">
                    ${availabilityText}
                </div>
                ${availableSeats > 0 ? `
                    <button class="btn btn-primary" onclick="goToBooking(${eventId}, ${session.id})">
                        Book Now
                    </button>
                ` : `
                    <button class="btn btn-secondary" disabled>Sold Out</button>
                `}
            </div>
        `;
    }).join('');
}

function goToBooking(eventId, sessionId) {
    window.location.href = `booking.html?event=${eventId}&session=${sessionId}`;
}

// ===== BOOKING PAGE =====

let currentBooking = {
    eventId: null,
    sessionId: null,
    eventName: null,
    sessionDate: null,
    sessionTime: null,
    availableSeats: null
};

function loadBookingPage() {
    initializeLocalStorage();
    const eventId = getQueryParam('event');
    const sessionId = getQueryParam('session');

    if (!eventId || !sessionId) {
        document.querySelector('.booking-form-section').innerHTML = 
            '<p class="error">Missing event or session information</p>';
        return;
    }

    const event = getEventById(eventId);
    const session = getSessionById(sessionId);

    if (!event || !session) {
        document.querySelector('.booking-form-section').innerHTML = 
            '<p class="error">Event or session not found</p>';
        return;
    }

    currentBooking = {
        eventId: eventId,
        sessionId: sessionId,
        eventName: event.name,
        sessionDate: formatDate(session.sessionDate),
        sessionTime: `${formatTime(session.startTime)} - ${formatTime(session.endTime)}`,
        availableSeats: session.capacity - session.bookedSeats
    };

    displayBookingSummary();
    setupBookingForm();
}

function displayBookingSummary() {
    const summary = document.getElementById('bookingSummary');
    summary.innerHTML = `
        <div class="booking-summary">
            <h3>${currentBooking.eventName}</h3>
            <p><strong>Date:</strong> ${currentBooking.sessionDate}</p>
            <p><strong>Time:</strong> ${currentBooking.sessionTime}</p>
            <p><strong>Seats Available:</strong> ${currentBooking.availableSeats}</p>
        </div>
    `;
}

function setupBookingForm() {
    const form = document.getElementById('bookingForm');
    
    // Max visitors cannot exceed available seats
    const numberOfVisitorsInput = document.getElementById('numberOfVisitors');
    numberOfVisitorsInput.max = Math.min(50, currentBooking.availableSeats);

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        submitBooking();
    });

    // Real-time validation
    document.getElementById('visitorName').addEventListener('blur', validateVisitorName);
    document.getElementById('email').addEventListener('blur', validateEmailInput);
    document.getElementById('phone').addEventListener('blur', validatePhoneInput);
    document.getElementById('numberOfVisitors').addEventListener('blur', validateNumberOfVisitors);
}

function validateVisitorName() {
    const input = document.getElementById('visitorName');
    
    if (!input.value.trim()) {
        showError('visitorNameError', 'Name is required');
        return false;
    }
    hideError('visitorNameError');
    return true;
}

function validateEmailInput() {
    const input = document.getElementById('email');
    
    if (!validateEmail(input.value)) {
        showError('emailError', 'Please enter a valid email');
        return false;
    }
    hideError('emailError');
    return true;
}

function validatePhoneInput() {
    const input = document.getElementById('phone');
    
    if (!validatePhone(input.value)) {
        showError('phoneError', 'Please enter a valid phone number (10+ digits)');
        return false;
    }
    hideError('phoneError');
    return true;
}

function validateNumberOfVisitors() {
    const input = document.getElementById('numberOfVisitors');
    
    const num = parseInt(input.value);
    if (num < 1 || num > 50) {
        showError('numberOfVisitorsError', 'Number of visitors must be between 1 and 50');
        return false;
    }
    if (num > currentBooking.availableSeats) {
        showError('numberOfVisitorsError', `Only ${currentBooking.availableSeats} seats available`);
        return false;
    }
    hideError('numberOfVisitorsError');
    return true;
}

function submitBooking() {
    hideError('formError');
    hideSuccess('formSuccess');

    // Validate all fields
    const isValid = validateVisitorName() && 
                   validateEmailInput() && 
                   validatePhoneInput() && 
                   validateNumberOfVisitors();

    if (!isValid) {
        showError('formError', 'Please fix the errors above');
        return;
    }

    const bookingData = {
        eventId: currentBooking.eventId,
        sessionId: currentBooking.sessionId,
        visitorName: document.getElementById('visitorName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        numberOfVisitors: parseInt(document.getElementById('numberOfVisitors').value),
        notes: document.getElementById('notes').value
    };

    try {
        const booking = createBooking(bookingData);
        showSuccess('formSuccess', `Booking confirmed! Your booking ID is: ${booking.id}`);
        
        // Clear form
        document.getElementById('bookingForm').reset();
        
        // Redirect after 2 seconds
        setTimeout(() => {
            window.location.href = `my-bookings.html?email=${encodeURIComponent(bookingData.email)}`;
        }, 2000);
    } catch (error) {
        console.error('Error creating booking:', error);
        showError('formError', 'Failed to create booking. Please try again.');
    }
}

// ===== MY BOOKINGS PAGE =====

function initializeMyBookingsPage() {
    initializeLocalStorage();
    
    const searchBtn = document.getElementById('searchBtn');
    const emailSearch = document.getElementById('emailSearch');
    const emailFromUrl = getQueryParam('email');

    if (emailFromUrl) {
        emailSearch.value = emailFromUrl;
        loadBookingsByEmail(emailFromUrl);
    }

    searchBtn.addEventListener('click', () => {
        const email = emailSearch.value.trim();
        if (!email) {
            showError('bookingsError', 'Please enter your email');
            return;
        }
        if (!validateEmail(email)) {
            showError('bookingsError', 'Please enter a valid email');
            return;
        }
        loadBookingsByEmail(email);
    });

    emailSearch.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchBtn.click();
        }
    });

    // Modal close functionality
    const modal = document.getElementById('bookingModal');
    const closeBtn = document.querySelector('.close');
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('show');
    });
    window.addEventListener('click', (e) => {
        if (e.target == modal) {
            modal.classList.remove('show');
        }
    });
}

function loadBookingsByEmail(email) {
    hideError('bookingsError');
    hideSuccess('bookingsSuccess');

    const bookings = getBookingsByEmail(email);

    if (bookings.length === 0) {
        document.getElementById('bookingsList').innerHTML = 
            `<p style="grid-column: 1/-1;">No bookings found for ${email}</p>`;
        return;
    }

    displayBookings(bookings);
}

function displayBookings(bookings) {
    const container = document.getElementById('bookingsList');
    
    container.innerHTML = bookings.map(booking => {
        const event = getEventById(booking.eventId);
        const session = getSessionById(booking.sessionId);
        
        return `
            <div class="booking-card" onclick="showBookingDetails(${booking.id})">
                <div class="booking-id">Booking ID: ${booking.id}</div>
                <div class="booking-event">${event ? event.name : 'N/A'}</div>
                <div class="booking-date">📅 ${formatDate(session.sessionDate)}</div>
                <div class="booking-date">🕐 ${formatTime(session.startTime)}</div>
                <div class="booking-visitors">👥 ${booking.numberOfVisitors} visitor(s)</div>
                <div class="booking-status status-${booking.status.toLowerCase()}">
                    ${booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </div>
                <div class="booking-actions">
                    <button class="btn btn-secondary" onclick="event.stopPropagation(); showBookingDetails(${booking.id})">
                        View Details
                    </button>
                    ${booking.status === 'confirmed' ? `
                        <button class="btn btn-danger" onclick="event.stopPropagation(); cancelBookingConfirm(${booking.id})">
                            Cancel
                        </button>
                    ` : ''}
                </div>
            </div>
        `;
    }).join('');
}

function showBookingDetails(bookingId) {
    const booking = getBookingById(bookingId);
    
    if (!booking) {
        alert('Booking not found');
        return;
    }

    const event = getEventById(booking.eventId);
    const session = getSessionById(booking.sessionId);
    
    const modal = document.getElementById('bookingModal');
    const content = document.getElementById('bookingDetailsContent');

    content.innerHTML = `
        <h2>Booking Details</h2>
        <div class="booking-detail-item">
            <div class="detail-label">Booking ID</div>
            <div class="detail-value">${booking.id}</div>
        </div>
        <div class="booking-detail-item">
            <div class="detail-label">Event</div>
            <div class="detail-value">${event ? event.name : 'N/A'}</div>
        </div>
        <div class="booking-detail-item">
            <div class="detail-label">Date</div>
            <div class="detail-value">${formatDate(session.sessionDate)}</div>
        </div>
        <div class="booking-detail-item">
            <div class="detail-label">Time</div>
            <div class="detail-value">${formatTime(session.startTime)} - ${formatTime(session.endTime)}</div>
        </div>
        <div class="booking-detail-item">
            <div class="detail-label">Visitor Name</div>
            <div class="detail-value">${booking.visitorName}</div>
        </div>
        <div class="booking-detail-item">
            <div class="detail-label">Email</div>
            <div class="detail-value">${booking.email}</div>
        </div>
        <div class="booking-detail-item">
            <div class="detail-label">Phone</div>
            <div class="detail-value">${booking.phone}</div>
        </div>
        <div class="booking-detail-item">
            <div class="detail-label">Number of Visitors</div>
            <div class="detail-value">${booking.numberOfVisitors}</div>
        </div>
        <div class="booking-detail-item">
            <div class="detail-label">Status</div>
            <div class="booking-status status-${booking.status.toLowerCase()}">
                ${booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </div>
        </div>
        ${booking.notes ? `
            <div class="booking-detail-item">
                <div class="detail-label">Notes</div>
                <div class="detail-value">${booking.notes}</div>
            </div>
        ` : ''}
        <div class="booking-detail-item">
            <div class="detail-label">Booking Date</div>
            <div class="detail-value">${new Date(booking.createdAt).toLocaleString()}</div>
        </div>
    `;

    modal.classList.add('show');
}

function cancelBookingConfirm(bookingId) {
    if (!confirm('Are you sure you want to cancel this booking?')) {
        return;
    }

    const success = cancelBooking(bookingId);
    
    if (success) {
        showSuccess('bookingsSuccess', 'Booking cancelled successfully');
        
        // Reload bookings
        setTimeout(() => {
            const emailSearch = document.getElementById('emailSearch');
            if (emailSearch.value) {
                loadBookingsByEmail(emailSearch.value);
            }
        }, 1000);
    } else {
        showError('bookingsError', 'Failed to cancel booking');
    }
}

// ===== PAGE LOAD HANDLERS =====

document.addEventListener('DOMContentLoaded', function() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    if (currentPage === 'index.html' || currentPage === '') {
        loadEventsPage();
    } else if (currentPage === 'event-details.html') {
        loadEventDetailsPage();
    } else if (currentPage === 'booking.html') {
        loadBookingPage();
    } else if (currentPage === 'my-bookings.html') {
        initializeMyBookingsPage();
    }
});
