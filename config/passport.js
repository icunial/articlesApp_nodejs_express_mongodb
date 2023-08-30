const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/User");
const config = require("./database");
const bcrypt = require("bcryptjs");

module.exports = (passport) => {
  // Local Strategy
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      // Match Username
      const userFound = await User.findOne({ username });
      if (userFound) {
        // Match Password
        bcrypt.compare(password, userFound.password, (err, isMatch) => {
          if (err) {
            throw err;
          }
          if (isMatch) {
            return done(null, userFound);
          } else {
            return done(null, false, { msg: `Incorrect password` });
          }
        });
      } else {
        return done(null, false, { msg: `Incorrect username` });
      }
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    const userFound = await User.findById(id);
    if (userFound) {
      done(null, userFound);
    } else {
      done(null, { msg: `User not found!` });
    }
  });
};
