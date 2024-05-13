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
router.post("/menu", authenticateToken, async (req, res) => {
    try {
        // Skapa ett nytt jobbobjekt med data från begäran
        const newItem = new Menu({
            name: req.body.name,
            category: req.body.category,
            subcategory: req.body.subcategory,
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

router.get("/menu", async (req, res) => {
    try {
        // Hämta alla jobb från databasen
        const menus = await Menu.find();

        res.json(menus);
    } catch (error) {
        console.error("Fel vid hämtning av menyobjekt:", error);
        res.status(500).json({ message: "Ett fel uppstod när jobben skulle hämtas från databasen." });
    }
});

// PUT för att uppdatera en befintlig jobbpost
router.put("/menu/:id", authenticateToken, async (req, res) => {
    try {
        const itemId = req.params.id;
        const updatedItem = req.body;

        const result = await Menu.findByIdAndUpdate(itemId, updatedItem, { new: true });

        return res.json(result);
    } catch (error) {
        return res.status(400).json({ message: "Det uppstod ett fel vid uppdatering av menyobjektet.", error: error });
    }
});

// DELETE för att ta bort en befintlig jobbpost
router.delete("/menu/:id", authenticateToken, async (req, res) => {
    try {
        const itemId = req.params.id;

        const result = await Menu.findByIdAndDelete(itemId);

        if (!result) {
            return res.status(404).json({ message: "Menyobjektet hittades inte..." });
        }

        return res.json({ message: "Menyobjektet har tagits bort." });
    } catch (error) {
        return res.status(400).json({ message: "Det uppstod ett fel vid borttagning av menyobjektet.", error: error });
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