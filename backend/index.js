// Imports
const express = require('express');
const path = require('path');
const moment = require('moment');
const axios = require('axios').default;
const fs = require('fs');
const bodyParser = require('body-parser');
const CronJob = require('cron').CronJob;
const { pool } = require('./dbConfig');
const passport = require('passport');
const session = require('express-session');
require('dotenv').config();
const initializePassport = require('./passportConfig');
const {
  blockAuthenticated,
  blockNotAuthenticated,
  covidRead,
  readJson,
} = require('./commonFunctions');

// Initialisation
const app = express();
initializePassport(passport);

const logger = (req, res, next) => {
  console.log(
    `${req.method}  -  ${req.protocol}://${req.get('host')}${
      req.originalUrl
    }  -  ${moment().format()}`
  );
  next();
};

// Middleware
app.use(express.json());
app.use(logger);
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// Passport and session management
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/', require('./routes/frontend'));
app.use('/api', require('./routes/checkAuth'));
app.use('/api', require('./routes/register'));
app.use('/api', require('./routes/email'));
app.use('/api', require('./routes/login'));
app.use('/api', require('./routes/countries'));
app.use('/api', require('./routes/notify'));
app.use('/api', require('./routes/fetchSettings'));

// temp, must be deleted before production
app.use('/admin', require('./routes/admin/createCountryList'));
app.use('/admin', require('./routes/admin/update'));

// Port assignment
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
