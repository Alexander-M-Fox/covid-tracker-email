const express = require("express");
const router = express.Router();
const axios = require("axios").default;
const { pool } = require("../dbConfig");
require("dotenv").config();
const {
    blockNotAuthenticated,
    covidRead,
    postDiscordWebhook,
} = require("../commonFunctions");

//#region
/**
 * @param {string} description - Server sends custom discord message containing data on user's selected countries.
 * @param {string} [inputs] discord - Discord webhook URL for the server to send message to.
 * @param {string} [inputs] compareList - JSON array of objects in format [{ "name": "countryname1" }, { "name": "countryname2" }]
 * @param {string} [outputs] true - Sent if discord message was sent successfully.
 * @param {string} [outputs] false - Sent if discord message was NOT sent successfully.
 */
//#endregion
router.get("/fetchSettings", blockNotAuthenticated, async (req, res) => {
    const userID = req.user.acc_id;

    let promises = [];

    // see if user already has webhook
    const webhookQuery = pool.query(
        `SELECT webhook_url
	            FROM webhook_tbl
	            WHERE acc_id=$1`,
        [userID],
    );

    promises.push(webhookQuery);

    const accountQuery = pool.query(
        `
        SELECT send_emails FROM account_tbl WHERE acc_id=$1;
        `,
        [userID],
    );

    promises.push(accountQuery);

    let returnData = {};

    try {
        // used var so responses can be accessed outside try catch
        var responses = await Promise.all(promises);
    } catch (error) {
        res.send("error");
        console.error(error);
    }

    if (responses[0].rows.length > 0) {
        console.log("webhook for that user found");

        returnData.webhook = true;
        returnData.webhookData = responses[0].rows[0].webhook_url;
    }

    if (responses[1].rows.length > 0) {
        console.log("user has an account");
        returnData.sendEmails = responses[1].rows[0].send_emails;
    }

    console.log("return data:");
    console.log(returnData);

    res.send(returnData);
});

module.exports = router;
