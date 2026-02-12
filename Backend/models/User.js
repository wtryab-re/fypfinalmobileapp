// models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true, enum: ["Male", "Female", "Other"] },
    phoneNumber: { type: String, required: true },
    cnic: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["patient", "worker"], required: true },
    isApproved: { type: Boolean, default: false },
    workerID: { type: String, default: null }, // Only for workers
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  },
);

const User = mongoose.model("User", userSchema);

export default User;
