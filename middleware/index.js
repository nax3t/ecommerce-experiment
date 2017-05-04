

var middlewareObj = {};

// check if the user is logged in
middlewareObj.isLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.session.oldUrl = req.url;
    req.flash("error", "You need to sign in.");
    res.redirect("/user/login");
};

// chekc if the user is not logged in
middlewareObj.notLoggedIn = function (req, res, next) {
    if (!req.isAuthenticated()) {
        return next();
    }
    req.flash("success", "You are already signed in.");
    res.redirect("/products");
};

module.exports = middlewareObj;