const express = require('express');
const router = express.Router();
const axios = require('axios').default;
const { pool } = require('../dbConfig');
require('dotenv').config();
const {
  blockNotAuthenticated,
  covidRead,
  postDiscordWebhook,
} = require('../commonFunctions');

//#region
/**
 * @param {string} description - Server sends custom discord message containing data on user's selected countries.
 * @param {string} [inputs] discord - Discord webhook URL for the server to send message to.
 * @param {string} [inputs] compareList - JSON array of objects in format [{ "name": "countryname1" }, { "name": "countryname2" }]
 * @param {string} [outputs] true - Sent if discord message was sent successfully.
 * @param {string} [outputs] false - Sent if discord message was NOT sent successfully.
 */
//#endregion
router.post('/notify', blockNotAuthenticated, async (req, res) => {
  const userID = req.user.acc_id;
  const discord = req.body.discord;

  // TODO: Input santitation
  if (req.body.countries.length === 0) {
    return res.send('No countries selected');
  }

  let promises = [];

  // if user selected discord
  if (discord !== undefined && discord !== 'enter discord webhook') {
    // sanitation
    let regex = '^https://discord.com/api/webhooks/';
    let webhookSanitation = new RegExp(regex);
    if (!webhookSanitation.test(discord)) {
      console.log('sanitation invalid');
      return res.send('Webhook link invalid');
    }

    if (req.body.daily) {
      // add webhook to db
      pool.query(
        `SELECT webhook_url, acc_id
	            FROM webhook_tbl
	            WHERE acc_id=$1 
                AND webhook_url=$2;`,
        [userID, discord],
        (err, results) => {
          if (err) {
            throw err;
          }
          if (results.rows.length > 0) {
            console.log('webhook already in db');
          } else {
            pool.query(
              `INSERT INTO webhook_tbl(
                            webhook_url, acc_id)
                            VALUES ($1, $2);`,
              [discord, userID],
              (err, results) => {
                if (err) {
                  console.log('error adding webhook to db');
                  throw err;
                }
                console.log('webhook added to db');
              }
            );
          }
        }
      );
    }

    promises.push(postDiscordWebhook(discord, req.body.countries));
  }

  // update db entry
  let dailyEmails = false;
  if (req.body.sendEmails && req.body.daily) {
    dailyEmails = true;
  }
  const accQuery = pool.query(
    `UPDATE account_tbl
    SET send_emails=$1
    WHERE acc_id=$2;`,
    [dailyEmails, userID]
  );
  promises.push(accQuery);

  try {
    const responses = await Promise.all(promises);
    res.send('true');
  } catch (error) {
    console.error(error);
    res.send('something went wrong');
  }
});

module.exports = router;
