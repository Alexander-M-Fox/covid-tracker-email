import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
const axios = require("axios");

function Comparison(props) {
    const [covidData, setCovidData] = useState();

    useEffect(() => {
        axios.post("/api/covid/countries", props.compareList).then((res) => {
            console.table("response of /api/covid/countries post request", res);
            setCovidData(res.data);
        });
    }, []); // [] = when 'nothing' changes --> only run on first render (aka onMount)

    let addCommas = (intIn) => {
        return intIn.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    return (
        <>
            <div className="grid">
                <div className="gridHeader">
                    <h1>comparison page</h1>
                </div>
                {!covidData && <p>loading...</p>}
                {covidData &&
                    covidData.map((country, index) => {
                        return (
                            <div key={index}>
                                <h3 className="h3Underlined">
                                    {country.country.toLowerCase()}
                                </h3>
                                <p>
                                    <b>new data</b>
                                </p>
                                <table className="dataTable">
                                    <tbody>
                                        <tr>
                                            <td>new cases</td>
                                            <td>
                                                {addCommas(country.todayCases)}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>new deaths</td>
                                            <td>
                                                {addCommas(country.todayDeaths)}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>new recovered</td>
                                            <td>
                                                {addCommas(
                                                    country.todayRecovered
                                                )}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <p>
                                    <b>total data</b>
                                </p>
                                <table className="dataTable">
                                    <tbody>
                                        <tr>
                                            <td>total cases</td>
                                            <td>{addCommas(country.cases)}</td>
                                        </tr>
                                        <tr>
                                            <td>total deaths</td>
                                            <td>{addCommas(country.deaths)}</td>
                                        </tr>
                                        <tr>
                                            <td>total recovered</td>
                                            <td>
                                                {addCommas(country.recovered)}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        );
                    })}
            </div>
            <div className="bottomBar">
                <Link to="/notify">
                    <button>get notified</button>
                </Link>
            </div>
        </>
    );
}

export default Comparison;

// Comparison requirements
// 1. send compareList to backend requesting for covid data (to /api/covid/countries)
// 2. display result nicely (opt in graphs) TODO: <-- next
// 3. have "send daily updates via email" button send compareList to /api/covid/emailMe route
