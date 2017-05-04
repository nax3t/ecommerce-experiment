var Product = require("../models/product");

const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/node-ecommerce-test");

var products = [
    new Product({
        imagePath: "/images/alcatraz.jpg",
        title: "Tour of Alcatraz",
        description: "Visit the prison island.",
        basePrice: 10,
        formattedDate: "June 2nd 2017",
        date: "2017-06-02T00:00:00Z",
        time: "9:00 PM",
        stock: 30
    }),
    new Product({
        imagePath: "http://www.freetoursbyfoot.com/wp-content/uploads/2015/09/CitySightseeing-Bus-San-Francisco.jpg",
        title: "Tour of Alcatraz",
        description: "Visit the prison island.",
        basePrice: 10,
        formattedDate: "June 2nd 2017",
        date: "2017-06-02T00:00:00Z",
        time: "9:00 PM",
        stock: 30
    }),
    new Product({
        imagePath: "/images/alcatraz.jpg",
        title: "Tour of Alcatraz",
        description: "Visit the prison island.",
        basePrice: 10,
        formattedDate: "June 2nd 2017",
        date: "2017-06-02T00:00:00Z",
        time: "9:00 PM",
        stock: 30
    }),
    new Product({
        imagePath: "/images/alcatraz.jpg",
        title: "Tour of Alcatraz",
        description: "Visit the prison island.",
        basePrice: 10,
        formattedDate: "June 2nd 2017",
        date: "2017-06-02T00:00:00Z",
        time: "9:00 PM",
        stock: 30
    }),
    new Product({
        imagePath: "http://www.freetoursbyfoot.com/wp-content/uploads/2015/09/CitySightseeing-Bus-San-Francisco.jpg",
        title: "Tour of Alcatraz",
        description: "Visit the prison island.",
        basePrice: 10,
        formattedDate: "June 2nd 2017",
        date: "2017-06-02T00:00:00Z",
        time: "9:00 PM",
        stock: 30
    }),
    new Product({
        imagePath: "/images/alcatraz.jpg",
        title: "Tour of Alcatraz",
        description: "Visit the prison island.",
        basePrice: 10,
        formattedDate: "June 2nd 2017",
        date: "2017-06-02T00:00:00Z",
        time: "9:00 PM",
        stock: 30
    })
];

var done = 0;
for (var i = 0; i < products.length; i++) {
    products[i].save(function (err, result) {
        done++;
        if (done === products.length) {
            exit();
        }
    });
}

function exit() {
    mongoose.disconnect();
    console.log("done");
}

