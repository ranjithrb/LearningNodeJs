const express = require("express");
const validator = require("validator");

const { userAuth } = require("../middlewares/auth");
const connectionRequestModel = require("../models/connectionRequests");
const { connectionStatus } = require("../utils/constants");
const userModel = require("../models/user");

const requestRouter = express.Router();

requestRouter.post(
  "/request/send/:connectionStatus/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.connectionStatus;

      console.log("toUserId -- ", toUserId);

      const validStatusValues = [
        connectionStatus.ignored,
        connectionStatus.interested,
      ];

      const isMongoId = validator.isMongoId(toUserId);

      if (!isMongoId)
        return res.status(400).json({ message: "Invalid user ID" });

      if (!validStatusValues.includes(status))
        return res
          .status(400)
          .json({ message: "The status value '" + status + "', is invalid!" });

      const [toUser, existsConnectionRequest] = await Promise.all([
        userModel.findById(toUserId),
        connectionRequestModel.findOne({
          $or: [
            { fromUserId, toUserId },
            {
              fromUserId: toUserId,
              toUserId: fromUserId,
            },
          ],
        }),
      ]);

      if (!toUser)
        return res.status(400).json({
          message: "No user to request connection with!",
        });

      if (existsConnectionRequest)
        return res.status(400).json({
          message: "Connection request exists",
        });

      const connectionRequest = new connectionRequestModel({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();

      let message =
        req.user.firstName + " has shown interest in " + toUser.firstName;

      if (status === connectionStatus.ignored)
        message = req.user.firstName + " has ignored " + toUser.firstName;

      res.json({
        message,
        data,
      });
    } catch (error) {
      console.log(error);
      res
        .status(400)
        .send("Failed to sent connection request " + error.message);
    }
  }
);

module.exports = requestRouter;
