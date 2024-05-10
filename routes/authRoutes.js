//Routes för auth
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken")
require("dotenv").config();

//Koppla till MongoDB
mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log("Kopplad till MongoDB-databasen.")
}).catch((error) => {
    console.error("Fel vid koppling till databasen...")
});


//Användar model
const User = require("../models/User");

//Lägg till ny användare
router.post("/register", async (req, res) => {
    try {
        const { username, password } = req.body;

        //Validera input
        if (!username || !password) {
            return res.status(400).json({ error: "Felaktig inmatning, skriv in användarnamn och lösenord..." });
        }

        //Kontrollerar användarnamnets längd
        if (username.length < 5) {
            return res.status(400).json({ error: "Användarnamnet måste vara minst fem tecken långt." });
        }

        //Kontrollerar att lösenordet har minst en stor bokstav, minst en siffra och minst sex tecken långt
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{6,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({ error: "Lösenordet måste innehålla minst en stor bokstav, minst en siffra och vara minst sex tecken långt." });
        }

        // Kontrollerar om användarnamnet redan finns i databasen
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: "Användarnamnet är redan taget." });
        }

        //Om inmatning är korrekt
        const user = new User({ username, password });
        await user.save();

        const payload = { username: username };
        const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
        const response = {
            message: "Användare skapad och inloggad",
            token: token
        }
        res.status(201).json({ response });

    } catch {
        res.status(500).json({ error: "Server error" });
    }
});

//Logga in användare
router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        //Validera input
        //VIDAREUTVECKLA!!!
        if (!username || !password) {
            return res.status(400).json({ error: "Felaktig inmatning, skriv in användarnamn och lösenord..." })
        }

        //Kontrollerar om användaren existerar 
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ error: "Felaktigt användarnamn/lösenord!" });
        }

        //Kontrollera lösenord
        const isPasswordMatch = await user.comparePassword(password);
        if (!isPasswordMatch) {
            return res.status(401).json({ error: "Felaktigt användarnamn/lösenord!" });
        } else {
            const payload = { username: username };
            const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '3h' });
            const response = {
                message: "Användare inloggad",
                token: token
            }
            res.status(200).json({ response });
        }


    } catch {
        res.status(500).json({ error: "Server error" });
    }
})

module.exports = router;