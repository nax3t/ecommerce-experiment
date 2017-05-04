var express = require("express");
var router = express.Router();
var csrf = require("csurf");
var passport = require("passport");

var csrfProtection = csrf();
router.use(csrfProtection);

// GET home page
router.get("/", function (req, res) {
   res.redirect("/products");
});

router.get("/user/register", function (req, res) {
    var messages = req.flash("error");
   res.render("user/register", {csrfToken: req.csrfToken(), messages: messages});
});

router.post("/user/register", passport.authenticate("local.singup", {
    successRedirect: "/user/profile",
    failureRedirect: "/user/register",
    failureFlash: true
}));

router.get("/user/profile", function (req, res) {
   res.render("user/profile");
});

module.exports = router;