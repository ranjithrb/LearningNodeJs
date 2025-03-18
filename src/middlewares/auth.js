const jwt = require("jsonwebtoken");

const { jwtConfigs } = require("../utils/constants");
const userModel = require("./../models/user");

async function userAuth(req, res, next) {
  try {
    const { token } = req.cookies;

    if (!token) return res.send("Unauthorized access!");

    const obj = jwt.verify(token, jwtConfigs.jwtSecret);

    const user = await userModel.findById(obj.userId);

    if (!user) return res.status(404).send("No records found!");

    req.user = user;
    next();
  } catch (error) {
    res.status(500).send("Error: " + error.message);
  }
}

module.exports = {
  userAuth,
};
