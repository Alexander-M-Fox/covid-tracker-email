import React, { useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import SelectCountry from './SelectCountry';
import Comparison from './Comparison';
import Login from './Login';
import Notify from './Notify';
import Done from './Done';
import CreateAccount from './CreateAccount';

function App() {
  // a list of countries to be sent to users email, NOT a list of emails.
  const [compareList, setCompareList] = useState([]);

  const countriesJson = require('./countries.json');

  const objectToArray = (objectIn) => {
    const outArray = [];
    for (let i = 0; i < objectIn.length; i++) {
      outArray.push(objectIn[i].name.toLowerCase());
    }
    return outArray;
  };

  const countries = objectToArray(countriesJson);

  // called from Country.js's addButton onClick
  const addCountry = (country) => {
    // search if country already added to emailList
    let foundFlag = false;
    for (let i = 0; i < compareList.length; i++) {
      if (compareList[i].name === country) {
        foundFlag = true;
      }
    }
    if (foundFlag === false) {
      setCompareList([...compareList, { name: country }]);
    }
  };

  console.log(compareList);

  let displayNext = false;
  if (compareList.length > 0) {
    displayNext = true;
  }

  const displaySelectedCountries = () => {
    const selectedCountries = [];
    for (const c in compareList) {
      selectedCountries.push(<p key={c}>{compareList[c].name}</p>);
    }
    return selectedCountries;
  };

  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <p>
            TODO NEXT: separate the update page from the notify page for
            improved encapsulation and potential UI changes
          </p>
          <div className="vertFlex">
            <SelectCountry
              countries={countries}
              addCountry={addCountry}
              compareList={compareList}
            />
            {displayNext && (
              <div className="bottomBar">
                {displaySelectedCountries()}
                <Link to="/compare">
                  <button>next</button>
                </Link>
              </div>
            )}
          </div>
        </Route>
        <Route path="/compare">
          <Comparison compareList={compareList} />
        </Route>
        <Route path="/createAccount">
          <CreateAccount compareList={compareList} />
        </Route>
        <Route path="/login">
          <Login compareList={compareList} />
        </Route>
        <Route path="/notify">
          <Notify compareList={compareList} />
        </Route>
        <Route path="/finish">
          <Done />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
