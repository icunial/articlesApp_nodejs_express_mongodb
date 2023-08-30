const express = require("express");
const app = express();

const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/articles_db");
const db = mongoose.connection;

const PORT = 5000 || process.env.PORT;

const articlesRouter = require("./routes/articles");
const usersRouter = require("./routes/users");

const passport = require("passport");

// Check connection
db.once("open", () => {
  console.log("Connected to MongoDB");
});

// Check for DB errors
db.on("error", (error) => {
  console.log(error);
});

// Body-Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Express Session Middleware
/* app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
  })
); */

// Passport Config
require("./config/passport")(passport);
app.use(passport.initialize());
app.use(passport.session());

// Add routers
app.use("/articles", articlesRouter);
app.use("/users", usersRouter);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}...`);
});
