const jwtConfigs = {
  jwtSecret: process.env.JWT_SECRET,
  saltRounds: 10,
};

const connectionStatus = {
  interested: "interested",
  ignored: "ignored",
  accepted: "accepted",
  rejected: "rejected",
};

const connectionStatusValues = Object.values(connectionStatus);

module.exports = {
  jwtConfigs,
  connectionStatus,
  connectionStatusValues,
};
