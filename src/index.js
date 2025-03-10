const express = require("express");
const morgan = require("morgan");

const PORT = 8081;
const app = express();

app.use(morgan("tiny"));

app.get("/dummy", (req, res) => {
  res.send("This is just a dummy path");
});

app.use("/dummy", (req, res) => {
  res.send("bla bla bla bla bla bla bla bla bla bla");
});

// the function is called request handler
app.use("/sample", function (req, res, next) {
  res.send("Hello from the server! :)");
});

app.get("/users", (req, res) => {
  res.send("This is a GET call for users!");
});

app.post("/users", (req, res) => {
  res.send("This is a POST call for users!");
});

app.put("/users", (req, res) => {
  res.send("This is a PUT call for users!");
});

app.patch("/users", (req, res) => {
  res.send("This is a PATCH call for users!");
});

app.delete("/users", (req, res) => {
  res.send("This is a DELETE call for users!");
});

app.listen(PORT, () => {
  console.log(`Server listening on - ${PORT}`);
});
