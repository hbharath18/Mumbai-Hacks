// backend/models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  // add fields later: budget, settings, preferredCategories, etc.
}, { timestamps: true });

export default mongoose.model("User", userSchema);
