const express = require("express");
const router = express.Router();

const User = require("../models/User");

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
});

module.exports = router;
