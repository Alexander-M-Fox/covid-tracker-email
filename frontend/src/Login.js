import React, { useState } from "react";
import { Link } from "react-router-dom";
const axios = require("axios");

function Login() {
    const [email, setEmail] = useState("email");
    const [password, setPassword] = useState("password");
    const [displayLogin, setDisplayLogin] = useState(false);

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
            {displayLogin && (
                <div className="bottomBar">
                    <button onClick={() => {}}>login</button>
                </div>
            )}
        </>
    );
}

export default Login;
