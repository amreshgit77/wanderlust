const express = require("express");
const passport = require("passport");
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { saveReturnTo } = require("../middleware.js");

const router = express.Router();

const userControllers = require("../controllers/users.js");
const user = require("../models/user.js");

// Render signup form
router.get("/signup",
    userControllers.renderSignupForm
);

// Handle signup
router.post("/signup", wrapAsync(userControllers.signup));

// Render login form
router.get("/login", userControllers.renderLoginForm);

// Handle login
router.post("/login", saveReturnTo, passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login"
}), userControllers.login);

// Handle logout
router.get("/logout", userControllers.logout);

router.get("/logout", (req, res) => {

    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "you are logged out!");
        res.redirect("/listings");
    });
});

module.exports = router;
