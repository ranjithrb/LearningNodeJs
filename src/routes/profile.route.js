const express = require("express");
const bcrypt = require("bcrypt");

const { userAuth } = require("./../middlewares/auth");
const {
  validateProfileEdit,
  validateUserPasswordEdit,
} = require("./validators/profile.validators");
const { jwtConfigs } = require("../utils/constants");

const profileRouter = express.Router();

// Get details user
profileRouter.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;

    res.send(user);
  } catch (error) {
    res.status(400).send("User cannot be fetched now! " + error.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    const isEditAllowed = validateProfileEdit(req);
    if (!isEditAllowed)
      throw new Error("Profile edit operation is not allowed!");

    const user = req.user;

    Object.keys(req.body).forEach((item) => (user[item] = req.body[item]));

    await user.save();

    res.send("profile of " + user.firstName + " has been saved!");
  } catch (error) {
    res
      .status(400)
      .send("User profile cannot be updated now! " + error.message);
  }
});

profileRouter.patch("/profile/changePassword", userAuth, async (req, res) => {
  try {
    const isEditAllowed = validateUserPasswordEdit(req);
    if (!isEditAllowed) throw new Error("Password update is not allowed!");

    const user = req.user;

    const isValid = await user.checkPassword(req.body.currentPassword);

    if (!isValid) throw new Error("Invalid credentials!");

    // before hashing; checking if the password string is strong using default schema validation
    user.password = req.body.newPassword;
    await user.validate();

    const passwordHash = await bcrypt.hash(
      req.body.newPassword,
      jwtConfigs.saltRounds
    );

    user.password = passwordHash;

    await user.save();

    res.send("Password update successfully!");
  } catch (error) {
    res.status(400).send("Password update is not allowed! " + error.message);
  }
});

module.exports = profileRouter;
