const express = require('express');
const router = express.Router();
const path = require('path');
const axios = require('axios').default;
const fs = require('fs');
const CronJob = require('cron').CronJob;
require('dotenv').config();

//#region
/**
 * @param {string} description - Admin route to manually force server's covid data to update itself with disease.sh's API
 * @param {string} [inputs] N/A - None.
 * @param {string} [outputs] success - If false see msg.
 * @param {string} [outputs] msg - Describes handling of request.
 */
//#endregion
router.get(
    '/update',
    (updateData = (req, res) => {
        // Get summary covid data
        let covidSummary = [];
        axios.get('https://disease.sh/v3/covid-19/countries').then((res2) => {
            covidSummary = res2.data;
            try {
                fs.writeFileSync(
                    path.join(__dirname, 'covidData.json'),
                    JSON.stringify(covidSummary)
                );
                console.log('data updated');
                if (res) {
                    res.json({ msg: 'Covid data updated', success: 'true' });
                }
            } catch (err) {
                console.error(err);
                if (res) {
                    res.json({
                        msg: 'Error writing covid data',
                        success: 'false',
                    });
                }
            }
        });
    })
);

// update covid data daily (@ 01:10 local time each day)
const job = new CronJob('0 10 1 * * *', () => updateData()).start();

module.exports = router;
