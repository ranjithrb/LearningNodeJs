const express = require("express");
const morgan = require("morgan");

const PORT = 8081;
const app = express();

app.use(morgan("dev"));

app.get(
  "/dummy",
  (req, res, next) => {
    next();
    console.log("This is just a dummy path 1");
  },
  (req, res, next) => {
    console.log("This is just a dummy path 2");
    next();
  }
);

app.get("/dummy", (req, res, next) => {
  console.log("This is just another dummy path");
  res.send("This is just a dummy route");
});

app.use("/", (err, req, res, next) => {
  if (err) res.status(500).send(err.message);
  else next();
});

app.listen(PORT, () => {
  console.log(`Server listening on - ${PORT}`);
});
