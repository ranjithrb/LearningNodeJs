const express = require("express");

const PORT = 8081;
const app = express();

// the function is called request handler
app.use("/sample", function (req, res, next) {
  res.send("Hello from the server! :)");
});

app.listen(PORT, () => {
  console.log(`Server listening on - ${PORT}`);
});
