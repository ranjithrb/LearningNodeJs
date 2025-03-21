const mongoose = require("mongoose");
const { connectionStatusValues } = require("../utils/constants");

const connectionRequestSchema = mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
    },
    status: {
      type: String,
      enum: {
        values: connectionStatusValues,
        message: "Connection status : {VALUE} is not supported",
      },
      require: true,
      lowercase: true,
    },
  },
  {
    timestamps: true,
  }
);

const connectionRequestModel = mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema
);

module.exports = connectionRequestModel;
