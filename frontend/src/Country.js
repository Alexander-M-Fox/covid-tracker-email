import { buildQueries } from "@testing-library/dom";
import React, { useState } from "react";
import "./App.css";

function Country(props) {
    let thisStyle = {};
    for (let c in props.compareList) {
        if (props.compareList[c].name === props.country) {
            thisStyle = {
                backgroundColor: "#43f094",
            };
        }
    }

    return (
        <div className="country" style={thisStyle}>
            <div className="cName">
                <p>{props.country}</p>
            </div>
            <div className="addButton">
                <button
                    className="buttonFlex"
                    onClick={() => {
                        props.addCountry(props.country);
                    }}
                >
                    <span className="plus">&#43;</span>
                </button>
            </div>
        </div>
    );
}

export default Country;
