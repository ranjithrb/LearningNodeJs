const mongoose = require("mongoose");

const dbAppName = process.env.DB_APP_NAME;
const dbName = process.env.APP_DB_NAME;
const dbHostName = process.env.APP_DB_HOST_NAME;
const dbPassword = process.env.APP_DB_PASSWORD;
const dbCluster = process.env.APP_DB_CLUSTER;

const connectDB = async () => {
  await mongoose.connect(
    `mongodb+srv://${dbCluster}:${dbPassword}@${dbHostName}/${dbName}?retryWrites=true&w=majority&appName=${dbAppName}`
  );
};

module.exports = connectDB;
