const express = require("express");
const morgan = require("morgan");
const connectDB = require("./config/database");
const userModel = require("./models/user");

const PORT = 8081;
const app = express();

app.use(morgan("dev"));

app.post("/signup", async (req, res) => {
  try {
    const userDoc = new userModel({
      firstName: "Sachin",
      lastName: "Tendulkar",
    });

    await userDoc.save();

    res.send("User created successfully!");
  } catch (error) {
    res.status(500).send("User creation failed!");
  }
});

app.use("/", (err, req, res, next) => {
  if (err) res.status(500).send(err.message);
  else next();
});

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`DB connected & Server listening on - ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(`Database connection error`);
  });
