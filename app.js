const express = require("express");
const mongoose = require("mongoose");
const app = express();

mongoose
  .connect("mongodb://ichangai:mypassword@172.30.0.2:27017/?authSource=admin", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB", err);
  });

const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Docker Compose for Dev ENV");
});

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
