const express = require("express");
const router = express.Router();

const User = require("../models/User");

const bcrypt = require("bcryptjs");

router.get("/register", (req, res) => {
  console.log("/users/register");
});

// Register Process
router.post("/register", async (req, res) => {
  const { name, email, username, password, password2 } = req.body;

  // Validations

  if (!name) {
    return res.status(400).json({
      statusCode: 400,
      msg: `Name is required!`,
    });
  }
  if (!email) {
    return res.status(400).json({
      statusCode: 400,
      msg: `Email is required!`,
    });
  }
  if (!username) {
    return res.status(400).json({
      statusCode: 400,
      msg: `Username is required!`,
    });
  }
  if (!password) {
    return res.status(400).json({
      statusCode: 400,
      msg: `Password is required!`,
    });
  }
  if (!password2) {
    return res.status(400).json({
      statusCode: 400,
      msg: `Password confirmation is required!`,
    });
  }
  if (password !== password2) {
    return res.status(400).json({
      statusCode: 400,
      msg: `Password and Password Confirmation not match!`,
    });
  }

  // Hash password
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, async (err, hash) => {
      if (err) {
        console.log(err);
      }
      const userCreated = await User.create({
        name,
        email,
        username,
        password: hash,
      });
      if (userCreated) {
        return res.status(201).json({
          statusCode: 201,
          data: userCreated,
        });
      }
    });
  });
});

module.exports = router;
