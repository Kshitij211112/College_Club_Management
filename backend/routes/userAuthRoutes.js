const express = require("express");
const router = express.Router();

// 1. Ensure getMe is included in the destructuring here!
const { 
    UserLogin, 
    UserRegister, 
    GoogleAuth,
    getMe,
    changePassword
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");

router.post("/register", UserRegister);
router.post("/login", UserLogin);
router.post("/google", GoogleAuth);

// 2. This line will now work because getMe is defined
router.get("/me", protect, getMe); 
router.put("/change-password", protect, changePassword);

module.exports = router;