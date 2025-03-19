const express = require("express");

const { userAuth } = require("./../middlewares/auth");

const profileRouter = express.Router();

// Get details user
profileRouter.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;

    res.send(user);
  } catch (error) {
    res.status(500).send("User cannot be fetched now! " + error.message);
  }
});

module.exports = profileRouter;
