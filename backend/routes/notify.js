const express = require("express");
const router = express.Router();
const axios = require("axios").default;
const { pool } = require("../dbConfig");
require("dotenv").config();
const { blockNotAuthenticated, covidRead } = require("../commonFunctions");

// add commas to numbers to enhance readability.
let addCommas = (intIn) => {
    return intIn.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

//#region
/**
 * @param {string} description - Server sends custom discord message containing data on user's selected countries.
 * @param {string} [inputs] discord - Discord webhook URL for the server to send message to.
 * @param {string} [inputs] compareList - JSON array of objects in format [{ "name": "countryname1" }, { "name": "countryname2" }]
 * @param {string} [outputs] true - Sent if discord message was sent successfully.
 * @param {string} [outputs] false - Sent if discord message was NOT sent successfully.
 */
//#endregion
router.post("/notify", blockNotAuthenticated, async (req, res) => {
    // TODO: Input santitation
    if (req.body.countries.length === 0) {
        return res.send("No countries selected");
    }

    // last updated
    let epoch = covidRead[0].updated;
    let d = new Date(epoch);
    let lastUpdated = `${d.toLocaleDateString()} at ${d.toLocaleTimeString()}`;

    let promises = [];

    console.log(req.user.acc_id);

    // if user selected discord
    if (
        req.body.discord !== undefined &&
        req.body.discord !== "enter discord webhook"
    ) {
        // sanitation
        let regex = "^https://discord.com/api/webhooks/";
        let webhookSanitation = new RegExp(regex);
        if (!webhookSanitation.test(req.body.discord)) {
            console.log("sanitation invalid");
            return res.send("Webhook link invalid");
        }

        if (req.body.daily) {
            // add webhook to db
            pool.query(
                `SELECT webhook_url, acc_id
	            FROM webhook_tbl
	            WHERE acc_id=$1
                AND webhook_url=$2;`,
            ),
                [req.user.acc_id, req.body.discord],
                (err, results) => {
                    if (err) {
                        console.log("error selecting webhook table");
                        throw error;
                    }
                    if (results.rows.length > 0) {
                        console.log("webhook already in db");
                    } else {
                        pool.query(
                            `INSERT INTO webhook_tbl(
	                        webhook_url, acc_id)
	                        VALUES ($1, $2);`,
                            [req.body.discord, req.user.acc_id],
                            (err, results) => {
                                if (err) {
                                    console.log("error adding webhook to db");
                                    throw err;
                                }
                                console.log("webhook added to db");
                            },
                        );
                    }
                };
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

        const discordQuery = axios(discordConfig);

        promises.push(discordQuery);
    }
    let dailyEmails = false;
    if (req.body.sendEmails && req.body.daily) {
        dailyEmails = true;
    }
    const accQuery = pool.query(
        `UPDATE account_tbl
	SET send_emails=$1
	WHERE acc_id=$2;`,
        [dailyEmails, req.user.acc_id],
    );
    promises.push(accQuery);

    try {
        const responses = await Promise.all(promises);
        res.send("true");
    } catch (error) {
        console.error(error);
        res.send("something went wrong");
    }
});

module.exports = router;
