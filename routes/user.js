const express = require("express");
const passport = require("passport");
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { saveReturnTo } = require("../middleware.js");
const userControllers = require("../controllers/users.js");

const router = express.Router();

// Render signup form
router.route("/signup")
  .get(userControllers.renderSignupForm)
  .post(wrapAsync(userControllers.signup));

// Render login form
router.route("/login")
  .get(userControllers.renderLoginForm)
  .post(
    saveReturnTo,
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login"
    }),
    userControllers.login
  );

// Handle logout
router.get("/logout", userControllers.logout);

module.exports = router;
