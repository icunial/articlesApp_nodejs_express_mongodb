const express = require("express");
const app = express();

const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/articles_db");
const db = mongoose.connection;

const PORT = 5000 || process.env.PORT;

app.get("/", (req, res) => {
  res.send("ArticlesApp - NodeJS / Express / MongoDB");
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}...`);
});
