const mongoose = require("mongoose");
const { Schema } = mongoose;
const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 20,
      trim: true,
    },
    lastName: {
      type: String,
      minLength: 3,
      maxLength: 20,
      trim: true,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      immutable: true,
    },
    age: {
      type: Number,
      min: 15,
      max: 100,
    },
    gender: {
      type: String,
      enum: ["male", "female", "others"],
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    walletBalance: {
      type: Number,
      default: 0,
      min: 0,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("user", userSchema);
module.exports = User;
