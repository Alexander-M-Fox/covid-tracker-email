const express = require("express");
const router = express.Router();

router.get("/checkAuth", (req, res) => {
    if (req.isAuthenticated()) {
        return res.send("true");
    }
    return res.send("false");
});

module.exports = router;
