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

    // undefined counts as false hence requiring long form
    let oneOffButtonStyle = "inactive";
    if (daily) {
        oneOffButtonStyle = "inactive";
    } else if (daily === undefined) {
        oneOffButtonStyle = "inactive";
    } else {
        oneOffButtonStyle = "active";
    }

    let dailyButtonStyle = daily ? "active" : "inactive";
    // console.log(`daily = ${daily}`);

    useEffect(() => {
        oneOffButtonStyle = "";
        axios.get("/api/checkAuth").then((res) => {
            if (res.data !== true) {
                history.push("/login");
            }
        });
    }, []);

    const [email, setEmail] = useState(false);
    const [discord, setDiscord] = useState(false);
    let emailButtonStyle = email ? "active" : "inactive";
    let discordButtonStyle = discord ? "active" : "inactive";

    const [error, setError] = useState();

    const [webhook, setWebhook] = useState("enter discord webhook");

    if (props.compareList.length === 0) {
        return history.push("/");
    }

    // should UI show question 2?
    // must be done this way as I can't run an if statement in return jsx
    let q1Answered = false;
    if (daily !== undefined) {
        q1Answered = true;
    }

    let finished = false;

    // should UI show bottom bar?
    if (discord) {
        if (webhook !== "enter discord webhook" && webhook !== "") {
            finished = true;
        }
    } else if (email) {
        finished = true;
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
                    <h4>we'll use the email address you signed in with</h4>
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
            <div className="containerError">
                <p>{error}</p>
            </div>
            {/* </div> */}
            {finished && (
                <div className="bottomBar">
                    <button
                        onClick={async () => {
                            // TODO: frontend validation
                            let data = {
                                discord: webhook,
                                countries: props.compareList,
                                sendEmails: email,
                            };
                            let config = {
                                method: "post",
                                url: "/api/notify",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                data: data,
                            };

                            axios(config)
                                .then(function (response) {
                                    let rData = String(response.data);
                                    console.log(`rData = ${rData}`);
                                    if (rData === "true") {
                                        history.push("/finish");
                                    } else if (
                                        rData === "No countries selected"
                                    ) {
                                        history.push("/");
                                        console.log("no countries");
                                    } else if (rData === "no auth") {
                                        history.push("/login");
                                    } else {
                                        console.log("set error running");
                                        setError(rData);
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
