const express = require("express");
const router = express.Router();
const path = require("path");

//#region
/**
 * @param {string} description - Placeholder route for frontend react build index.html
 */
//#endregion
router.get("/", (req, res) => {
    // react build's index.html will replace this
    res.sendFile(path.join(__dirname, "../public/index.html"));
});

module.exports = router;
