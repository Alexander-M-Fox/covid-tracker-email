// Imports
//#region
const express = require("express");
const path = require("path");
const moment = require("moment");
const axios = require("axios").default;
const fs = require("fs");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const CronJob = require("cron").CronJob;
const { pool } = require("./dbConfig");
const bcrypt = require("bcrypt");
const passport = require("passport");
const session = require("express-session");
require("dotenv").config();
const initializePassport = require("./passportConfig");
const uuidv4 = require("uuid").v4;
//#endregion

// Initialisation
const app = express();
initializePassport(passport);

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

// Passport and session management
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
    }),
);
app.use(passport.initialize());
app.use(passport.session());

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

// OAuth2 Config
const OAuth2_client = new OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
);
OAuth2_client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

// Send mail function
const sendMail = (recipient, html) => {
    const accessToken = OAuth2_client.getAccessToken();

    const transport = nodemailer.createTransport({
        service: "gmail",
        auth: {
            type: "OAuth2",
            user: process.env.USER,
            clientId: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            refreshToken: process.env.REFRESH_TOKEN,
            accessToken: accessToken,
        },
    });

    const mail_options = {
        from: `Covid Tracker Email <${process.env.USER}>`,
        to: recipient,
        subject: "Daily Covid Stats Update",
        html: html,
    };

    transport.sendMail(mail_options, (err, result) => {
        if (err) {
            console.error(err);
        } else {
            console.log("mail sent");
        }
        transport.close();
    });
};

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

//#region
/**
 * @param {string} description - Placeholder route for frontend react build index.html
 */
//#endregion
app.get("/", (req, res) => {
    // react build's index.html will replace this
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/api/checkAuth", (req, res) => {
    if (req.isAuthenticated()) {
        return res.send("true");
    }
    return res.send("false");
});

//#region
/**
 * @param {string} description - Register a new user in the database
 * @param {string} [inputs] email - Email that the user optionally wants covid data sent to.
 * @param {string} [inputs] password - Password string of at least 8 characters.
 * @param {string} [inputs] password2 - Confirm password.  Must be the same as password.
 * @param {string} [inputs] acc_name - Name the user wants the system to refer to them as.  NOT used as primary or secondary key (therefore duplicates are allowed).
 * @param {string} [inputs] send_emails - Boolean.  If true server will send this user daily emails containing covid data about their selected contries.
 * @param {string} [outputs] success - Boolean, if false check error message.
 * @param {string} [outputs] msg - Message describing handling of request.
 */
//#endregion
app.post("/api/register", blockAuthenticated, async (req, res) => {
    let { email, password, password2, acc_name, send_emails } = req.body;
    let acc_id = uuidv4();

    let errors = [];

    if (!email || !password || !password2 || !acc_name || !send_emails) {
        errors.push({
            msg: "1 or more fields left empty",
        });
    }

    if (password.length < 8) {
        errors.push({
            msg: "Password should be at least 8 characters",
        });
    }

    if (password != password2) {
        errors.push({
            msg: "Passwords do not match",
        });
    }

    if (errors.length > 0) {
        return res.send({
            success: false,
            errors: errors,
        });
    } else {
        // validation passed
        let hashedPassword = await bcrypt.hash(password, 10);
        pool.query(
            `SELECT * FROM account_tbl WHERE email = $1`,
            [email],
            (err, results) => {
                if (err) {
                    throw err;
                }

                if (results.rows.length > 0) {
                    // user already registered
                    errors.push({
                        msg: "Email already registered",
                    });
                    return res.send({
                        success: false,
                        errors: errors,
                    });
                }

                pool.query(
                    `
                        INSERT INTO account_tbl(acc_id, email, password, acc_name, send_emails)
	                    VALUES ($1, $2, $3, $4, $5)
                        RETURNING acc_id, email;`,
                    [acc_id, email, hashedPassword, acc_name, send_emails],
                    (err, results) => {
                        if (err) {
                            throw err;
                        }
                        res.send({
                            success: true,
                            msg: `user created, with email ${email}`,
                        });
                    },
                );
            },
        );
    }
});

app.post(
    "/api/login",
    blockAuthenticated,
    passport.authenticate("local"),
    async (req, res) => {
        pool.query(
            `SELECT email
        FROM account_tbl
        WHERE email=$1;`,
            [req.body.email],
            (err, results) => {
                if (err) {
                    throw err;
                }
                if (results.rows.length == 0) {
                    return res.send({
                        success: false,
                        msg: "login worked, but cant find userID for that email",
                    });
                }
                res.send({
                    success: true,
                    msg: "logged in",
                    email: results.rows[0]["email"],
                });
            },
        );
    },
);

//#region
/**
 * @param {string} description - Placeholder route for 3rd party API to update server's covid stats.  Not currently used in this version.
 * @param {string} [inputs] TBD - Feature not in use
 * @param {string} [outputs] TBD - Feature not in use
 */
//#endregion
app.post("/webhook", (req, res) => {
    // placeholder
    res.json({ msg: "ok" });
});

//#region
/**
 * @param {string} description - Returns COVID data for given countries.
 * @param {string} [inputs] compareList - JSON array of objects in format [{ "name": "countryname1" }, { "name": "countryname2" }]
 * @param {string} [outputs] resCovidData - JSON array of objects [ { country1_covid_data }, { country2_covid_data } ]
 */
//#endregion
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

//#region
/**
 * @param {string} description - Admin route to manually force server's covid data to update itself with disease.sh's API
 * @param {string} [inputs] N/A - None.
 * @param {string} [outputs] success - If false see msg.
 * @param {string} [outputs] msg - Describes handling of request.
 */
//#endregion
app.get(
    "/admin/update",
    (updateData = (req, res) => {
        // Get summary covid data
        let covidSummary = [];
        axios.get("https://disease.sh/v3/covid-19/countries").then((res2) => {
            covidSummary = res2.data;
            try {
                fs.writeFileSync(
                    path.join(__dirname, "covidData.json"),
                    JSON.stringify(covidSummary),
                );
                console.log("data updated");
                if (res) {
                    res.json({ msg: "Covid data updated", success: "true" });
                }
            } catch (err) {
                console.error(err);
                if (res) {
                    res.json({
                        msg: "Error writing covid data",
                        success: "false",
                    });
                }
            }
        });
    }),
);

// update covid data daily (@ 01:10 local time each day)
const job = new CronJob("0 10 1 * * *", () => updateData()).start();

app.get("/api/email", (req, res) => {
    let thisHtml = `
    <!DOCTYPE html>
    <head>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css" integrity="sha384-KyZXEAg3QhqLMpG8r+8fhAXLRk2vvoC2f3B09zVXn8CA5QIVfZOJ3BCsw2P0p/We" crossorigin="anonymous">
    
    </head>
    <body>
    <h3>Testing</h3>
    <p>This is a test email.</p>
    </body>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/js/bootstrap.min.js" integrity="sha384-cn7l7gDp0eyniUwwAZgrzD06kc/tftFf19TOAs2zVinnD/C7E91j9yyk5//jjpt/" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/js/bootstrap.bundle.min.js" integrity="sha384-U1DAWAznBHeqEIlVSCgzq+c9gqGAJn5c/t99JyeKa9xxaYpSvHU5awsuZVVFIhvj" crossorigin="anonymous"></script>
    </html>
    `;
    sendMail("petepom224@697av.com", thisHtml);

    res.send("ok");
});

//#region
/**
 * @param {string} description - Server sends custom discord message containing data on user's selected countries.
 * @param {string} [inputs] discord - Discord webhook URL for the server to send message to.
 * @param {string} [inputs] compareList - JSON array of objects in format [{ "name": "countryname1" }, { "name": "countryname2" }]
 * @param {string} [outputs] true - Sent if discord message was sent successfully.
 * @param {string} [outputs] false - Sent if discord message was NOT sent successfully.
 */
//#endregion
app.post("/api/notify", blockNotAuthenticated, async (req, res) => {
    // TODO: Input santitation
    if (req.body.countries.length === 0) {
        return res.send("No countries selected");
    }

    // last updated
    let epoch = covidRead[0].updated;
    let d = new Date(epoch);
    let lastUpdated = `${d.toLocaleDateString()} at ${d.toLocaleTimeString()}`;

    // if user selected discord
    console.log(`req.body.discord = ${req.body.discord}`);
    if (
        req.body.discord !== undefined &&
        req.body.discord !== "enter discord webhook"
    ) {
        let regex = "^https://discord.com/api/webhooks/";
        let webhookSanitation = new RegExp(regex);
        if (!webhookSanitation.test(req.body.discord)) {
            return res.send("Webhook link invalid");
        }

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
                    name: "`Country name`",
                    value: "=======",
                },
                {
                    name: "New Cases",
                    value: "todayCases",
                    inline: true,
                },
                {
                    name: "New Deaths",
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
                    fields[
                        country * 3 + 1
                    ].name = `\`${covidRead[countryObj].country}\``;
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
                res.send("true");
            })
            .catch(function (error) {
                console.log(error);
                res.send("false");
            });
    } else {
        pool.query(
            `UPDATE account_tbl
	SET send_emails=$1
	WHERE acc_id=$2;`,
            [req.body.sendEmails, req.user.acc_id],
            (err, results) => {
                if (err) {
                    throw err;
                }
                res.send("true");
            },
        );
    }
});

//#region
/**
 * @param {string} description - Admin route to create a list of countries with no data attached to be used with frontend country search suggestions.  THis list is created as a local file on the server, NOT sent back to the frontend.
 * @param {string} [inputs] N/A - None.
 * @param {string} [outputs] success - If false see msg.
 * @param {string} [outputs] msg - Describes handling of request.
 */
//#endregion
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
