const mongoose = require("mongoose");

const genderEnums = ["male", "female", "others"];

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      minLength: 1,
      maxLength: [30, "Your first name is too long!. Shorten it please"],
      trim: true,
    },
    lastName: {
      type: String,
      minLength: 1,
      maxLength: [30, "Your last name is too long!. Shorten it please"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please provide your email ID to proceed"],
      unique: [true, "You cannot register with this email ID"],
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Please provide a strong password"],
    },
    age: {
      type: Number,
      min: [18, "You must be an adult to register in the app."],
    },
    gender: {
      type: String,
      enum: genderEnums,
    },
    avatar: {
      type: String,
      default:
        "https://cdn.iconscout.com/icon/free/png-512/free-user-icon-download-in-svg-png-gif-file-formats--avatar-profile-account-people-interface-pack-icons-2764602.png?f=webp&w=512",
    },
    conditionalValue: {
      type: String,
      maxLength: [10, "You have exceeded the maximum length"],
    },
  },
  {
    timestamps: true,
  }
);

const userModel = mongoose.model("User", userSchema);
module.exports = userModel;
