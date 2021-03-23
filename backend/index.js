// Imports
const express = require("express");
const path = require("path");
const moment = require("moment");
const axios = require("axios").default;
const fs = require("fs");

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
    // placeholder
    console.log("webhooks endpoint used");
    console.log(req.body);
    res.json({ msg: "ok" });
});

app.post("/api/covid/countries", (req, res) => {
    let readJson = (path) => {
        try {
            return fs.readFileSync(path, "utf8");
        } catch (err) {
            console.error(err);
            return false;
        }
    };

    let covidRead = JSON.parse(
        readJson(path.join(__dirname, "covidData.json"))
    );

    let resCovidData = new Array();

    for (let k = 0; k < req.body.length; k++) {
        // for every country requested
        console.log(`req.body[k].name ${req.body[k].name}`);
        for (let i = 0; i < covidRead.Countries.length; i++) {
            // for every country in the covid data
            if (
                req.body[k].name == covidRead.Countries[i].Country.toLowerCase()
            ) {
                // covid data found for request[k]'s country
                console.log(
                    `Math found for requests: ${
                        req.body[k].name
                    }.  Matching coutnry in covid json: ${covidRead.Countries[
                        i
                    ].Country.toLowerCase()}`
                );
                resCovidData.push(covidRead.Countries[i]);
            }
        }
    }

    console.log(covidRead.Countries[0].Country.toLowerCase());
    console.log(req.body[0].name);
    res.json(resCovidData);
});

// Admin / dev only routes TODO: update this to a webhook
app.get("/api/update", (req, res) => {
    // Get summary covid data
    let covidSummary = [];
    axios.get("https://api.covid19api.com/summary").then((res) => {
        covidSummary = res.data;
        console.log(covidSummary);
        try {
            fs.writeFileSync(
                path.join(__dirname, "covidData.json"),
                JSON.stringify(covidSummary)
            );
            res.json({ msg: "Covid data updated", success: "true" });
        } catch (err) {
            console.error(err);
            res.json({ msg: "Error writing covid data", success: "false" });
        }
    });
});

// Port assignment
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
