const express = require("express");
const router = express.Router();
const { covidRead } = require("../../commonFunctions");

//#region
/**
 * @param {string} description - Admin route to create a list of countries with no data attached to be used with frontend country search suggestions.  THis list is created as a local file on the server, NOT sent back to the frontend.
 * @param {string} [inputs] N/A - None.
 * @param {string} [outputs] success - If false see msg.
 * @param {string} [outputs] msg - Describes handling of request.
 */
//#endregion
router.get("/createCountryList", (req, res) => {
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

module.exports = router;
