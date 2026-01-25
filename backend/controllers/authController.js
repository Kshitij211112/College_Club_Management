const User =require("../models/User.js");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.UserRegister=async(req,res)=>{
    try {
        const { name, email, password } = req.body;

        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ message: "Email already exists" });

        const hash = await bcrypt.hash(password, 10);

        const user = new User({ name, email, password: hash });
        await user.save();

        res.json({ message: "User registered successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.UserLogin= async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "User not found" });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(400).json({ message: "Incorrect password" });

        const token = jwt.sign({ id: user._id, role: user.role }, "SECRET123", { expiresIn: "1d" });

        res.json({ 
            message: "Login successful",
            token,
            user
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}