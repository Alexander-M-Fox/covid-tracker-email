import React, { useState } from "react";
import "./App.css";
import Country from "./Country";
const { getNameList } = require("country-list");

function App() {
    const [search, setSearch] = useState("enter country");
    const [emailList, setEmailList] = useState([{}]);

    const countries = Object.keys(getNameList());

    console.log(getNameList());

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

    return (
        <>
            <div className="container">
                <div className="searchBar">
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
                </div>
            </div>
            <div className="filterList">
                {filtList[0]}
                {filtList[1]}
                {filtList[2]}
                {filtList[3]}
            </div>
        </>
    );
}

export default App;
