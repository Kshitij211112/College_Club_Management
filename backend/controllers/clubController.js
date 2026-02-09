const Club = require('../models/Club');

// --- Helper: Standardize Club Output ---
// Refactored to handle single objects or arrays more reliably
const formatClubData = (data) => {
    if (!data) return null;
    const clubs = Array.isArray(data) ? data : [data];
    
    const formatted = clubs.map(club => {
        const clubObj = club.toObject ? club.toObject() : club;
        return {
            ...clubObj,
            presidentName: clubObj.president || "Not Assigned",
            vpName: clubObj.vicePresident || "Not Assigned",
            membersCount: clubObj.members?.length || 0,
            // Ensure members is always an array of strings for easy frontend [includes] checks
            members: clubObj.members ? clubObj.members.map(m => m.toString()) : []
        };
    });

    return Array.isArray(data) ? formatted : formatted[0];
};

// 1. GET All Clubs
exports.getAllClubs = async (req, res) => {
    try {
        const clubs = await Club.find().sort({ createdAt: -1 });
        res.status(200).json(formatClubData(clubs));
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch clubs", error: error.message });
    }
};

// 2. GET My Joined Clubs
exports.getMyClubs = async (req, res) => {
    try {
        // req.user.id comes from your auth middleware
        const clubs = await Club.find({ members: req.user.id });
        res.status(200).json(formatClubData(clubs));
    } catch (error) {
        res.status(500).json({ message: "Failed to load your clubs", error: error.message });
    }
};

// 3. JOIN Club (Optimized)
exports.joinClub = async (req, res) => {
    try {
        const userId = req.user.id;
        const club = await Club.findById(req.params.id);

        if (!club) return res.status(404).json({ message: "Club not found" });

        // Check if already a member
        const isAlreadyMember = club.members.some(m => m.toString() === userId);
        
        if (isAlreadyMember) {
            // We return 200 instead of 400 if they are already in. 
            // This prevents the console "error" if they click join on a club they are in.
            return res.status(200).json({ message: "You're already a member! ✨" });
        }

        // Use findByIdAndUpdate with $addToSet to prevent race-condition duplicates
        const updatedClub = await Club.findByIdAndUpdate(
            req.params.id,
            { $addToSet: { members: userId } },
            { new: true }
        );

        res.status(200).json({ 
            message: "Joined successfully! 🎉", 
            club: formatClubData(updatedClub) 
        });
    } catch (error) {
        res.status(500).json({ message: "Join failed", error: error.message });
    }
};

// 4. GET Club by ID
exports.getClubById = async (req, res) => {
    try {
        const club = await Club.findById(req.params.id);
        if (!club) return res.status(404).json({ message: 'Club not found' });
        
        res.status(200).json(formatClubData(club));
    } catch (error) {
        res.status(500).json({ message: 'Error fetching club', error: error.message });
    }
};

// 5. CREATE Club
exports.createClub = async (req, res) => {
    try {
        const { name, description, category, president, vicePresident } = req.body;

        if (!name) return res.status(400).json({ message: "Club name is required" });

        const nameExists = await Club.findOne({ name: name.trim() });
        if (nameExists) return res.status(400).json({ message: "A club with this name already exists" });

        const newClub = new Club({
            name: name.trim(),
            description: description || "No description provided",
            category: category || "General",
            president: president || "Pending",
            vicePresident: vicePresident || "Pending",
            createdBy: req.user.id,
            members: [req.user.id] 
        });

        const savedClub = await newClub.save();
        res.status(201).json({ 
            message: "Club created successfully!", 
            club: formatClubData(savedClub) 
        });
        
    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ message: "Validation Failed", errors: messages });
        }
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// 6. UPDATE Club
exports.updateClub = async (req, res) => {
    try {
        const club = await Club.findByIdAndUpdate(
            req.params.id, 
            { $set: req.body }, 
            { new: true, runValidators: true } 
        );
        
        if (!club) return res.status(404).json({ message: "Club not found" });
        res.status(200).json({ message: "Club updated", club: formatClubData(club) });
    } catch (error) {
        res.status(500).json({ message: "Update failed", error: error.message });
    }
};

// 7. DELETE Club
exports.deleteClub = async (req, res) => {
    try {
        const club = await Club.findByIdAndDelete(req.params.id);
        if (!club) return res.status(404).json({ message: "Club not found" });
        res.status(200).json({ message: "Club deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Delete failed", error: error.message });
    }
};