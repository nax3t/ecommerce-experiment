var mongoose = require("mongoose");

var categorySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    imagePath: {
        type: String
    },
    products: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product"
        }
    ]
    });

// "products" : [ ObjectId("590a66573e91df060c2a1ffe") ],


// db.categories.update({ _id: ObjectId("5913b033373fc4273c6d43c5") }, { $set: {products: [ ObjectId("590a66573e91df060c2a1ffe") ]}})

module.exports = mongoose.model("Category", categorySchema);