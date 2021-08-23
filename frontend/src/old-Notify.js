import React, { useState } from "react";
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
    const [discord, setDiscord] = useState("enter discord webhook");

    let empty = true;
    if (discord != "" && discord != "enter discord webhook") {
        empty = false;
    }
    console.table("props.compareList", props.compareList);

    console.log(discord);

    return (
        <>
            <div className="container">
                <div className="searchBar">
                    <input
                        type="text"
                        placeholder={discord}
                        onChange={(e) => {
                            if (e.target.value === "") {
                                setDiscord("enter discord webhook");
                            } else {
                                setDiscord(e.target.value);
                            }
                        }}
                        onBlur={(e) => {
                            if (e.target.value === "") {
                                setDiscord("enter discord webhook");
                            }
                        }}
                    />
                </div>
            </div>
            {!empty && (
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
                                        JSON.stringify(response.data)
                                    );
                                    let rData = JSON.stringify(response.data);
                                    if (rData === "true") {
                                        {
                                            history.push("/finish");
                                        }
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
