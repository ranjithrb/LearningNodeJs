const express = require("express");
const bcrypt = require("bcrypt");

const userModel = require("./../models/user");

const authRouter = express.Router();

// Create a user
authRouter.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, email, password, age, gender, avatar } =
      req.body;

    const passwordHash = await bcrypt.hash(password, 10);
    const userDoc = new userModel({
      firstName,
      lastName,
      email,
      password: passwordHash,
      age,
      gender,
      avatar,
    });

    await userDoc.save();

    res.send("User created successfully!");
  } catch (error) {
    res.status(500).send("User creation failed!" + error.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) return res.send("Invalid credentials!");

    const isPasswordValid = await user.checkPassword(password);

    if (!isPasswordValid) return res.send("Invalid credentials!");

    const token = user.getJWTToken();

    res.cookie("token", token);

    res.send("Login successful!");
  } catch (error) {
    res.status(500).send("User cannot login now! " + error.message);
  }
});

module.exports = authRouter;
