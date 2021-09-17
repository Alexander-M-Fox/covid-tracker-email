import { buildQueries } from "@testing-library/dom";
import React, { useState } from "react";
import "./App.css";

function Country({ country, compareList, addCountry }) {
    let thisStyle = {};
    for (let c in compareList) {
        if (compareList[c].name === country) {
            thisStyle = {
                backgroundColor: "#43f094",
            };
        }
    }

    return (
        <div className="country" style={thisStyle}>
            <div className="cName">
                <p>{country}</p>
            </div>
            <div className="addButton">
                <button
                    className="buttonFlex"
                    onClick={() => {
                        addCountry(country);
                    }}
                >
                    <span className="plus">&#43;</span>
                </button>
            </div>
        </div>
    );
}

export default Country;
