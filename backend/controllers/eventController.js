const Event = require('../models/Event');
const mongoose = require('mongoose');

// @desc    Get all events
// @route   GET /api/events
exports.getAllEvents = async (req, res) => {
    try {
        const { category, clubId, upcoming } = req.query;
        let filter = { isActive: true };
        
        if (category) filter.category = category;
        if (clubId) filter.clubId = clubId;
        
        // Filter for upcoming events (Date >= Now)
        if (upcoming === 'true') {
            filter.date = { $gte: new Date() };
        }
        
        const events = await Event.find(filter)
            .populate('clubId', 'name logo')
            .sort({ date: 1 });
        
        res.status(200).json({
            success: true,
            count: events.length,
            data: events
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching events', error: error.message });
    }
};

// @desc    Get single event by ID
// @route   GET /api/events/:id
exports.getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id)
            .populate('clubId', 'name logo email');
        
        if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
        
        res.status(200).json({ success: true, data: event });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching event', error: error.message });
    }
};

// @desc    Create new event (Admin)
// @route   POST /api/events
exports.createEvent = async (req, res) => {
    try {
        // Validation: Ensure clubId is a real MongoDB ID
        if (!mongoose.Types.ObjectId.isValid(req.body.clubId)) {
            return res.status(400).json({ success: false, message: 'Invalid Club ID format' });
        }

        const event = await Event.create(req.body);
        
        res.status(201).json({
            success: true,
            message: 'Event created successfully',
            data: event
        });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Error creating event', error: error.message });
    }
};

// @desc    Update event (Admin)
// @route   PUT /api/events/:id
exports.updateEvent = async (req, res) => {
    try {
        const event = await Event.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        
        if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
        
        res.status(200).json({ success: true, message: 'Event updated successfully', data: event });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Error updating event', error: error.message });
    }
};

// @desc    Toggle Registration Status (Admin)
// @route   PATCH /api/events/:id/status
exports.toggleRegistration = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ success: false, message: 'Event not found' });

        event.registrationOpen = !event.registrationOpen;
        await event.save();

        res.status(200).json({ success: true, message: `Registration is now ${event.registrationOpen ? 'Open' : 'Closed'}`, data: event });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Status update failed' });
    }
};

// @desc    Delete event (Admin)
// @route   DELETE /api/events/:id
exports.deleteEvent = async (req, res) => {
    try {
        const event = await Event.findByIdAndDelete(req.params.id);
        if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
        
        res.status(200).json({ success: true, message: 'Event deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error deleting event', error: error.message });
    }
};