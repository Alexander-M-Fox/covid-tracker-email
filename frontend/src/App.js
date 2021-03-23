import React, { useState } from "react";
import "./App.css";
import Country from "./Country";

function App() {
    const [search, setSearch] = useState("enter country");
    const [emailList, setEmailList] = useState(new Array());
    const [next, setNext] = useState(false);

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
        for (let i = 0; i < emailList.length; i++) {
            if (emailList[i].name === country) {
                foundFlag = true;
            }
        }
        if (foundFlag === false) {
            setEmailList([...emailList, { name: country }]);
        }
    };

    console.log(emailList);

    let filteredCountries = countries.filter((slookfor) => {
        return slookfor.includes(search.toLowerCase());
    });

    let filtList = [];
    if (search.length > 0) {
        filteredCountries.map((country, index) => {
            return filtList.push(
                <Country
                    country={country}
                    addCountry={addCountry}
                    key={index}
                />
            );
        });
    } else {
        filtList = "";
    }

    let nextButton = () => {
        if (emailList.length > 0) {
            return (
                <button
                    onClick={() => {
                        setNext(true);
                    }}
                >
                    next
                </button>
            );
        }
    };

    return (
        <>
            <div className="vertFlex">
                <div className="container">
                    <div className="searchBar">
                        {!next && ( // TODO: this is cheap, and needs to be placed with react router for scalability.
                            <input
                                type="text"
                                placeholder={search}
                                onChange={(e) => {
                                    if (e.target.value === "") {
                                        setSearch("enter country");
                                    } else {
                                        setSearch(e.target.value);
                                    }
                                }}
                                onBlur={(e) => {
                                    if (e.target.value === "") {
                                        setSearch("enter country");
                                    }
                                }}
                            />
                        )}
                    </div>
                </div>
                {!next && (
                    <div className="filterList">
                        {filtList[0]}
                        {filtList[1]}
                        {filtList[2]}
                        {filtList[3]}
                    </div>
                )}
                <div className="bottomBar">{nextButton()}</div>
            </div>
        </>
    );
}

export default App;
