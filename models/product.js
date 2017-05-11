var mongoose = require("mongoose");

var productSchema = new mongoose.Schema({
    imagePath: {type: String, required: false},
    title:  {type: String, required: false},
    description: {type: String, required: false},
    basePrice: {type: Number, required: false},
    formattedDate: {type: String, required: true},
    date: {type: Date, required: true},
    time: {type: String, required: true},
    stock: {type: Number, required: true},
    category: [
     {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category"
    }
    ]
});

module.exports = mongoose.model("Product", productSchema);