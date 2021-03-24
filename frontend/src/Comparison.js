import React, { useState, useEffect } from "react";
const axios = require("axios");

function Comparison(props) {
    const [covidData, setCovidData] = useState();

    useEffect(() => {
        axios.post("/api/covid/countries", props.compareList).then((res) => {
            console.table("response of /api/covid/countries post request", res);
            setCovidData(res.data);
        });
    }, []); // [] = when 'nothing' changes --> only run on first render (aka onMount)

    return (
        <>
            <h1>comparison page</h1>
            {!covidData && <p>loading...</p>}
            <div className="grid">
                {covidData &&
                    covidData.map((country, index) => {
                        return (
                            <div key={index}>
                                <h3 className="h3Underlined">
                                    {country.Country}
                                </h3>
                                <p>
                                    <b>New data</b>
                                </p>
                                <table className="dataTable">
                                    <tbody>
                                        <tr>
                                            <td>New Cases</td>
                                            <td>{country.NewConfirmed}</td>
                                        </tr>
                                        <tr>
                                            <td>New Deaths</td>
                                            <td>{country.NewDeaths}</td>
                                        </tr>
                                        <tr>
                                            <td>New Recovered</td>
                                            <td>{country.NewRecovered}</td>
                                        </tr>
                                    </tbody>
                                </table>
                                <p>
                                    <b>Total data</b>
                                </p>
                                <table className="dataTable">
                                    <tbody>
                                        <tr>
                                            <td>Total Cases</td>
                                            <td>{country.TotalConfirmed}</td>
                                        </tr>
                                        <tr>
                                            <td>Total Deaths</td>
                                            <td>{country.TotalDeaths}</td>
                                        </tr>
                                        <tr>
                                            <td>Total Recovered</td>
                                            <td>{country.TotalRecovered}</td>
                                        </tr>
                                    </tbody>
                                </table>
                                {/* <p>{country.NewConfirmed}</p> */}
                            </div>
                        );
                    })}
            </div>
        </>
    );
}

export default Comparison;

// Comparison requirements
// 1. send compareList to backend requesting for covid data (to /api/covid/countries)
// 2. display result nicely (opt in graphs) TODO: <-- next
// 3. have "send daily updates via email" button send compareList to /api/covid/emailMe route
