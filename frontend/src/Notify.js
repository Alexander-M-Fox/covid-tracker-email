import React, { useState, useEffect } from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect,
    useHistory,
} from "react-router-dom";
const axios = require("axios");
const qs = require("qs");

function Notify(props) {
    let history = useHistory();

    const [daily, setDaily] = useState(undefined);
    let oneOffButtonStyle = daily ? "inactive" : "active";
    let dailyButtonStyle = daily ? "active" : "inactive";
    // console.log(`daily = ${daily}`);

    useEffect(() => {
        oneOffButtonStyle = "";
    }, []);

    const [email, setEmail] = useState(false);
    const [discord, setDiscord] = useState(false);
    let emailButtonStyle = email ? "active" : "inactive";
    let discordButtonStyle = discord ? "active" : "inactive";
    // console.log(`email = ${email}`);
    // console.log(`discord = ${discord}`);

    const [address, setAddress] = useState("enter email address");
    const [webhook, setWebhook] = useState("enter discord webhook");

    // should UI show question 2?
    // must be done this way as I can't run an if statement in return jsx
    let q1Answered = false;
    if (daily !== undefined) {
        q1Answered = true;
    }

    // const [finished, setFinished] = useState(false);
    let finished = false;

    // should UI show bottom bar?
    if (email && discord) {
        if (
            address !== "enter email address" &&
            address !== "" &&
            webhook !== "enter discord webhook" &&
            webhook !== ""
        ) {
            finished = true;
        } else {
            finished = false;
        }
    } else if (email && !discord) {
        if (address !== "enter email address" && address !== "") {
            finished = true;
        } else {
            finished = false;
        }
    } else if (discord && !email) {
        if (webhook !== "enter discord webhook" && webhook !== "") {
            finished = true;
        } else {
            finished = false;
        }
    }

    return (
        <>
            <div className="containerShort">
                <div>
                    <p>would you like...</p>
                    <div className="choiceButtons">
                        <button
                            className={oneOffButtonStyle}
                            onClick={() => {
                                setDaily(false);
                            }}
                        >
                            a one off notification
                        </button>
                        <p>or</p>
                        <button
                            className={dailyButtonStyle}
                            onClick={() => {
                                setDaily(true);
                            }}
                        >
                            daily notifications
                        </button>
                    </div>
                </div>
            </div>
            {q1Answered && (
                <div className="containerShort">
                    <div>
                        <p>
                            choose <b>at least one</b> of the following
                        </p>
                        <div className="choiceButtons">
                            <button
                                className={emailButtonStyle}
                                onClick={() => {
                                    email ? setEmail(false) : setEmail(true);
                                }}
                            >
                                send via email
                            </button>
                            <p>and / or</p>
                            <button
                                className={discordButtonStyle}
                                onClick={() => {
                                    discord
                                        ? setDiscord(false)
                                        : setDiscord(true);
                                }}
                            >
                                send via discord webhook
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {email && (
                <div className="containerVeryShort">
                    <input
                        type="text"
                        placeholder={address}
                        onChange={(e) => {
                            if (e.target.value === "") {
                                setAddress("enter email address");
                            } else {
                                setAddress(e.target.value);
                            }
                        }}
                        onBlur={(e) => {
                            if (e.target.value === "") {
                                setAddress("enter email address");
                            }
                        }}
                    />
                </div>
            )}
            {discord && (
                <div className="containerVeryShort">
                    <input
                        type="text"
                        placeholder={webhook}
                        onChange={(e) => {
                            if (e.target.value === "") {
                                setWebhook("enter discord webhook");
                            } else {
                                setWebhook(e.target.value);
                            }
                        }}
                        onBlur={(e) => {
                            if (e.target.value === "") {
                                setWebhook("enter discord webhook");
                            }
                        }}
                    />
                </div>
            )}
            {/* </div> */}
            {finished && (
                <div className="bottomBar">
                    <button
                        onClick={async () => {
                            // TODO: frontend validation
                            let data = qs.stringify({
                                discord: discord,
                                countries: props.compareList,
                            });
                            let config = {
                                method: "post",
                                url: "/api/discord",
                                headers: {
                                    "Content-Type":
                                        "application/x-www-form-urlencoded",
                                },
                                data: data,
                            };

                            axios(config)
                                .then(function (response) {
                                    console.table(
                                        "discord response data",
                                        JSON.stringify(response.data),
                                    );
                                    let rData = JSON.stringify(response.data);
                                    if (rData === "true") {
                                        history.push("/finish");
                                    }
                                })
                                .catch(function (error) {
                                    console.log(error);
                                });
                        }}
                    >
                        next
                    </button>
                </div>
            )}
        </>
    );
}

export default Notify;
