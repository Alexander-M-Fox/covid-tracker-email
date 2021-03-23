import React from "react";

function Comparison(props) {
    return (
        <div>
            <h1>comparison page</h1>
            {props.compareList.map((country, index) => {
                return <p key={index}>{country.name}</p>;
            })}
        </div>
    );
}

export default Comparison;

// Comparison requirements
// 1. send compareList to backend requesting for covid data (to /api/covid/countries)
// 2. display result nicely (opt in graphs)
// 3. have "send daily updates via email" button send compareList to /api/covid/emailMe route
