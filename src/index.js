const express = require("express");
const morgan = require("morgan");
const connectDB = require("./config/database");
const userModel = require("./models/user");

const PORT = 8081;
const app = express();

app.use(express.json());
app.use(morgan("dev"));

// Create a user
app.post("/signup", async (req, res) => {
  try {
    const userDoc = new userModel(req.body);

    await userDoc.save();

    res.send("User created successfully!");
  } catch (error) {
    res.status(500).send("User creation failed!");
  }
});

// Get a user
app.get("/user", async (req, res) => {
  try {
    const user = await userModel.findOne(req.body);

    if (!user) return res.status(404).send("User not found!");
    res.send(user);
  } catch (error) {
    res.status(500).send("User cannot be fetched now!");
  }
});

// Get all users
app.get("/feed", async (req, res) => {
  try {
    const users = await userModel.find({});
    res.send(users);
  } catch (error) {
    res.status(500).send("Feed cannot be fetched now!");
  }
});

// Delete a user
app.delete("/user", async (req, res) => {
  try {
    const userId = req.body.userId;
    const user = await userModel.findByIdAndDelete(userId);
    if (!user) return res.status(404).send("User with the given ID not found!");
    res.send(user);
  } catch (error) {
    res.status(500).send("User cannot be deleted now!");
  }
});

// Update user details
app.patch("/user", async (req, res) => {
  try {
    const userId = req.body.userId;
    const user = await userModel.findByIdAndUpdate(userId, req.body);
    if (!user) return res.status(404).send("User with the given ID not found!");
    res.send(user);
  } catch (error) {
    console.log("err ", error);
    res.status(500).send("User cannot be updated now!");
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
