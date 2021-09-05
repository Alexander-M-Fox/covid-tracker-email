import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
const axios = require("axios");
const qs = require("qs");

function Login() {
    let history = useHistory();

    useEffect(() => {
        axios.get("/api/checkAuth").then((res) => {
            if (res.data === true) {
                history.push("/notify");
            }
        });
    }, []);

    const [email, setEmail] = useState("email");
    const [password, setPassword] = useState("password");
    const [displayLogin, setDisplayLogin] = useState(false);
    const [noAuth, setNoAuth] = useState(false);

    const sendLoginRequest = () => {
        let loginData = qs.stringify({
            email: email,
            password: password,
        });
        let loginConfig = {
            method: "post",
            url: "/api/login",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
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
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                if (displayLogin) {
                                    sendLoginRequest();
                                }
                            }
                        }}
                    />
                </div>
            </div>
            <div className="password">
                <p>
                    don't have an account? make one{" "}
                    <Link to="/createAccount">here</Link>
                </p>
            </div>
            {noAuth && (
                <div className="containerError">
                    <p>email and / or password incorrect</p>
                </div>
            )}
            {displayLogin && (
                <div className="bottomBar">
                    <button
                        onClick={() => {
                            sendLoginRequest();
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
