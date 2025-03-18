const express = require("express");
const morgan = require("morgan");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const connectDB = require("./config/database");
const userModel = require("./models/user");
const { userAuth } = require("./middlewares/auth");
const { jwtConfigs } = require("./utils/constants");

const PORT = 8081;
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

// Create a user
app.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, email, password, age, gender, avatar } =
      req.body;

    const passwordHash = await bcrypt.hash(password, 10);
    const userDoc = new userModel({
      firstName,
      lastName,
      email,
      password: passwordHash,
      age,
      gender,
      avatar,
    });

    await userDoc.save();

    res.send("User created successfully!");
  } catch (error) {
    res.status(500).send("User creation failed!" + error.message);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) return res.send("Invalid credentials!");

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) return res.send("Invalid credentials!");

    const token = jwt.sign({ userId: user._id }, jwtConfigs.jwtSecret);

    res.cookie("token", token);

    res.send("Login successful!");
  } catch (error) {
    res.status(500).send("User cannot login now! " + error.message);
  }
});

// Get a user
app.get("/user", userAuth, async (req, res) => {
  try {
    const user = req.user;

    res.send(user);
  } catch (error) {
    res.status(500).send("User cannot be fetched now! " + error.message);
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
