const mongoose = require("mongoose");


//meny schema
const menuSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    category: {
        type: String,
        required: true
    },
    subcategory: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    }
});

//Modell utifrån schemat
const Menu = mongoose.model('Menu', menuSchema);

module.exports = Menu;