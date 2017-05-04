var express = require("express");
var router = express.Router();
var csrf = require("csurf");
var passport = require("passport");

var csrfProtection = csrf();
router.use(csrfProtection);

// get home page
router.get("/", function (req, res) {
   res.redirect("/products");
});

// get register page
router.get("/user/register", function (req, res) {
    var messages = req.flash("error");
   res.render("user/register", {csrfToken: req.csrfToken(), messages: messages});
});

// register logic
router.post("/user/register", passport.authenticate("local.singup", {
    successRedirect: "/user/profile",
    failureRedirect: "/user/register",
    failureFlash: true
}));

// get profile page
router.get("/user/profile", function (req, res) {
   res.render("user/profile");
});

// get login page
router.get("/user/login", function (req, res) {
    var messages = req.flash("error");
    res.render("user/login", {csrfToken: req.csrfToken(), messages: messages});
});

// login logic
router.post("/user/login", passport.authenticate("local.signin", {
    successRedirect: "/user/profile",
    failureRedirect: "/user/login",
    failureFlash: true
}));

module.exports = router;