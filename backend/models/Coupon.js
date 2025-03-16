const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema({
  coupon_code: { type: String, unique: true, required: true },
  create_date: { type: Date, default: Date.now },
  expiry_date: { type: Date, required: true },
  status: { type: String, enum: ["Available", "Expired", "Availed", "Disabled"], default: "Available" },
  claimed_by: { type: String, default: null },
});

// Pre-save hook to check expiry status
couponSchema.pre("save", function (next) {
  if (this.expiry_date < new Date() && this.status !== "Availed") {
    this.status = "Expired";
  }
  next();
});

// Pre-find middleware to update expired coupons
couponSchema.pre(/^find/, async function () {
  await mongoose.model("Coupon").updateMany(
    { expiry_date: { $lt: new Date() }, status: { $ne: "Availed" } },
    { $set: { status: "Expired" } }
  );
});

const Coupon = mongoose.model("Coupon", couponSchema);
module.exports = Coupon;
