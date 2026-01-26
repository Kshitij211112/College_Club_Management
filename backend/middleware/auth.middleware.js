const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  console.log("=== AUTH MIDDLEWARE DEBUG ===");
  console.log("Full Headers:", req.headers);
  console.log("Authorization Header:", req.header("Authorization"));
  
  const authHeader = req.header("Authorization");
  
  if (!authHeader) {
    console.log("❌ No Authorization header found");
    return res.status(401).json({ message: "No token provided" });
  }

  // Extract token from "Bearer <token>" format
  let token;
  if (authHeader.startsWith("Bearer ")) {
    token = authHeader.slice(7).trim();
  } else {
    token = authHeader.trim();
  }


  if (!token) {
    console.log("❌ Token is empty after extraction");
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Token verified successfully. User ID:", decoded.id);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("❌ Token verification failed:", error.message);
    return res.status(401).json({ message: "Invalid token", error: error.message });
  }
};