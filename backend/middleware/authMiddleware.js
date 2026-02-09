const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * Authentication Middleware
 * Verifies the JWT and attaches the user payload to req.user
 */
const protect = async (req, res, next) => {
  const authHeader = req.header("Authorization");

  console.log("=== AUTH MIDDLEWARE DEBUG ===");
  if (!authHeader) {
    console.log("❌ No Authorization header found");
    return res.status(401).json({ message: "No token provided" });
  }

  // Extract token from "Bearer <token>" format or raw
  const token = authHeader.startsWith("Bearer ") 
    ? authHeader.slice(7).trim() 
    : authHeader.trim();

  if (!token) {
    console.log("❌ Token is empty after extraction");
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key');
    console.log("✅ Token verified successfully. User ID:", decoded.id);
    
    // Attach the decoded payload to the request
    req.user = decoded;
    next();
  } catch (error) {
    console.error("❌ Token verification failed:", error.message);
    return res.status(401).json({ message: "Invalid token", error: error.message });
  }
};

/**
 * Admin Authorization Middleware
 * Should be used AFTER 'protect' to ensure req.user exists
 */
const isAdmin = async (req, res, next) => {
  try {
    // We look up the full user from the DB to ensure their role is current
    const user = await User.findById(req.user.id);

    if (user && user.role === 'admin') {
      // Upgrade req.user from the decoded token to the full DB document
      req.user = user; 
      next();
    } else {
      console.log("❌ Access denied: User is not an admin");
      res.status(403).json({ message: "Admin access required" });
    }
  } catch (err) {
    console.error("❌ Admin check error:", err.message);
    res.status(500).json({ message: "Server error during authorization" });
  }
};

module.exports = { protect, isAdmin };