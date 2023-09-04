const express = require("express");
const app = express();

require("dotenv").config();

const mongoose = require("mongoose");

mongoose.connect(`mongodb://${process.env.DB_HOST}/${process.env.DB_NAME}`);
const db = mongoose.connection;

const PORT = 5000 || process.env.PORT;

const articlesRouter = require("./routes/articles");
const usersRouter = require("./routes/users");

const session = require("express-session");
const passport = require("passport");

// Check connection
db.once("open", () => {
  console.log("Connected to MongoDB");
});

// Check for DB errors
db.on("error", (error) => {
  console.log(error);
});

//db.dropCollection("articles");

// Body-Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Express Session Middleware
app.use(
  session({
    secret: `${process.env.SESSION_SECRET}`,
    resave: false,
    saveUninitialized: false,
  })
);

// Passport Config
require("./config/passport")(passport);
app.use(passport.initialize());
app.use(passport.session());

// Add routers
app.use("/articles", articlesRouter);
app.use("/users", usersRouter);

// Error catching endware
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || err;
  res.status(status).json({
    statusCode: status,
    msg: message,
  });
});

// Initialized Express Server
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}...`);
});

module.exports = { app, db };
