// backend/models/CouponMaster.js
import mongoose from "mongoose";

const couponMasterSchema = new mongoose.Schema({
  code: { type: String, required: true },
  title: String,
  description: String,
  category: String,       // e.g. "gold", "silver", "bronze" or category name
  minSpend: { type: Number, default: 0 },
  valueType: { type: String, enum: ["flat","percent"], default: "flat" },
  value: Number,
  partnerName: String,
  expiryDays: { type: Number, default: 30 }
}, { timestamps: true });

export default mongoose.model("CouponMaster", couponMasterSchema);
