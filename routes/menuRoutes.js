const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
require("dotenv").config();

//Koppla till MongoDB
mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log("Kopplad till MongoDB-databasen.")
}).catch((error) => {
    console.error("Fel vid koppling till databasen...")
});

//Meny model
const Menu = require("../models/Menu");

//Lägg till nytt på menyn
router.post("/menu", async (req, res) => {
    try {
        // Skapa ett nytt jobbobjekt med data från begäran
        const newItem = new Menu({
            name: req.body.name,
            category: req.body.category,
            price: req.body.price,
            description: req.body.description,
        });

        // Spara det nya jobbet i databasen
        await newItem.save();

        res.status(201).json({ message: "Menybjektet har lagts till i databasen." });
    } catch (error) {
        console.error("Fel vid tillägg:", error);
        res.status(500).json({ message: "Ett fel uppstod när menyobjektet skulle läggas till i databasen." });
    }
});

router.get("/menu", authenticateToken, async (req, res) => {
    try {
        // Hämta alla jobb från databasen
        const menus = await Menu.find();

        res.json(menus);
    } catch (error) {
        console.error("Fel vid hämtning av menyobjekt:", error);
        res.status(500).json({ message: "Ett fel uppstod när jobben skulle hämtas från databasen." });
    }
});

// Middleware för att verifiera JWT
async function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.status(401).json({ message: "Du har ej tillgång till denna route - token saknas."});

    jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, username) => {
        if (err) return res.status(403).json({ message: "Ogiltig JWT"});

        req.username = username;

        next();
    });
}

module.exports = router;