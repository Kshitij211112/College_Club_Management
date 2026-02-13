const Event = require('../models/Event');
const Club = require('../models/Club');

// ─────────────────────────────────────────────
// EVENT CRUD OPERATIONS
// ─────────────────────────────────────────────

// @desc    Get all events (with advanced filtering)
// @route   GET /api/events
// @access  Public
exports.getAllEvents = async (req, res) => {
  try {
    const {
      category,
      clubId,
      upcoming,
      status,
      minFee,
      maxFee,
      eventType,
      search,
      startDate,
      endDate
    } = req.query;

    // Base filter: only active events
    let filter = { isActive: true };

    if (category) filter.category = category;
    if (clubId) filter.clubId = clubId;

    // Search by text (title or description)
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
    }

    // Filter by status (Upcoming, Completed, Cancelled)
    if (status) {
      filter.status = status;
    }

    // Upcoming events only
    if (upcoming === "true") {
      filter.date = { $gte: new Date() };
    }

    // Filter by event type (Online/Offline/Hybrid)
    if (eventType) {
      filter.eventType = eventType;
    }

    // Filter by price range
    if (minFee || maxFee) {
      filter.fees = {};
      if (minFee) filter.fees.$gte = Number(minFee);
      if (maxFee) filter.fees.$lte = Number(maxFee);
    }

    // Date Range
    if (startDate || endDate) {
      filter.date = filter.date || {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const events = await Event.find(filter)
      .populate("clubId", "name logo")
      .populate("organizers", "name email")
      .sort({ date: 1 });

    res.status(200).json({
      success: true,
      count: events.length,
      data: events
    });

  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({
      success: false,
      message: "Error fetching events",
      error: error.message
    });
  }
};

// @desc    Get single event by ID
// @route   GET /api/events/:id
// @access  Public
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate("clubId", "name logo president members")
      .populate("organizers", "name email role")
      .populate("registeredUsers", "name email");

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found"
      });
    }

    // Calculate remaining seats
    const remainingSeats =
      event.maxCapacity !== null
        ? event.maxCapacity - event.registrations
        : null;

    // Check if registration deadline passed
    const isRegistrationClosed =
      event.registrationDeadline &&
      new Date(event.registrationDeadline) < new Date();

    // Determine live event status based on date
    let eventStatus = event.status;
    if (event.status !== 'Cancelled') {
      if (new Date(event.date) < new Date()) {
        eventStatus = "Completed";
      } else {
        eventStatus = "Upcoming";
      }
    }

    res.status(200).json({
      success: true,
      data: {
        ...event._doc,
        remainingSeats,
        isRegistrationClosed,
        eventStatus
      }
    });

  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({
      success: false,
      message: "Error fetching event",
      error: error.message
    });
  }
};

// @desc    Create a new event
// @route   POST /api/events
// @access  Private (Club President or Admin)
exports.createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      date,
      time,
      duration,
      venue,
      eventType,
      clubId,
      poster,
      category,
      fees,
      prizes,
      rules,
      sponsors,
      organizers,
      maxCapacity,
      registrationDeadline,
      contact
    } = req.body;

    // 1️⃣ Validate required fields
    if (!title || !description || !date || !time || !venue || !clubId) {
      return res.status(400).json({
        success: false,
        message: "Title, description, date, time, venue & clubId are required"
      });
    }

    // 2️⃣ Check if club exists
    const club = await Club.findById(clubId);
    if (!club) {
      return res.status(404).json({
        success: false,
        message: "Club not found"
      });
    }

    // 3️⃣ Only club president OR admin can create event
    if (club.president.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only club president or admin can create events"
      });
    }

    // 4️⃣ Create event
    const newEvent = await Event.create({
      title,
      description,
      date,
      time,
      duration: duration || null,
      venue,
      eventType: eventType || "Offline",
      clubId,
      poster: poster || undefined,
      category: category || "Other",
      fees: fees || 0,
      prizes: prizes || [],
      rules: rules || [],
      sponsors: sponsors || [],
      organizers: organizers?.length ? organizers : [req.user.id],
      registrations: 0,
      maxCapacity: maxCapacity || null,
      registrationDeadline: registrationDeadline || null,
      contact: contact || {},
      isActive: true,
      status: "Upcoming"
    });

    res.status(201).json({
      success: true,
      message: "Event created successfully",
      data: newEvent
    });

  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({
      success: false,
      message: "Error creating event",
      error: error.message
    });
  }
};

// @desc    Update an event
// @route   PUT /api/events/:id
// @access  Private (Club President or Admin)
exports.updateEvent = async (req, res) => {
  try {
    const eventId = req.params.id;

    // 1️⃣ Find event with club president info
    const event = await Event.findById(eventId).populate("clubId", "president");

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found"
      });
    }

    // 2️⃣ Only club president OR admin can update
    const presidentId = event.clubId.president.toString();
    const currentUserId = req.user.id;

    if (currentUserId !== presidentId && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only club president or admin can update this event"
      });
    }

    // 3️⃣ Prevent editing past/completed events
    if (new Date(event.date) < new Date() && event.status !== 'Cancelled') {
      return res.status(400).json({
        success: false,
        message: "Completed events cannot be updated"
      });
    }

    // 4️⃣ Update event fields safely (whitelist approach)
    const allowedUpdates = [
      "title", "description", "date", "time", "duration", "venue",
      "eventType", "poster", "category", "fees", "prizes", "rules",
      "sponsors", "organizers", "maxCapacity", "registrationDeadline",
      "contact", "isActive", "status"
    ];

    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        event[field] = req.body[field];
      }
    });

    // 5️⃣ Validation: capacity cannot be less than current registrations
    if (event.maxCapacity !== null && event.maxCapacity < event.registrations) {
      return res.status(400).json({
        success: false,
        message: `Max capacity cannot be less than current registrations (${event.registrations})`
      });
    }

    // 6️⃣ Save updated event
    const updatedEvent = await event.save();

    res.status(200).json({
      success: true,
      message: "Event updated successfully",
      data: updatedEvent
    });

  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({
      success: false,
      message: "Error updating event",
      error: error.message
    });
  }
};

// @desc    Delete an event
// @route   DELETE /api/events/:id
// @access  Private (Club President or Admin)
exports.deleteEvent = async (req, res) => {
  try {
    const eventId = req.params.id;

    // 1️⃣ Find event with club president info
    const event = await Event.findById(eventId).populate("clubId", "president");

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found"
      });
    }

    // 2️⃣ Only club president or admin can delete
    const presidentId = event.clubId.president.toString();
    const currentUserId = req.user.id;

    if (currentUserId !== presidentId && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only club president or admin can delete this event"
      });
    }

    // 3️⃣ Prevent deleting completed events
    if (new Date(event.date) < new Date() && event.status !== 'Cancelled') {
      return res.status(400).json({
        success: false,
        message: "Completed events cannot be deleted"
      });
    }

    // 4️⃣ Delete event
    await event.deleteOne();

    res.status(200).json({
      success: true,
      message: "Event deleted successfully"
    });

  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({
      success: false,
      message: "Error deleting event",
      error: error.message
    });
  }
};

// ─────────────────────────────────────────────
// EVENT REGISTRATION
// ─────────────────────────────────────────────

// @desc    Register for an event
// @route   POST /api/events/:id/register
// @access  Private
exports.registerForEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const userId = req.user.id;

    // 1️⃣ Find the event
    const event = await Event.findById(eventId).populate("clubId", "members");

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found"
      });
    }

    // 2️⃣ User must NOT be part of that club
    const clubMemberIds = event.clubId.members.map(m => m.toString());
    if (clubMemberIds.includes(userId)) {
      return res.status(403).json({
        success: false,
        message: "Members of this club cannot register for this event"
      });
    }

    // 3️⃣ Check if already registered
    if (event.registeredUsers.some(u => u.toString() === userId)) {
      return res.status(400).json({
        success: false,
        message: "You are already registered for this event"
      });
    }

    // 4️⃣ Check if event is active
    if (!event.isActive) {
      return res.status(400).json({
        success: false,
        message: "Event registrations are closed"
      });
    }

    // 5️⃣ Check if event date has passed
    if (new Date(event.date) < new Date()) {
      return res.status(400).json({
        success: false,
        message: "This event is already over"
      });
    }

    // 6️⃣ Check deadline
    if (event.registrationDeadline && new Date(event.registrationDeadline) < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Registration deadline is over"
      });
    }

    // 7️⃣ Check capacity
    if (event.maxCapacity !== null && event.registrations >= event.maxCapacity) {
      return res.status(400).json({
        success: false,
        message: "Event is full. No more seats available"
      });
    }

    // 8️⃣ Register user
    event.registeredUsers.push(userId);
    event.registrations++;

    await event.save();

    res.status(200).json({
      success: true,
      message: "Successfully registered for event 🎉",
      data: {
        eventId: event._id,
        registeredUsers: event.registeredUsers.length,
        remainingSeats:
          event.maxCapacity !== null
            ? event.maxCapacity - event.registrations
            : null
      }
    });

  } catch (error) {
    console.error('Error registering for event:', error);
    res.status(500).json({
      success: false,
      message: "Error registering for event",
      error: error.message
    });
  }
};

// @desc    Cancel registration for an event
// @route   DELETE /api/events/:id/register
// @access  Private
exports.cancelRegistration = async (req, res) => {
  try {
    const eventId = req.params.id;
    const userId = req.user.id;

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found"
      });
    }

    // Check if registered
    const isRegistered = event.registeredUsers.some(u => u.toString() === userId);
    if (!isRegistered) {
      return res.status(400).json({
        success: false,
        message: "You are not registered for this event"
      });
    }

    // Cannot cancel past events
    if (new Date(event.date) < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Cannot cancel registration for a past event"
      });
    }

    // Remove user from registeredUsers
    event.registeredUsers = event.registeredUsers.filter(
      u => u.toString() !== userId
    );
    event.registrations = Math.max(0, event.registrations - 1);

    await event.save();

    res.status(200).json({
      success: true,
      message: "Registration cancelled successfully"
    });

  } catch (error) {
    console.error('Error cancelling registration:', error);
    res.status(500).json({
      success: false,
      message: "Error cancelling registration",
      error: error.message
    });
  }
};