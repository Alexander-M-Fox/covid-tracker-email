import React, { useState } from "react";
import "./App.css";
import Country from "./Country";

function SelectCountry(props) {
    const [search, setSearch] = useState("enter country");

    let filteredCountries = props.countries.filter((slookfor) => {
        return slookfor.includes(search.toLowerCase());
    });

    let filtList = [];
    if (search.length > 0) {
        filteredCountries.map((country, index) => {
            return filtList.push(
                <Country
                    country={country}
                    addCountry={props.addCountry}
                    compareList={props.compareList}
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

export default SelectCountry;
