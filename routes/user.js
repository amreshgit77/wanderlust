const express = require("express");
const passport = require("passport");
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { saveReturnTo } = require("../middleware.js");

const router = express.Router();

// Render signup form
router.get("/signup", (req, res) => {
    res.render("users/signup.ejs");
});

// Handle signup
router.post("/signup", wrapAsync(async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ username, email });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, (err) => {
            if (err) return next(err);
            req.flash("success", "Welcome to Wanderlust!");
            res.redirect("/listings");
        });
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}));

// Render login form
router.get("/login", (req, res) => {
    res.render("users/login.ejs");
});

// Handle login
router.post("/login", saveReturnTo,passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login"
}), (req, res) => {
    req.flash("success", "Welcome back!");
    res.redirect(res.locals.returnTo || "/listings");
});

// Handle logout
router.get("/logout", (req, res, next) => {
    req.logout(function (err) {
        if (err) return next(err);
        req.flash("success", "Goodbye!");
        res.redirect("/listings");
    });
});

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
