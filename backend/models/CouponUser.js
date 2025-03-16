const mongoose = require("mongoose");

const CouponUserSchema = new mongoose.Schema({
  username: String,
  password: String,
});


const CouponUser = mongoose.model("couponusers", CouponUserSchema);
module.exports = CouponUser;
