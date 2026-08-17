const express = require('express');
const app = express();
const PORT = 3001;

app.use(express.json());

app.get('/', function (request, response) {
  response.send('Temple & Event Booking API is running');
});

const events = [
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

const sessions = [
  { id: 1, eventId: 1, sessionDate: '2024-12-20', startTime: '09:00', endTime: '12:00', capacity: 100, bookedSeats: 5 },
  { id: 2, eventId: 1, sessionDate: '2024-12-20', startTime: '14:00', endTime: '17:00', capacity: 100, bookedSeats: 8 },
  { id: 3, eventId: 2, sessionDate: '2024-12-21', startTime: '10:00', endTime: '13:00', capacity: 80, bookedSeats: 3 },
  { id: 4, eventId: 2, sessionDate: '2024-12-21', startTime: '15:00', endTime: '18:00', capacity: 80, bookedSeats: 0 },
  { id: 5, eventId: 3, sessionDate: '2024-12-25', startTime: '08:00', endTime: '11:00', capacity: 200, bookedSeats: 15 },
  { id: 6, eventId: 3, sessionDate: '2024-12-25', startTime: '12:00', endTime: '15:00', capacity: 200, bookedSeats: 20 }
];

const bookings = [];

let nextEventId = 4;
let nextSessionId = 7;
let nextBookingId = 1;

function findEventById(eventId) {
  return events.find(function (event) {
    return event.id === Number(eventId);
  });
}

function findSessionById(sessionId) {
  return sessions.find(function (session) {
    return session.id === Number(sessionId);
  });
}

function findBookingById(bookingId) {
  return bookings.find(function (booking) {
    return booking.id === Number(bookingId);
  });
}

function getCurrentBookingCount(sessionId) {
  return bookings.filter(function (booking) {
    return booking.sessionId === Number(sessionId) && booking.status === 'confirmed';
  }).reduce(function (total, booking) {
    return total + Number(booking.numberOfVisitors);
  }, 0);
}

function getAvailableSeats(sessionId) {
  const session = findSessionById(sessionId);

  if (!session) {
    return 0;
  }

  return session.capacity - getCurrentBookingCount(session.id);
}

// ==============================
// Events
// ==============================

app.get('/api/events', function (request, response) {
  response.json(events);
});

app.get('/api/events/:id', function (request, response) {
  const event = findEventById(request.params.id);

  if (!event) {
    return response.status(404).json({ message: 'Event not found' });
  }

  response.json(event);
});

app.post('/api/events', function (request, response) {
  const { name, description, location, capacity } = request.body;

  if (!name || !description || !location || !capacity || Number(capacity) <= 0) {
    return response.status(400).json({ message: 'Please provide name, description, location, and valid capacity' });
  }

  const newEvent = {
    id: nextEventId,
    name,
    description,
    location,
    capacity: Number(capacity)
  };

  events.push(newEvent);
  nextEventId += 1;

  response.status(201).json({
    message: 'Event added successfully',
    event: newEvent
  });
});

app.put('/api/events/:id', function (request, response) {
  const event = findEventById(request.params.id);

  if (!event) {
    return response.status(404).json({ message: 'Event not found' });
  }

  const { name, description, location, capacity } = request.body;

  if (name) event.name = name;
  if (description) event.description = description;
  if (location) event.location = location;

  if (capacity !== undefined) {
    const newCapacity = Number(capacity);
    const totalConfirmedSeats = bookings
      .filter(function (booking) {
        const session = findSessionById(booking.sessionId);
        return session && session.eventId === event.id && booking.status === 'confirmed';
      })
      .reduce(function (total, booking) {
        return total + Number(booking.numberOfVisitors);
      }, 0);

    if (newCapacity < totalConfirmedSeats) {
      return response.status(400).json({ message: 'Event capacity cannot be less than current confirmed bookings' });
    }

    event.capacity = newCapacity;
  }

  response.json({
    message: 'Event updated successfully',
    event
  });
});

app.delete('/api/events/:id', function (request, response) {
  const eventId = Number(request.params.id);
  const eventIndex = events.findIndex(function (event) {
    return event.id === eventId;
  });

  if (eventIndex === -1) {
    return response.status(404).json({ message: 'Event not found' });
  }

  const activeSessionExists = sessions.some(function (session) {
    return session.eventId === eventId && session.bookedSeats > 0;
  });

  if (activeSessionExists) {
    return response.status(400).json({ message: 'Cannot delete event because sessions already have bookings' });
  }

  const deletedEvent = events.splice(eventIndex, 1)[0];

  response.json({
    message: 'Event deleted successfully',
    event: deletedEvent
  });
});

// ==============================
// Sessions
// ==============================

app.get('/api/sessions', function (request, response) {
  response.json(sessions);
});

app.get('/api/sessions/:id', function (request, response) {
  const session = findSessionById(request.params.id);

  if (!session) {
    return response.status(404).json({ message: 'Session not found' });
  }

  response.json(session);
});

app.get('/api/events/:eventId/sessions', function (request, response) {
  const eventId = Number(request.params.eventId);
  const eventSessions = sessions.filter(function (session) {
    return session.eventId === eventId;
  });

  response.json(eventSessions);
});

app.post('/api/sessions', function (request, response) {
  const { eventId, sessionDate, startTime, endTime, capacity } = request.body;

  if (!eventId || !sessionDate || !startTime || !endTime || !capacity || Number(capacity) <= 0) {
    return response.status(400).json({ message: 'Please provide eventId, sessionDate, startTime, endTime, and valid capacity' });
  }

  const event = findEventById(eventId);
  if (!event) {
    return response.status(404).json({ message: 'Event not found' });
  }

  const newSession = {
    id: nextSessionId,
    eventId: Number(eventId),
    sessionDate,
    startTime,
    endTime,
    capacity: Number(capacity),
    bookedSeats: 0
  };

  sessions.push(newSession);
  nextSessionId += 1;

  response.status(201).json({
    message: 'Session added successfully',
    session: newSession
  });
});

app.put('/api/sessions/:id', function (request, response) {
  const session = findSessionById(request.params.id);

  if (!session) {
    return response.status(404).json({ message: 'Session not found' });
  }

  const { sessionDate, startTime, endTime, capacity } = request.body;

  if (sessionDate) session.sessionDate = sessionDate;
  if (startTime) session.startTime = startTime;
  if (endTime) session.endTime = endTime;

  if (capacity !== undefined) {
    const newCapacity = Number(capacity);
    const currentlyBooked = session.bookedSeats;

    if (newCapacity < currentlyBooked) {
      return response.status(400).json({ message: 'Session capacity cannot be less than already booked seats' });
    }

    session.capacity = newCapacity;
  }

  response.json({
    message: 'Session updated successfully',
    session
  });
});

app.delete('/api/sessions/:id', function (request, response) {
  const sessionId = Number(request.params.id);
  const sessionIndex = sessions.findIndex(function (session) {
    return session.id === sessionId;
  });

  if (sessionIndex === -1) {
    return response.status(404).json({ message: 'Session not found' });
  }

  const activeBookingsExist = bookings.some(function (booking) {
    return booking.sessionId === sessionId && booking.status === 'confirmed';
  });

  if (activeBookingsExist) {
    return response.status(400).json({ message: 'Cannot delete a session that already has confirmed bookings' });
  }

  const deletedSession = sessions.splice(sessionIndex, 1)[0];

  response.json({
    message: 'Session deleted successfully',
    session: deletedSession
  });
});

// ==============================
// Bookings
// ==============================

app.get('/api/bookings', function (request, response) {
  const { email } = request.query;

  if (email) {
    const filtered = bookings.filter(function (booking) {
      return booking.email && booking.email.toLowerCase() === String(email).toLowerCase();
    });
    return response.json(filtered);
  }

  response.json(bookings);
});

app.get('/api/bookings/:id', function (request, response) {
  const booking = findBookingById(request.params.id);

  if (!booking) {
    return response.status(404).json({ message: 'Booking not found' });
  }

  response.json(booking);
});

app.post('/api/bookings', function (request, response) {
  const {
    eventId,
    sessionId,
    visitorName,
    email,
    phone,
    numberOfVisitors,
    notes
  } = request.body;

  const event = findEventById(eventId);
  const session = findSessionById(sessionId);

  if (!event) {
    return response.status(404).json({ message: 'Event not found' });
  }

  if (!session) {
    return response.status(404).json({ message: 'Session not found' });
  }

  if (!visitorName || !email || !phone || !numberOfVisitors) {
    return response.status(400).json({ message: 'Please provide visitorName, email, phone, and numberOfVisitors' });
  }

  const quantity = Number(numberOfVisitors);
  if (quantity <= 0) {
    return response.status(400).json({ message: 'Number of visitors must be greater than 0' });
  }

  const availableSeats = getAvailableSeats(session.id);
  if (quantity > availableSeats) {
    return response.status(400).json({ message: `Only ${availableSeats} seats are available for this session` });
  }

  const booking = {
    id: nextBookingId,
    eventId: event.id,
    sessionId: session.id,
    visitorName,
    email,
    phone,
    numberOfVisitors: quantity,
    notes: notes || '',
    status: 'confirmed',
    createdAt: new Date().toISOString(),
    cancelledAt: null
  };

  bookings.push(booking);
  session.bookedSeats += quantity;
  nextBookingId += 1;

  response.status(201).json({
    message: 'Booking created successfully',
    booking
  });
});

app.post('/api/cancel-booking', function (request, response) {
  const { bookingId, id } = request.body;
  const finalBookingId = bookingId || id;

  const booking = findBookingById(finalBookingId);

  if (!booking) {
    return response.status(404).json({ message: 'Booking not found' });
  }

  if (booking.status === 'cancelled') {
    return response.status(400).json({ message: 'Booking is already cancelled' });
  }

  booking.status = 'cancelled';
  booking.cancelledAt = new Date().toISOString();

  const session = findSessionById(booking.sessionId);
  if (session) {
    session.bookedSeats = Math.max(0, session.bookedSeats - Number(booking.numberOfVisitors));
  }

  response.json({
    message: 'Booking cancelled successfully',
    booking
  });
});

app.post('/api/cancel-booking/:id', function (request, response) {
  request.body = { ...request.body, bookingId: request.params.id };
  return app._router.handle(request, response);
});

app.use(function (request, response) {
  response.status(404).json({ message: 'Route not found' });
});

app.listen(PORT, function () {
  console.log(`Temple & Event Booking API is running at http://localhost:${PORT}`);
});
