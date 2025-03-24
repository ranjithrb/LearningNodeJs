const express = require("express");

const { userAuth } = require("../middlewares/auth");
const connectionRequestModel = require("../models/connectionRequests");
const { connectionStatus } = require("../utils/constants");

const userRouter = express.Router();

userRouter.get(
  "/user/connectionRequests/received",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;

      const data = await connectionRequestModel
        .find({
          status: connectionStatus.interested,
          toUserId: loggedInUser._id,
        })
        .populate("fromUserId", "firstName")
        .populate("toUserId", "firstName");

      res.json({ data });
    } catch (error) {
      res.send("Cannot find user requests " + error.message);
    }
  }
);

module.exports = userRouter;
