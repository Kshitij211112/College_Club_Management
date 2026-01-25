const express = require("express");
const router = express.Router();

const {UserLogin,UserRegister}=require("../controllers/authController")

router.post("/register",UserRegister);
router.post("/login",UserLogin);

module.exports=router;