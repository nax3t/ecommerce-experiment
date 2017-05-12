const express = require("express");
const router = express.Router();
var Category = require("../models/category");
const Product = require("../models/product");
const moment = require("moment");
const stripe = require("stripe")(process.env.SECRET_KEY);
// var middleware = require("../middleware");

router.post("/:id/charge", (req, res) => {
    Product.findById(req.params.id, (err, foundProduct) => {
        if (err) {
            console.log(err);
        } else {
            foundProduct.stock--;
            foundProduct.save();
        }
    });
    let prices = {
        "1-day-big-bus": {
            adults: 140,
            children: 120
        },
        "2-day-big-bus": {
            adults: 180,
            children: 160
        }
    };

    // calculate purchase total
    let adults = prices[req.body["bundled-product"]]["adults"] * Number(req.body.adults);
    let children = prices[req.body["bundled-product"]]["children"] * Number(req.body.children);
    let sum = (adults + children) * 100;

    let amount = sum;
    stripe.customers.create({
        email: req.body.stripeEmail,
        source: req.body.stripeToken
    })
        .then(customer =>
            stripe.charges.create({
                amount,
                description: "Sample Charge",
                currency: "usd",
                customer: customer.id
            }))
        .then((data) => {
            let amount = (data.amount / 100).toFixed(2);
            res.render("charge", {amount: amount});
        });
});

//INDEX - show all products
router.get("/", function (req, res) {
    // Get all products from DB
    Product.find({}, function (err, allProducts) {
        if (err) {
            console.log(err);
        } else {

            res.render("products/index", {products: allProducts});
        }
    });
});

//CREATE - add new product to DB
router.post("/", function (req, res) {
    var category = req.body.selectcategory;
    Category.findById(category, function (err, foundCategory) {
        if (err) {
            console.log(err);
            req.flash("error", "Error finding category");
            res.redirect("/");
        } else {

            var formattedDate = moment(req.body.date).format('MMMM Do YYYY');
            var date = new Date(req.body.date);

            var newProduct = {
                title: req.body.title,
                imagePath: req.body.imagePath,
                description: req.body.description,
                basePrice: req.body.basePrice,
                formattedDate: formattedDate,
                date: date,
                time: req.body.time,
                stock: req.body.stock
            };

            Product.create(newProduct, function (err, newlyCreated) {
                if (err) {
                    console.log(err);
                    req.flash("error", "Error creating product");
                } else {
                    foundCategory.products.push(newlyCreated);
                    foundCategory.save();
                    //redirect back to products page
                    console.log("NEWLY CREATED PRODUCT " + newlyCreated);
                    res.redirect(`/products/${newlyCreated.id}`);
                }
            });
        }
    });
});

//NEW - show form to create new product
router.get("/new", function (req, res) {
    Category.find({}, function (err, allCategories) {
        if (err) {
            console.log(err);
        } else {
            // Find all categories, loop in new.ejs, select menu, save object id in  req body and use it to
            res.render("products/new", {categories: allCategories});
        }
    });
});

// SHOW - shows more info about one product
router.get("/:id", function (req, res) {

    //find the product with provided ID
    Product.findById(req.params.id).populate("category").exec(function (err, foundProduct) {
        if (err) {
            console.log(err);
        } else {
            console.log(foundProduct);
            //render show template with that product
            res.render("products/show", {product: foundProduct});
        }
    });
});

router.get("/:id/edit", function (req, res) {
    Category.find({}, function (err, allCategories) {
        if (err) {
            console.log(err);
        } else {
            //find the product with provided ID
            Product.findById(req.params.id, function (err, foundProduct) {
                if (err) {
                    console.log(err);
                } else {
                    //render show template with that product and all categories
                    res.render("products/edit", {product: foundProduct, categories: allCategories});
                }
            });
        }
    });
});

router.put("/:id", function (req, res) {

    var category = req.body.selectcategory;

    Category.findById(category._id, function (err, foundCategory) {
        if (err) {
            console.log(err);
            req.flash("error", "Error finding category");
            res.redirect("/");
        } else {

            var formattedDate = moment(req.body.date).format('MMMM Do YYYY');
            var date = new Date(req.body.date);

            var newProductData = {
                title: req.body.title,
                imagePath: req.body.imagePath,
                description: req.body.description,
                basePrice: req.body.basePrice,
                formattedDate: formattedDate,
                date: date,
                time: req.body.time,
                stock: req.body.stock
            };
            Product.findByIdAndUpdate(req.params.id, newProductData, {new: true}, function (err, updatedProduct) {
                if (err) {
                    console.log(err);
                    res.redirect("back");
                } else {
                    res.redirect(`/products/${updatedProduct.id}`);
                }
            });
        }
    });
});

module.exports = router;

