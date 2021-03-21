import React, { useState } from 'react';
import "./App.css";
const { getNameList } = require('country-list');

function App() {
    const [search, setSearch] = useState("enter country");

    const countries = Object.keys(getNameList());

    let searchCountry = (slookfor) => {
        return slookfor.includes(search.toLowerCase());
    }

    let filteredCountries = countries.filter(searchCountry);

    let filtList = [];
    if (search.length > 0) {
        filteredCountries.map((country, index) => {
            return filtList.push(<p>{country}</p>)
        })
    } else {
        filtList = "";
    }

    return (
        <>
            <div className="container">
                <div className="searchBar">
                    <input type="text" placeholder={search} onChange={e => {
                        if (e.target.value === "") {
                            setSearch("enter country") 
                        } else {
                            setSearch(e.target.value);
                        }
                    }} onBlur={e => { 
                        if (e.target.value === "") { 
                            setSearch("enter country") 
                            } }} />
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
