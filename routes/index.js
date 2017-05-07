var express = require("express");
var router = express.Router();
var keyPublishable = process.env.PUBLISHABLE_KEY;
var stripe = require("stripe")(process.env.SECRET_KEY);

var Cart = require("../models/cart");
var Product = require("../models/product");
var Order = require("../models/order");
var middleware = require("../middleware");

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

        // Z-REMOVING FROM PRODUCT STOCK AFTER ADDING TO CART
        console.log("ADD TO CART - Stock went from: " + product.stock);
        product.stock--;
        product.save();
        console.log("ADD TO CART - Stock went to: " + product.stock);

        // console.log(req.session.cart);
        res.redirect("/");
        // FLASH MSGS...
    });
});

// remove one unit from cart
router.get("/reduce/:id", function (req, res) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    Product.findById(productId, function (err, product) {
        if (err) {
            console.log(err);
            return res.redirect("/");
        }

        cart.reduceByOne(productId);
        req.session.cart = cart;

        console.log("REMOVE 1 FROM CART - Stock went from: " + product.stock);
        product.stock++;
        product.save();
        console.log("REMOVE 1 FROM CART - Stock went to: " + product.stock);

        res.redirect("/shopping-cart");

    });
});

// remove all units from cart
router.get("/remove/:id", function (req, res) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    Product.findById(productId, function (err, product) {
        if (err) {
            console.log(err);
            return res.redirect("/");
        }

        var removedQty = cart.items[productId].qty;
        console.log("REMOVE ALL FROM CHAT - Stock to return: " + removedQty);

        cart.removeItem(productId);
        req.session.cart = cart;

        console.log("REMOVE ALL FROM CART - Stock went from: " + product.stock);
        product.stock += removedQty;
        product.save();
        console.log("REMOVE ALL FROM CART - Stock went to: " + product.stock);

        res.redirect("/shopping-cart");

    });
});

// get the shopping cart view
router.get("/shopping-cart", function (req, res) {
    // if the cart in the session is empty, pass products to view as null
    if (!req.session.cart) {
        return res.render("products/shopping-cart", {products: null, totalPrice: null});
    }
    // else pass the existing cart
    var cart = new Cart(req.session.cart);
    res.render("products/shopping-cart", {products: cart.generateArray(), totalPrice: cart.totalPrice});
});

// get the cart checkout route
router.get("/checkout", middleware.isLoggedIn, function (req, res, next) {
    if (!req.session.cart) {
        req.flash("error", "Your cart is empty!");
        return res.redirect("/shopping-cart");
    }
    var cart = new Cart(req.session.cart);
    res.render("products/checkout", {keyPublishable: keyPublishable, total: cart.totalPrice});
});

// post route checkout - CHARGE
router.post("/checkout", middleware.isLoggedIn, function (req, res) {
    if (!req.session.cart) {
        return res.redirect("/shopping-cart");
    }
    var cart = new Cart(req.session.cart);
    stripe.charges.create({
        amount: cart.totalPrice * 100,           // set amount to cart's total price
        currency: "usd",
        source: req.body.stripeToken, // obtained with Stripe.js
        description: "Test Tour Charge"
    }, function (err, charge) {
        // if something went wrong with the purchase
        if (err) {
            req.flash("error", err.message);
            return res.redirect("/checkout");
        }
        // if the purchase is successful

        // creating new order and saving it to the database
        var order = new Order({
            user: req.user,
            cart: cart,
            address: req.body.address,
            name: req.body.name,
            email: req.user.email,
            paymentId: charge.id
        });
        order.save(function (err, result) {
            if (err) {
                console.log(err);
                req.flash("error", "Something went wrong with saving your order.");
                return res.redirect("/products");
            }
            req.flash("success", "You successfully paid $" + cart.totalPrice + "!");
            req.session.cart = null;
            res.redirect("/products");
        });
    });
});

module.exports = router;