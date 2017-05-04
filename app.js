// dot env
require('dotenv').config();
const keyPublishable = process.env.PUBLISHABLE_KEY;

const express = require("express");
const app = express();
const engine = require('ejs-mate');
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const session = require("express-session");
const passport = require("passport");
const flash = require("connect-flash");
const validator = require("express-validator");
const MongoStore = require("connect-mongo")(session);

const productRoutes = require("./routes/products");
const indexRoutes = require("./routes/index");
const userRoutes = require("./routes/user");



mongoose.Promise = global.Promise;
mongoose.connect(process.env.DATABASEURL);
require("./config/passport");
// mongoose.connect("mongodb://localhost/node-ecommerce-test");

// parse application/x-www-form-urlencoded
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(validator());

// use ejs-locals for all ejs templates: 
app.engine('ejs', engine);

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(methodOverride('_method'));
app.use(cookieParser());

// session setup
app.use(session({
    secret: "SuperSecretStuff",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    cookie: { maxAge: 180 * 60 * 1000 }    // 180 minutes session expiration
}));
app.use(flash());

// passport setup
app.use(passport.initialize());
app.use(passport.session());

// passing publishable key to every template
app.use(function(req, res, next) {
  app.locals.keyPublishable = keyPublishable;
  next();
});

// passing currentUser to every template
app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    next();
});

app.use(function(req, res, next) {
    res.locals.session = req.session;
    next();
});

// use routes
app.use(indexRoutes);
app.use("/user", userRoutes);
app.use("/products", productRoutes);

app.listen(3000, () => {
	console.log('Server running, listening on port 3000');
});