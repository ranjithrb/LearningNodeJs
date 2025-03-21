const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { jwtConfigs } = require("../utils/constants");

const genderEnums = ["male", "female", "others"];

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      minLength: [1, "Provide your first name"],
      maxLength: [30, "Your first name is too long!. Shorten it please"],
      trim: true,
    },
    lastName: {
      type: String,
      minLength: [1, "Provide your last name"],
      maxLength: [30, "Your last name is too long!. Shorten it please"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please provide your email ID to proceed"],
      unique: [true, "You cannot register with this email ID"],
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value))
          throw new Error("Please provide a valid email");
      },
    },
    password: {
      type: String,
      required: [true, "Please provide a strong password"],
      validate(value) {
        if (!validator.isStrongPassword(value))
          throw new Error("Please provide a strong password");
      },
    },
    age: {
      type: Number,
      min: [18, "You must be an adult to register in the app."],
    },
    gender: {
      type: String,
      enum: {
        values: genderEnums,
        message: "gender : {VALUE} is not supported",
      },
    },
    avatar: {
      type: String,
      default:
        "https://cdn.iconscout.com/icon/free/png-512/free-user-icon-download-in-svg-png-gif-file-formats--avatar-profile-account-people-interface-pack-icons-2764602.png?f=webp&w=512",
      validate(value) {
        if (!validator.isURL(value))
          throw new Error("Photo URL must be a valid URL");
      },
    },
    aboutMe: {
      type: String,
      maxLength: [1000, "You have exceeded the maximum length"],
    },
    skills: {
      type: [String],
      validate(items) {
        if (items.length > 100)
          throw new Error(" Maximum skills limit reached!");
      },
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.getJWTToken = function () {
  const user = this;
  return jwt.sign({ userId: user._id }, jwtConfigs.jwtSecret);
};

userSchema.methods.checkPassword = async function (passwordInputByUser) {
  return await bcrypt.compare(passwordInputByUser, this.password);
};

const userModel = mongoose.model("User", userSchema);
module.exports = userModel;
