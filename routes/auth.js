const jwt = require("jsonwebtoken");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/User.js");
const sendOTP = require("../utils/sendEmail");
require("dotenv").config();

console.log("SECRET:", process.env.JWT_SECRET);
console.log(process.env.EMAIL_USER);
console.log(process.env.EMAIL_PASS);


// ===== SIGNUP =====
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already exists" });

    // generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(email, otp)
    
    await sendOTP(email, otp);
    
    const user = new User({
      name,
      email,
      password:hashedPassword,
      otp,
      otpExpire: Date.now() + 5 * 60 * 1000 // 5 min
    });

    await user.save();

    res.json({
      message: "OTP sent to email",
      userId: user._id
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ===== LOGIN =====
router.post("/login", async (req, res) => {

  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (!user.isVerified) {
      return res.status(400).json({
      message: "Please verify your email first"
    });
  }

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    
    

   const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // create token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // SEND TOKEN
    res.json({
      message: "Login successful",
      token: token,
      user: user
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const authMiddleware = require("../middleware/auth");

router.get("/protected", authMiddleware, (req, res) => {
  res.json({
    message: "You are authenticated",
    userId: req.userId
  });
});

//Verify OTP

router.post("/verify-otp", async (req, res) => {
  try {
    const { userId, otp } = req.body;

    const user = await User.findById(userId);

    if (!user)
      return res.status(404).json({ message: "User not found" });

    if (user.otp !== otp || user.otpExpire < Date.now())
      return res.status(400).json({ message: "Invalid or expired OTP" });

    user.isVerified = true;
    user.otp = null;
    user.otpExpire = null;

    await user.save();

    res.json({ message: "Email verified successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
