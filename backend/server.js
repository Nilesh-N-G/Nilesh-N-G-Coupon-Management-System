require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const Coupon = require("./models/Coupon");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const CouponUser = require("./models/CouponUser");

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use((req, res, next) => {
  const allowedOrigins = req.headers.origin || "*";
  res.header("Access-Control-Allow-Origin", allowedOrigins);
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

const PORT = process.env.PORT || 8080;

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("DB Connection Error:", err));


// API Routes
app.get("/coupons", async (req, res) => {
  try {
    const coupons = await Coupon.find();
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

const IP_TRACKING = {};

app.put("/coupons/redeem/:coupon_code", async (req, res) => {
  try {
    console.log(IP_TRACKING);
    const { coupon_code } = req.params;
    const userIP =
      req.ip || req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const COOLDOWN_PERIOD = 10 * 60 * 1000;

    if (req.cookies.redeemed) {
      return res.status(403).json({
        message:
          "You have already redeemed a coupon in this session.Please try again after 10 minutes.",
      });
    }

    // Check IP cooldown
    if (
      IP_TRACKING[userIP] &&
      Date.now() - IP_TRACKING[userIP] < COOLDOWN_PERIOD
    ) {
      return res.status(429).json({
        message:
          "Too many attempts detected from this IP. Please try again after 10 minutes.",
      });
    }

    // Find the coupon
    const coupon = await Coupon.findOne({ coupon_code });

    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    if (coupon.status !== "Available") {
      return res
        .status(400)
        .json({ message: "Coupon is already used, disabled, or expired." });
    }

    // Update the coupon status & claimer's IP
    await Coupon.updateOne(
      { coupon_code },
      { $set: { status: "Availed", claimed_by: userIP } }
    );

    // Set cooldown tracking
    IP_TRACKING[userIP] = Date.now();

    // Set a session cookie
    res.cookie("redeemed", "true", { httpOnly: true, maxAge: COOLDOWN_PERIOD });

    res.json({
      message: "Coupon redeemed successfully",
      claimed_by: userIP,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

app.put("/coupons/update/:coupon_code", async (req, res) => {
  try {
    const { coupon_code } = req.params;
    const { coupon_code: newCouponCode, expiry_date, status } = req.body;

    const existingCoupon = await Coupon.findOne({ coupon_code });
    if (!existingCoupon) {
      return res
        .status(404)
        .json({ success: false, message: "Coupon not found" });
    }

    if (newCouponCode !== coupon_code) {
      const duplicateCoupon = await Coupon.findOne({
        coupon_code: newCouponCode,
      });
      if (duplicateCoupon) {
        return res
          .status(400)
          .json({ success: false, message: "Coupon code already exists" });
      }
    }

    const updateFields = { coupon_code: newCouponCode, expiry_date, status };

    // If changing from "Availed" to "Available", reset "claimed_by" field
    if (existingCoupon.status === "Availed" && status === "Available") {
      updateFields.claimed_by = "Not Claimed";
    }

    // Update the coupon
    const updatedCoupon = await Coupon.findOneAndUpdate(
      { coupon_code },
      updateFields,
      { new: true }
    );

    res.json({
      success: true,
      message: "✅ Coupon updated successfully!",
      coupon: updatedCoupon,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "❌ Failed to update coupon. Please try again.",
    });
  }
});

app.delete("/coupons/delete/:coupon_code", async (req, res) => {
  try {
    const { coupon_code } = req.params;
    const deletedCoupon = await Coupon.findOneAndDelete({ coupon_code });

    if (!deletedCoupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    res.json({ message: "Coupon deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete coupon", error });
  }
});
app.post("/coupons/create", async (req, res) => {
  try {
    const { coupon_code, expiry_date, status } = req.body;

    // Check if the coupon code already exists
    const existingCoupon = await Coupon.findOne({ coupon_code });
    if (existingCoupon) {
      return res
        .status(400)
        .json({ success: false, message: "Coupon code already exists" });
    }

    // Create and save the new coupon
    const newCoupon = new Coupon({ coupon_code, expiry_date, status });
    await newCoupon.save();

    res.json({ success: true, message: "Coupon created successfully......" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await CouponUser.findOne({ username });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  res.json({ token });
});

app.post("/health", async (req, res) => {
  res.status(200).json({ message: "OK" });
});
// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
