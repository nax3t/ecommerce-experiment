var mongoose = require("mongoose");

var productSchema = new mongoose.Schema({
    imagePath: {type: String, required: true},
    title:  {type: String, required: true},
    description: {type: String, required: true},
    basePrice: {type: Number, required: true},
    formattedDate: {type: String, required: true},
    date: {type: Date, required: true},
    time: {type: String, required: true},
    stock: {type: Number, required: true}
});

module.exports = mongoose.model("Product", productSchema);