const express = require("express");
const router = express.Router();

const Article = require("../models/Article");
const User = require("../models/User");

router.get("/", async (req, res) => {
  const articles = await Article.find({});
  res.status(200).json({
    statusCode: 200,
    data: articles,
  });
});

// Get Single Article
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const articleFound = await Article.findById(id);
  if (articleFound) {
    const userFound = await User.findById(articleFound.author);
    if (userFound) {
      return res.status(200).json({
        statusCode: 200,
        data: {
          id: articleFound._id,
          title: articleFound.title,
          author: userFound.username,
          body: articleFound.body,
        },
      });
    }
  }
});

// Create an Article
router.post("/", async (req, res) => {
  const { title, body } = req.body;

  // Validations
  if (!title) {
    return res.status(400).json({
      statusCode: 400,
      msg: `Title is required!`,
    });
  }
  /*  if (!author) {
    return res.status(400).json({
      statusCode: 400,
      msg: `Author is required!`,
    });
  } */
  if (!body) {
    return res.status(400).json({
      statusCode: 400,
      msg: `Body is required!`,
    });
  }

  const articleCreated = await Article.create({
    title,
    author: req.user._id,
    body,
  });
  if (articleCreated) {
    return res.status(201).json({
      statusCode: 201,
      data: articleCreated,
    });
  }
});

// Update Article
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const body = req.body;

  const articleUpdated = await Article.updateOne({ _id: id }, { ...body });
  if (articleUpdated) {
    const articleFound = await Article.findById(id);
    if (articleFound) {
      return res.status(200).json({
        statusCode: 200,
        data: articleFound,
      });
    }
  }
});

// Delete Article
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const articleToDelete = await Article.findById(id);
  if (articleToDelete) {
    const deleted = await Article.deleteOne({ _id: id });
    if (deleted) {
      return res.status(200).json({
        statusCode: 200,
        data: articleToDelete,
      });
    }
  }
});

module.exports = router;
