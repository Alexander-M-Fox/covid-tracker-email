import React, { useState } from "react";
import "./App.css";
import SelectCountry from "./SelectCountry";
import Comparison from "./Comparison";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

function App() {
    // a list of countries to be sent to users email, NOT a list of emails.
    const [compareList, setCompareList] = useState(new Array());

    const countriesJson = require("./countries.json");

    let objectToArray = (objectIn) => {
        let outArray = [];
        for (let i = 0; i < objectIn.length; i++) {
            outArray.push(objectIn[i].Country.toLowerCase());
        }
        return outArray;
    };

    const countries = objectToArray(countriesJson);

    // called from Country.js's addButton onClick
    let addCountry = (country) => {
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

    let nextButton = () => {
        let barBottom = "";
        if (compareList.length > 0) {
            barBottom = (
                <div className="bottomBar">
                    <button>next</button>
                </div>
            );
        } else {
            barBottom = "";
        }
        return barBottom;
    };

    return (
        <Router>
            <Switch>
                <Route exact path="/">
                    <div className="vertFlex">
                        <SelectCountry
                            countries={countries}
                            addCountry={addCountry}
                        />
                        <Link to="/compare">{nextButton()}</Link>
                    </div>
                </Route>
                <Route path="/compare">
                    <Comparison compareList={compareList} />
                </Route>
            </Switch>
        </Router>
    );
}

export default App;
