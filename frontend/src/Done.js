import { React, useEffect } from 'react';
import { BrowserRouter as Router, useHistory } from 'react-router-dom';
const axios = require('axios');

function Done() {
  let history = useHistory();

  useEffect(() => {
    axios.get('/api/checkAuth').then((res) => {
      if (res.data !== true) {
        history.push('/login');
      }
    });
  }, []);
  return (
    <div className="containerMedium">
      <h1>you're all set up!</h1>
      <div className="containerShort">
        <div>
          <div className="choiceButtons">
            <button onClick={() => {}}>logout</button>
            <p></p>
            <button
              onClick={() => {
                history.push('/notify');
              }}
            >
              change settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Done;
