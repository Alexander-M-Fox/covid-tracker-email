import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';

const axios = require('axios');
const qs = require('qs');

function CreateAccount() {
  const history = useHistory();

  useEffect(() => {
    axios.get('/api/checkAuth').then((res) => {
      if (res.data === true) {
        history.push('/notify');
      }
    });
  }, []);

  const [accName, setAccName] = useState('your name');
  const [email, setEmail] = useState('email');
  const [password, setPassword] = useState('password');
  const [confPassword, setConfPassword] = useState('confirm password');
  // const [displayCreateAccount, setDisplayCreateAccount] = useState(false);
  const [accError, setAccError] = useState(false);
  const [accErrorDetails, setAccErrorDetails] = useState('');

  let confPasswordStyle = {};

  if (confPassword === password) {
    confPasswordStyle = {
      color: '#0f0',
    };
  } else if (confPassword !== 'confirm password' && confPassword !== password) {
    confPasswordStyle = {
      color: '#f00',
    };
  } else {
    confPasswordStyle = {};
  }

  const sendCreateAccountRequest = () => {
    const createAccountData = qs.stringify({
      acc_name: accName,
      email,
      password,
      password2: confPassword,
    });
    const createAccountConfig = {
      method: 'post',
      url: '/api/register',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: createAccountData,
    };

    axios(createAccountConfig)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
        if (response.status === 200) {
          history.push('/notify');
        }
      })
      .catch(function (error) {
        console.log(error);
        setAccErrorDetails(JSON.stringify(error.message));
        console.log(`typeof accErrorDetails = ${typeof accErrorDetails}`);
        setAccError(true);
      });
  };

  let displayCreateAccount = false;

  if (confPassword === password) {
    displayCreateAccount = true;
  } else {
    displayCreateAccount = false;
  }

  return (
    <>
      <div className="containerMedium">
        <div className="searchBar">
          <input
            type="text"
            placeholder={accName}
            onChange={(e) => {
              if (e.target.value === '') {
                setAccName('your name');
              } else {
                setAccName(e.target.value);
              }
            }}
            onBlur={(e) => {
              if (e.target.value === '') {
                setEmail('email');
              }
            }}
          />
        </div>
      </div>
      <div className="password">
        <div className="searchBar">
          <input
            type="text"
            placeholder={email}
            onChange={(e) => {
              if (e.target.value === '') {
                setEmail('email');
              } else {
                setEmail(e.target.value);
              }
            }}
            onBlur={(e) => {
              if (e.target.value === '') {
                setEmail('email');
              }
            }}
          />
        </div>
      </div>
      <div className="password">
        <div className="searchBar">
          <input
            type="password"
            placeholder={password}
            onChange={(e) => {
              if (e.target.value === '') {
                setPassword('password');
              } else {
                setPassword(e.target.value);
              }
            }}
            onBlur={(e) => {
              if (e.target.value === '') {
                setPassword('password');
              }
            }}
          />
        </div>
      </div>
      <div className="password">
        <div className="searchBar">
          <input
            style={confPasswordStyle}
            type="password"
            placeholder={confPassword}
            onChange={(e) => {
              if (e.target.value === '') {
                setConfPassword('confirm password');
              } else {
                setConfPassword(e.target.value);
              }
            }}
            onBlur={(e) => {
              if (e.target.value === '') {
                setConfPassword('confirm password');
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                if (displayCreateAccount) {
                  sendCreateAccountRequest();
                }
              }
            }}
          />
        </div>
      </div>
      <div className="password">
        <p>
          already have an account? login <Link to="/login">here</Link>
        </p>
      </div>
      {accError && (
        <div className="containerError">
          {/* <p>something went wrong creating your account</p> */}
          <p>{accErrorDetails}</p>
        </div>
      )}
      {displayCreateAccount && (
        <div className="bottomBar">
          <button
            onClick={() => {
              sendCreateAccountRequest();
            }}
          >
            login
          </button>
        </div>
      )}
    </>
  );
}

export default CreateAccount;
