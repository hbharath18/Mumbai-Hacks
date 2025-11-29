// backend/models/UserCoupon.js
import mongoose from "mongoose";

const userCouponSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  couponId: { type: mongoose.Schema.Types.ObjectId, ref: "CouponMaster", required: true },
  unlockedAt: { type: Date, default: Date.now },
  expiresAt: Date,
  status: { type: String, enum: ["active","used","expired"], default: "active" }
}, { timestamps: true });

export default mongoose.model("UserCoupon", userCouponSchema);
