import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
const axios = require("axios");
const qs = require("qs");

function Login() {
    let history = useHistory();

    const [email, setEmail] = useState("email");
    const [password, setPassword] = useState("password");
    const [displayLogin, setDisplayLogin] = useState(false);
    const [noAuth, setNoAuth] = useState(false);

    const login = () => {
        axios.post("");
    };

    return (
        <>
            <div className="container">
                <div className="searchBar">
                    <input
                        type="text"
                        placeholder={email}
                        onChange={(e) => {
                            if (e.target.value === "") {
                                setEmail("email");
                            } else {
                                setEmail(e.target.value);
                            }
                        }}
                        onBlur={(e) => {
                            if (e.target.value === "") {
                                setEmail("email");
                            }
                        }}
                    />
                </div>
            </div>
            <div className="password">
                <div className="searchBar">
                    <input
                        type="password"
                        placeholder={password}
                        onChange={(e) => {
                            if (e.target.value === "") {
                                setPassword("password");
                                setDisplayLogin(false);
                            } else {
                                setDisplayLogin(true);
                                setPassword(e.target.value);
                            }
                        }}
                        onBlur={(e) => {
                            if (e.target.value === "") {
                                setDisplayLogin(false);
                                setPassword("password");
                            }
                        }}
                    />
                </div>
            </div>
            <div class="password">
                <p>
                    don't have an account? make one{" "}
                    <Link to="/createAccount">here</Link>
                </p>
            </div>
            {displayLogin && (
                <div className="bottomBar">
                    {noAuth && <p>email and / or password incorrect</p>}
                    <button
                        onClick={() => {
                            let loginData = qs.stringify({
                                email: email,
                                password: password,
                            });
                            let loginConfig = {
                                method: "post",
                                url: "/api/login",
                                headers: {
                                    "Content-Type":
                                        "application/x-www-form-urlencoded",
                                },
                                data: loginData,
                            };

                            axios(loginConfig)
                                .then(function (response) {
                                    console.log(JSON.stringify(response.data));
                                    if (response.status === 200) {
                                        history.push("/notify");
                                    }
                                })
                                .catch(function (error) {
                                    console.log(error);
                                    setNoAuth(true);
                                });
                        }}
                    >
                        login
                    </button>
                </div>
            )}
        </>
    );
}

export default Login;
