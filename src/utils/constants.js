const jwtConfigs = {
  jwtSecret: process.env.JWT_SECRET,
  saltRounds: 10,
};

module.exports = {
  jwtConfigs,
};
