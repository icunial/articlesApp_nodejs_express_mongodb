const express = require("express");
const app = express();

const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/articles_db");
const db = mongoose.connection;
const Article = require("./models/Article");

const PORT = 5000 || process.env.PORT;

// Check connection
db.once("open", () => {
  console.log("Connected to MongoDB");
});

// Check for DB errors
db.on("error", (error) => {
  console.log(error);
});

app.get("/", async (req, res) => {
  const articles = await Article.find({});
  res.status(200).json({
    statusCode: 200,
    data: articles,
  });
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}...`);
});
