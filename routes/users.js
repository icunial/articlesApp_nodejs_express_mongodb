const express = require("express");
const router = express.Router();

const User = require("../models/User");

const bcrypt = require("bcryptjs");

const passport = require("passport");

// Get Logged in user
router.get("/user", (req, res) => {
  if (req.user)
    return res.status(200).json({
      statusCode: 200,
      data: req.user,
    });
  else
    return res.status(400).json({
      statusCode: 400,
      msg: `No user logged in!`,
    });
});

// Get all users
router.get("/all", async (req, res) => {
  try {
    const users = await User.find({});
    if (!users.length) {
      return res.status(404).json({
        statusCode: 404,
        msg: `No users saved in DB`,
      });
    }
    res.status(200).json({
      statusCode: 200,
      data: users,
    });
  } catch (error) {
    console.log(error);
  }
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

// Login Process
router.post("/login", (req, res, next) => {
  passport.authenticate("local", (error, user, info) => {
    if (error) console.log(error);
    if (!user)
      return res.status(404).json({
        statusCode: 404,
        msg: info.msg,
      });
    req.logIn(user, (error) => {
      if (error) throw error;
      return res.status(200).send(true);
    });
  })(req, res, next);
});

// Logout Process
router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.status(200).send(false);
  });
});

module.exports = router;
