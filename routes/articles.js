const express = require("express");
const router = express.Router();

const Article = require("../models/Article");
const User = require("../models/User");

// Access Control
const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(401).json({
      statusCode: 401,
      msg: `You are not authorized! Please login...`,
    });
  }
};

router.get("/", async (req, res, next) => {
  try {
    const articles = await Article.find({});
    if (!articles.length) {
      return res.status(404).json({
        statusCode: 404,
        msg: `No articles saved in DB`,
      });
    }
    res.status(200).json({
      statusCode: 200,
      data: articles,
    });
  } catch (error) {
    return next(error);
  }
});

// Get Single Article
router.get("/:id", ensureAuthenticated, async (req, res, next) => {
  const { id } = req.params;
  try {
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
      } else {
        return res.status(404).json({
          statusCode: 404,
          msg: `User with ID: ${articleFound.author} not found!`,
        });
      }
    } else {
      return res.status(404).json({
        statusCode: 404,
        msg: `Article with ID: ${id} not found!`,
      });
    }
  } catch (error) {
    return next(error);
  }
});

// Create an Article
router.post("/", ensureAuthenticated, async (req, res, next) => {
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

  try {
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
  } catch (error) {
    return next(error);
  }
});

// Update Article
router.put("/:id", ensureAuthenticated, async (req, res, next) => {
  const { id } = req.params;
  const body = req.body;

  try {
    const articleUpdated = await Article.updateOne({ _id: id }, { ...body });
    if (articleUpdated.author !== req.user._id) {
      return res.status(401).json({
        statusCode: 401,
        msg: `You can not update an article that is not yours!`,
      });
    }
    if (articleUpdated) {
      const articleFound = await Article.findById(id);
      if (articleFound) {
        return res.status(200).json({
          statusCode: 200,
          data: articleFound,
        });
      } else {
        return res.status(404).json({
          statusCode: 404,
          msg: `Article with ID: ${id} not found!`,
        });
      }
    }
  } catch (error) {
    return next(error);
  }
});

// Delete Article
router.delete("/:id", ensureAuthenticated, async (req, res) => {
  const { id } = req.params;
  const articleToDelete = await Article.findById(id);
  if (articleToDelete.author !== req.user._id) {
    return res.status(401).json({
      statusCode: 401,
      msg: `You can not delete an article that is not yours!`,
    });
  }
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
