// backend/seed.js
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

import CouponMaster from "./models/CouponMaster.js";
import User from "./models/User.js";

async function seed(){
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to Mongo for seeding...");

  await CouponMaster.deleteMany({});
  await User.deleteMany({});

  const coupons = await CouponMaster.insertMany([
    { code: "FOOD50", title: "₹50 off Food", description: "₹50 off on food orders above ₹299", category: "gold", valueType: "flat", value: 50, expiryDays: 30 },
    { code: "MOVIE10", title: "10% off Movie", description: "10% off on movie tickets (max ₹100)", category: "silver", valueType: "percent", value: 10, expiryDays: 30 },
    { code: "SHOP100", title: "₹100 off Shopping", description: "₹100 off on shopping above ₹999", category: "bronze", valueType: "flat", value: 100, expiryDays: 30 }
  ]);

  const user = await User.create({ name: "Demo User", email: "demo@example.com" });

  console.log("Seed complete. Demo user id:", user._id.toString());
  console.log("Seeded coupons:", coupons.map(c=>c.code).join(", "));
  process.exit(0);
}

seed().catch(err => {
  console.error("Seed error:", err);
  process.exit(1);
});
