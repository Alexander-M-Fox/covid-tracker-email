// Imports
const express = require("express");
const path = require("path");
const moment = require("moment");
const axios = require("axios").default;
const fs = require("fs");
const bodyParser = require("body-parser");
require("dotenv").config();

// Initialisation
const app = express();

const logger = (req, res, next) => {
    console.log(
        `${req.method}  -  ${req.protocol}://${req.get("host")}${
            req.originalUrl
        }  -  ${moment().format()}`,
    );
    next();
};

// Middleware
app.use(express.json());
app.use(logger);
app.use(
    bodyParser.urlencoded({
        extended: true,
    }),
);

// bring covid data in for all endpoints.
let readJson = (path) => {
    try {
        return fs.readFileSync(path, "utf8");
    } catch (err) {
        console.error(err);
        return false;
    }
};

let covidRead = JSON.parse(readJson(path.join(__dirname, "covidData.json")));

// add commas to numbers to enhance readability.
let addCommas = (intIn) => {
    return intIn.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// Routes
app.get("/", (req, res) => {
    // react build's index.html will replace this
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post("/webhook", (req, res) => {
    // placeholder
    res.json({ msg: "ok" });
});

app.post("/api/covid/countries", (req, res) => {
    let resCovidData = new Array();

    for (let k = 0; k < req.body.length; k++) {
        // for every country requested
        console.log(`req.body[k].name ${req.body[k].name}`);
        for (let i = 0; i < covidRead.length; i++) {
            // for every country in the covid data
            if (req.body[k].name == covidRead[i].country.toLowerCase()) {
                // covid data found for request[k]'s country
                console.log(
                    `Math found for requests: ${
                        req.body[k].name
                    }.  Matching coutnry in covid json: ${covidRead[
                        i
                    ].country.toLowerCase()}`,
                );
                resCovidData.push(covidRead[i]);
            }
        }
    }
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
                JSON.stringify(covidSummary),
            );
            res.json({ msg: "Covid data updated", success: "true" });
        } catch (err) {
            console.error(err);
            res.json({ msg: "Error writing covid data", success: "false" });
        }
    });
});

app.post("/api/discord", async (req, res) => {
    // TODO: Input santitation

    // last updated
    let epoch = covidRead[0].updated;
    let d = new Date(epoch);
    let lastUpdated = `${d.toLocaleDateString()} at ${d.toLocaleTimeString()}`;

    let fields = [
        {
            name: "Last Updated:",
            value: lastUpdated,
        },
    ];

    let targetURL = req.body.discord;
    for (country in req.body.countries) {
        fields.push(
            {
                name: "Country name",
                value: "=======",
            },
            {
                name: "`New Cases`",
                value: "todayCases",
                inline: true,
            },
            {
                name: "`New Deaths`",
                value: "todayDeaths",
                inline: true,
            },
        );
        for (countryObj in covidRead) {
            if (
                req.body.countries[country].name ===
                covidRead[countryObj].country.toLowerCase()
            ) {
                // country name
                fields[country * 3 + 1].name = covidRead[countryObj].country;
                // new cases
                fields[country * 3 + 2].value = addCommas(
                    covidRead[countryObj].todayCases,
                );
                // new deaths
                fields[country * 3 + 3].value = addCommas(
                    covidRead[countryObj].todayDeaths,
                );
            }
        }
    }
    let discordData = JSON.stringify({
        username: "Covid Tracker",
        avatar_url: "https://i.imgur.com/ByNoBIl.png",
        embeds: [
            {
                title: "Daily Covid Update",
                url: "https://disease.sh/docs/",
                description:
                    "Figures may vary slightly from your county's official portal.",
                color: 2533597,
                fields: fields,
                thumbnail: {
                    url: "https://upload.wikimedia.org/wikipedia/commons/3/38/4-Nature-Wallpapers-2014-1_ukaavUI.jpg",
                },
                image: {
                    url: "https://upload.wikimedia.org/wikipedia/commons/5/5a/A_picture_from_China_every_day_108.jpg",
                },
                footer: {
                    text: "Data sourced from https://disease.sh/docs/ (click title to follow link)",
                    icon_url:
                        "https://copyright.co.uk/images/copyright-symbol.png",
                },
            },
        ],
    });

    let discordConfig = {
        method: "post",
        url: targetURL,
        headers: {
            "Content-Type": "application/json",
        },
        data: discordData,
    };

    axios(discordConfig)
        .then(function (response) {
            console.log(JSON.stringify(response.data));
            res.send("true");
        })
        .catch(function (error) {
            console.log(error);
            res.send("false");
        });

    // res.json(req.body);
});

app.get("/admin/createCountryList", (req, res) => {
    // read covidData.json

    let readJson = (path) => {
        try {
            return fs.readFileSync(path, "utf8");
        } catch (err) {
            console.error(err);
            return false;
        }
    };

    let covidRead = JSON.parse(
        readJson(path.join(__dirname, "covidData.json")),
    );

    // extrapolate countries from covidData.json

    let countries = [];

    for (let i = 0; i < covidRead.length; i++) {
        countries.push({
            name: covidRead[i].country,
            iso2: covidRead[i].countryInfo.iso2,
            iso3: covidRead[i].countryInfo.iso3,
        });
    }

    // write the countries out in a different file

    try {
        fs.writeFileSync(
            path.join(__dirname, "countries.json"),
            JSON.stringify(countries),
        );
        res.json({ msg: "Covid data updated", success: "true" });
    } catch (err) {
        console.error(err);
        res.json({ msg: "Error writing covid data", success: "false" });
    }
});

// Port assignment
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
