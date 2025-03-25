const express = require("express");

const { userAuth } = require("../middlewares/auth");
const connectionRequestModel = require("../models/connectionRequests");
const { connectionStatus } = require("../utils/constants");

const userRouter = express.Router();

userRouter.get(
  "/users/connectionRequests/received",
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
      res.status(400).json({ message: error.message });
    }
  }
);

userRouter.get("/users/connections", userAuth, async (req, res) => {
  try {
    const connections = await connectionRequestModel
      .find({
        status: connectionStatus.accepted,
        $or: [{ fromUserId: req.user._id }, { toUserId: req.user._id }],
      })
      .populate("fromUserId", "firstName lastName");

    // Todo: This is not tested. Need to check/test the edge cases

    const data = connections.map((item) => {
      if (item.fromUserId._id.toString() === item.fromUserId.toString())
        return item.toUserId;
      return item.fromUserId;
    });
    res.json({ data });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = userRouter;
