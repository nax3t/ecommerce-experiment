var express = require("express");
var router = express.Router();

var Category = require("../models/category");
var Product = require("../models/product");

var middleware = require("../middleware");

// INDEX
router.get("/", function (req, res) {
    Category.find({}, function (err, allCategories) {
        if (err) {
            console.log(err);
        } else {
            res.render("landing", {categories: allCategories});
        }
    });
});


// CREATE - ADD NEW CATEGORY
router.post("/", function (req, res) {
    var title = req.body.title;
    var imagePath = req.body.imagePath;
    var newCategory = {title: title, imagePath: imagePath};
    // Create a new product and save to DB
    Category.create(newCategory, function (err, newlyCreated) {
        if (err) {
            console.log(err);
        } else {
            //redirect back to products page
            console.log("Category created: " + newlyCreated);
            res.redirect("/");
        }
    });
});

// NEW - show form to create new category
router.get("/new", function (req, res) {
    res.render("categories/new");
});

// SHOW - show category page with it's products
router.get("/:id", function (req, res) {
    Category.findById(req.params.id).populate("products").exec(function (err, foundCategory) {
        if (err) {
            console.log(err);
            req.flash("error", "Something went wrong, category not found.");
            res.redirect("/");
        } else {
            res.render("products/index", {products: foundCategory.products});
        }
    });
});

// GET EDIT CATEGORY FORM
router.get("/:id/edit", function (req, res) {

    Category.findById(req.params.id, function (err, foundCategory) {
        if (err) {
            console.log(err);
        } else {

            res.render("categories/edit", {category: foundCategory});
        }
    });
});

// UPDATE CATEGORY
router.put("/:id", function (req, res) {
    var title = req.body.title;
    var imagePath = req.body.imagePath;
    var updatedCategory = {title: title, imagePath: imagePath};
    // Create a new product and save to DB
    Category.findByIdAndUpdate(req.params.id, updatedCategory, function (err, updatedCategory) {
        if (err) {
            console.log(err);
        } else {
            //redirect back to products page
            console.log("Category updated: " + updatedCategory);
            req.flash("success", "Category successfully updated.");
            res.redirect("/");
        }
    });
});

// DESTROY - delete category

router.delete("/:id", function (req, res) {
    Category.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            req.flash("error", "Something went wrong, not deleted.");
            res.redirect("/");
        } else {
            req.flash("success", "Category successfully deleted.");
            res.redirect("/");
        }
    })
});







module.exports = router;