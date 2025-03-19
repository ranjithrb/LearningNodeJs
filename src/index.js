const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

const connectDB = require("./config/database");
const authRouter = require("./routes/auth.route");
const profileRouter = require("./routes/profile.route");

const PORT = 8081;
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

app.use("/", authRouter);
app.use("/", profileRouter);

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
