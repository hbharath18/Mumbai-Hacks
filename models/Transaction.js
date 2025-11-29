import mongoose from "mongoose";

const txSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  amount: Number,
  type: { type: String, enum: ["income", "expense"] },
  category: String,
  description: String,
  date: Date,
  source: String,
  rawRow: Object
}, { timestamps: true });

export default mongoose.model("Transaction", txSchema);
