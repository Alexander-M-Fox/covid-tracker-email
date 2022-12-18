const express = require("express");
const router = express.Router();
const { covidRead } = require("../commonFunctions");

//#region
/**
 * @param {string} description - Returns COVID data for given countries.
 * @param {string} [inputs] compareList - JSON array of objects in format [{ "name": "countryname1" }, { "name": "countryname2" }]
 * @param {string} [outputs] resCovidData - JSON array of objects [ { country1_covid_data }, { country2_covid_data } ]
 */
//#endregion
router.post("/covid/countries", (req, res) => {
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
          ].country.toLowerCase()}`
        );
        resCovidData.push(covidRead[i]);
      }
    }
  }
  res.json(resCovidData);
});

module.exports = router;
