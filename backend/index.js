// Imports
const express = require("express");
const path = require("path");

// Initialisation
const app = express();

// Middleware
app.use(express.json());

// Routes
app.get("/", (req, res) => {
    // react build's index.html will replace this
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post("/webhook", (req, res) => {
    res.json(req.body);
});

// Port assignment
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
