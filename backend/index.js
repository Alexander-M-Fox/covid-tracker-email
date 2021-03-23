// Imports
const express = require("express");
const path = require("path");
const moment = require("moment");
const axios = require("axios").default;

// Initialisation
const app = express();

const logger = (req, res, next) => {
    console.log(
        `${req.method}  -  ${req.protocol}://${req.get("host")}${
            req.originalUrl
        }  -  ${moment().format()}`
    );
    next();
};

// Middleware
app.use(express.json());
app.use(logger);

// Routes
app.get("/", (req, res) => {
    // react build's index.html will replace this
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post("/webhook", (req, res) => {
    console.log("webhooks endpoint used");
    console.log(req.body);
    res.json({ msg: "ok" });
});

app.post("/api/covid/countries", (req, res) => {
    console.log(req.body);
    res.json({ msg: "ok" });
});

// Port assignment
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
