const express = require('express');

const router = express.Router();
const nodemailer = require('nodemailer');
const { google } = require('googleapis');

const { OAuth2 } = google.auth;

// OAuth2 Config
const OAuth2_client = new OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET
);
OAuth2_client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

const sendMail = (recipient, html) => {
  const accessToken = OAuth2_client.getAccessToken();

  const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: process.env.USER,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      refreshToken: process.env.REFRESH_TOKEN,
      accessToken,
    },
  });

  const mail_options = {
    from: `Covid Tracker Email <${process.env.USER}>`,
    to: recipient,
    subject: 'Daily Covid Stats Update',
    html,
  };

  transport.sendMail(mail_options, (err, result) => {
    if (err) {
      console.error(err);
    } else {
      console.log('mail sent');
    }
    transport.close();
  });
};

router.get('/email', (req, res) => {
  const thisHtml = `
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
  sendMail('petepom224@697av.com', thisHtml);

  res.send('ok');
});

module.exports = router;
