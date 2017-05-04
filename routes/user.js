var express = require("express");
var router = express.Router();
var csrf = require("csurf");
var passport = require("passport");

var csrfProtection = csrf();
router.use(csrfProtection);
var middleware = require("../middleware");

var Cart = require("../models/cart");
var Order = require("../models/order");

// get register page
router.get("/register", middleware.notLoggedIn, function (req, res) {
    var messages = req.flash("error");
    res.render("user/register", {csrfToken: req.csrfToken(), messages: messages});
});

// register logic
router.post("/register", middleware.notLoggedIn, passport.authenticate("local.singup", {
    failureRedirect: "/user/register",
    failureFlash: true
}), function (req, res, next) {
    if (req.session.oldUrl) {
        var oldUrl = req.session.oldUrl;
        req.session.oldUrl = null;
        res.redirect(oldUrl);
    } else {
        res.redirect("/user/profile");
    }
});

// get login page
router.get("/login", middleware.notLoggedIn, function (req, res) {
    var messages = req.flash("error");
    res.render("user/login", {csrfToken: req.csrfToken(), messages: messages});
});

// login logic
router.post("/login", middleware.notLoggedIn, passport.authenticate("local.signin", {
    failureRedirect: "/user/login",
    failureFlash: true
}), function (req, res, next) {
    if (req.session.oldUrl) {
        var oldUrl = req.session.oldUrl;
        req.session.oldUrl = null;
        res.redirect(oldUrl);
    } else {
        res.redirect("/user/profile");
    }
});

// logout
router.get("/logout", middleware.isLoggedIn, function (req, res) {
    req.logout();
    req.flash("success", "You have successfully signed out.")
    res.redirect("/");
});

// get profile page
router.get("/profile", middleware.isLoggedIn, function (req, res) {
    Order.find({user: req.user}, function (err, orders) {
        if (err) {
            console.log(err);
            req.flash("error", "Error fetching user orders.");
            return res.redirect("/products");
        }
        var cart;
        orders.forEach(function (order) {
            cart = new Cart(order.cart);
            order.items = cart.generateArray();
        });
        res.render("user/profile", {orders: orders});
    });
});

module.exports = router;