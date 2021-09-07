const path = require("path");
const fs = require("fs");

function blockAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.send("you are already logged in");
    }
    next();
}

function blockNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.send("no auth");
}

let readJson = (path) => {
    try {
        return fs.readFileSync(path, "utf8");
    } catch (err) {
        console.error(err);
        return false;
    }
};

let covidRead = JSON.parse(readJson(path.join(__dirname, "covidData.json")));

module.exports = {
    blockAuthenticated,
    blockNotAuthenticated,
    covidRead,
    readJson,
};
