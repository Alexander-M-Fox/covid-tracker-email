const path = require('path');
const fs = require('fs');
const axios = require('axios').default;

function blockAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    console.log('already authenticated');
    return res.send('you are already logged in');
  }
  next();
}

function blockNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  console.log('no auth');
  res.send('no auth');
}

let readJson = (path) => {
  try {
    return fs.readFileSync(path, 'utf8');
  } catch (err) {
    console.error(err);
    return false;
  }
};

let covidRead = JSON.parse(readJson(path.join(__dirname, 'covidData.json')));

// add commas to numbers to enhance readability.
let addCommas = (intIn) => {
  return intIn.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

const postDiscordWebhook = async (targetURL, countries) => {
  // last updated
  let epoch = covidRead[0].updated;
  let d = new Date(epoch);
  let lastUpdated = `${d.toLocaleDateString()} at ${d.toLocaleTimeString()}`;

  let fields = [
    {
      name: 'Last Updated:',
      value: lastUpdated,
    },
  ];

  for (country in countries) {
    fields.push(
      {
        name: '`Country name`',
        value: '=======',
      },
      {
        name: 'New Cases',
        value: 'todayCases',
        inline: true,
      },
      {
        name: 'New Deaths',
        value: 'todayDeaths',
        inline: true,
      }
    );
    for (countryObj in covidRead) {
      if (
        countries[country].name === covidRead[countryObj].country.toLowerCase()
      ) {
        // country name
        fields[country * 3 + 1].name = `\`${covidRead[countryObj].country}\``;
        // new cases
        fields[country * 3 + 2].value = addCommas(
          covidRead[countryObj].todayCases
        );
        // new deaths
        fields[country * 3 + 3].value = addCommas(
          covidRead[countryObj].todayDeaths
        );
      }
    }
  }
  let discordData = JSON.stringify({
    username: 'Covid Tracker',
    avatar_url: 'https://i.imgur.com/ByNoBIl.png',
    embeds: [
      {
        title: 'Daily Covid Update',
        url: 'https://disease.sh/docs/',
        description:
          "Figures may vary slightly from your county's official portal.",
        color: 2533597,
        fields: fields,
        footer: {
          text: 'Data sourced from https://disease.sh/docs/ (click title to follow link)',
          icon_url: 'https://copyright.co.uk/images/copyright-symbol.png',
        },
      },
    ],
  });

  let discordConfig = {
    method: 'post',
    url: targetURL,
    headers: {
      'Content-Type': 'application/json',
    },
    data: discordData,
  };

  try {
    const discordQuery = await axios(discordConfig);
    // return new Promise((resolve, reject) => {
    //     resolve();
    // });
  } catch (error) {
    console.error(error);
    // return new Promise((resolve, reject) => {
    //     reject();
    // });
  }
};

module.exports = {
  blockAuthenticated,
  blockNotAuthenticated,
  covidRead,
  readJson,
  postDiscordWebhook,
};
