var express = require("express");
var router = express.Router();
var csrf = require("csurf");
var passport = require("passport");

var csrfProtection = csrf();
router.use(csrfProtection);

// get register page
router.get("/register", notLoggedIn, function (req, res) {
    var messages = req.flash("error");
    res.render("user/register", {csrfToken: req.csrfToken(), messages: messages});
});

// register logic
router.post("/register", notLoggedIn, passport.authenticate("local.singup", {
    successRedirect: "/user/profile",
    failureRedirect: "/user/register",
    failureFlash: true
}));

// get login page
router.get("/login", notLoggedIn, function (req, res) {
    var messages = req.flash("error");
    res.render("user/login", {csrfToken: req.csrfToken(), messages: messages});
});

// login logic
router.post("/login", notLoggedIn, passport.authenticate("local.signin", {
    successRedirect: "/user/profile",
    failureRedirect: "/user/login",
    failureFlash: true
}));

// logout
router.get("/logout", isLoggedIn, function (req, res) {
    req.logout();
    res.redirect("/");
});

// get profile page
router.get("/profile", isLoggedIn, function (req, res) {
    res.render("user/profile");
});

module.exports = router;

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/");
}

function notLoggedIn(req, res, next) {
    if (!req.isAuthenticated()) {
        return next();
    }
    res.redirect("/");
}