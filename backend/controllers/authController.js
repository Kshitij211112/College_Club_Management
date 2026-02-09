const User = require("../models/User.js");
const Club = require("../models/Club.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// 1. REGISTER USER
exports.UserRegister = async (req, res) => {
    try {
        const { name, email, password, role, managedClub } = req.body;

        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ message: "Email already exists" });

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const user = new User({ 
            name, 
            email, 
            password: hash, 
            role: role || "student",
            managedClub: managedClub || null // Linked club for Presidents
        });
        
        await user.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        console.error("Registration Error:", err);
        res.status(500).json({ error: err.message });
    }
};

// 2. LOGIN USER
exports.UserLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "User not found" });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(400).json({ message: "Incorrect password" });

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                managedClub: user.managedClub // Ensure frontend gets this
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 3. GOOGLE OAUTH
exports.GoogleAuth = async (req, res) => {
    try {
        const { token: googleToken } = req.body;
        const ticket = await client.verifyIdToken({
            idToken: googleToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const { name, email, picture } = ticket.getPayload();
        let user = await User.findOne({ email });

        if (!user) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(Math.random().toString(36), salt);

            user = new User({
                name,
                email,
                password: hashedPassword,
                avatar: picture,
                role: "student"
            });
            await user.save();
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.status(200).json({
            message: "Google login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
                managedClub: user.managedClub
            }
        });
    } catch (err) {
        res.status(400).json({ message: "Google authentication failed" });
    }
};

// 4. GET CURRENT USER (Fixes the /me 404 and the Crash)
exports.getMe = async (req, res) => {
    try {
        // Find user and populate managedClub to see if they are a president
        const user = await User.findById(req.user.id)
            .select("-password")
            .populate("managedClub");

        if (!user) return res.status(404).json({ message: "User not found" });
        
        res.status(200).json(user);
    } catch (err) {
        console.error("GET_ME_ERROR:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// 5. GET ALL USERS
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password").sort({ name: 1 });
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch users" });
    }
};