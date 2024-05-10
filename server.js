const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;
const url = process.env.MONGO_URL;
app.use(bodyParser.json());
app.use(cors());

//app.use("/api", authRoutes);

//Starta applikationen
app.listen(port, () => {
    console.log("Servern är startad på port: " + port);
})