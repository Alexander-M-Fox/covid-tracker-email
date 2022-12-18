import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  useHistory,
} from 'react-router-dom';
const axios = require('axios');
const qs = require('qs');

function Notify({ compareList }) {
  let history = useHistory();

  const [daily, setDaily] = useState(undefined);

  // undefined counts as false hence requiring long form
  let oneOffButtonStyle = 'inactive';
  if (daily) {
    oneOffButtonStyle = 'inactive';
  } else if (daily === undefined) {
    oneOffButtonStyle = 'inactive';
  } else {
    oneOffButtonStyle = 'active';
  }

  let dailyButtonStyle = daily ? 'active' : 'inactive';

  useEffect(() => {
    // nested function to surpress react async warning
    const setup = async () => {
      oneOffButtonStyle = '';
      const auth = await axios.get('/api/checkAuth');
      if (auth.data !== true) {
        return history.push('/login');
      }

      // fetch user settings if present in DB and update page state accordingly
      const fetchSettings = await axios.get('/api/fetchSettings');
      console.log(fetchSettings.data);
      if (fetchSettings.data) {
        setUpdate(true);
      }
      if (fetchSettings.data.webhook) {
        setDiscord(true);
        setWebhook(fetchSettings.data.webhookData);
      }
      if (fetchSettings.data.sendEmails) {
        setEmail(true);
        setDaily(true);
        q1Answered = true;
        console.log(`q1Answered = ${q1Answered}`);
      }
    };
    setup();
  }, []);

  const [email, setEmail] = useState(false);
  const [discord, setDiscord] = useState(false);
  let emailButtonStyle = email ? 'active' : 'inactive';
  let discordButtonStyle = discord ? 'active' : 'inactive';

  const [error, setError] = useState();
  const [update, setUpdate] = useState(false);
  const [webhook, setWebhook] = useState('enter discord webhook');

  if (compareList.length === 0) {
    history.push('/');
  }

  // should UI show question 2?
  // must be done this way as I can't run an if statement in return jsx
  let q1Answered = false;
  if (daily !== undefined) {
    q1Answered = true;
  }

  let finished = false;

  // should UI show bottom bar?
  if (discord) {
    if (webhook !== 'enter discord webhook' && webhook !== '') {
      finished = true;
    }
  } else if (email) {
    finished = true;
  }

  // set subtitle msg dependant on update
  let subtitle = update ? 'update your settings here' : 'would you like...';

  return (
    <>
      <div className="containerShort">
        <div>
          <p>{subtitle}</p>
          <div className="choiceButtons">
            <button
              className={oneOffButtonStyle}
              onClick={() => {
                setDaily(false);
              }}
            >
              a one off notification
            </button>
            <p>or</p>
            <button
              className={dailyButtonStyle}
              onClick={() => {
                setDaily(true);
              }}
            >
              daily notifications
            </button>
          </div>
        </div>
      </div>
      {q1Answered && (
        <div className="containerShort">
          <div>
            <p>
              choose <b>at least one</b> of the following
            </p>
            <div className="choiceButtons">
              <button
                className={emailButtonStyle}
                onClick={() => {
                  email ? setEmail(false) : setEmail(true);
                }}
              >
                send via email
              </button>
              <p>and / or</p>
              <button
                className={discordButtonStyle}
                onClick={() => {
                  discord ? setDiscord(false) : setDiscord(true);
                }}
              >
                send via discord webhook
              </button>
            </div>
          </div>
        </div>
      )}

      {email && (
        <div className="containerVeryShort">
          <h4>we'll use the email address you signed in with</h4>
        </div>
      )}
      {discord && (
        <div className="containerVeryShort">
          <input
            type="text"
            placeholder={webhook}
            onChange={(e) => {
              if (e.target.value === '') {
                setWebhook('enter discord webhook');
              } else {
                setWebhook(e.target.value);
              }
            }}
            onBlur={(e) => {
              if (e.target.value === '') {
                setWebhook('enter discord webhook');
              }
            }}
            onClick={(e) => {
              let regex = '^https://discord.com/api/webhooks/';
              let webhookSanitation = new RegExp(regex);
              if (webhookSanitation.test(webhook)) {
              }
            }}
          />
        </div>
      )}
      <div className="containerError">
        <p>{error}</p>
      </div>
      {/* </div> */}
      {finished && (
        <div className="bottomBar">
          <button
            onClick={async () => {
              // TODO: frontend validation
              let data = {
                discord: webhook,
                countries: compareList,
                sendEmails: email,
                daily: daily,
              };
              let config = {
                method: 'post',
                url: '/api/notify',
                headers: {
                  'Content-Type': 'application/json',
                },
                data: data,
              };

              axios(config)
                .then(function (response) {
                  let rData = String(response.data);
                  console.log(`rData = ${rData}`);
                  if (rData === 'true') {
                    history.push('/finish');
                  } else if (rData === 'No countries selected') {
                    history.push('/');
                    console.log('no countries');
                  } else if (rData === 'no auth') {
                    history.push('/login');
                  } else {
                    console.log('set error running');
                    setError(rData);
                  }
                })
                .catch(function (error) {
                  console.log(error);
                });
            }}
          >
            next
          </button>
        </div>
      )}
    </>
  );
}

export default Notify;
