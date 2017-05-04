var express = require("express");
var router = express.Router();
var keyPublishable = process.env.PUBLISHABLE_KEY;
var stripe = require("stripe")(process.env.SECRET_KEY);

var Cart = require("../models/cart");
var Product = require("../models/product");

// get home page
router.get("/", function (req, res) {
    res.redirect("/products");
});

// add to cart
router.get("/add-to-cart/:id", function (req, res) {
    var productId = req.params.id;

    // if a cart exists pass it, if not pass an empty object
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    // find the product in the db
    Product.findById(productId, function (err, product) {
        if (err) {
            console.log(err);
            return res.redirect("/");
        }
        // adding the product to cart
        cart.add(product, product.id);
        // store cart object in session
        req.session.cart = cart;
        console.log(req.session.cart);
        res.redirect("/");
        // FLASH MSGS...
    });
});

// get the shopping cart view
router.get("/shopping-cart", function (req, res) {
    // if the cart in the session is empty, pass products to view as null
    if  (!req.session.cart) {
        return res.render("products/shopping-cart", {products: null, totalPrice: null});
    }
    // else pass the existing cart
    var cart = new Cart(req.session.cart);
    res.render("products/shopping-cart", {products: cart.generateArray(), totalPrice: cart.totalPrice});
});

// get the cart checkout route
router.get("/checkout", function (req, res, next) {
    if  (!req.session.cart) {
        return res.redirect("/shopping-cart");
    }
    var cart = new Cart(req.session.cart);
    res.render("products/checkout", {keyPublishable: keyPublishable, total: cart.totalPrice});
});

// post route checkout
router.post("/checkout", function (req, res) {
    if  (!req.session.cart) {
        return res.redirect("/shopping-cart");
    }
    var cart = new Cart(req.session.cart);
    stripe.charges.create({
        amount: cart.totalPrice * 100,           // set amount to cart's total price
        currency: "usd",
        source: req.body.stripeToken, // obtained with Stripe.js
        description: "Test Tour Charge"
    }, function(err, charge) {
        // if something went wrong with the purchase
        if (err) {
            req.flash("error", err.message);
            return res.redirect("/checkout");
        }
        // if the purchase is successful
        req.flash("success", "You successfully paid $" + cart.totalPrice + "!");
        req.session.cart = null;
        res.redirect("/products");
    });
});

module.exports = router;