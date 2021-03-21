import React, { useState } from "react";
import "./App.css";

function Country(props) {
    const [showAdd, setShowAdd] = useState(false);
    // const [divStyle, setDivStyle] = useState({ backgroundColor: "white" });
    return (
        <div className="country">
            {/* style={divStyle}> */}
            <div className="cName">
                <p>{props.country}</p>
            </div>
            <div className="addButton">
                <button
                    className="buttonFlex"
                    onMouseEnter={() => setShowAdd(true)}
                    onMouseLeave={() => setShowAdd(false)}
                    // onClick={() => {
                    //     setDivStyle({ backgroundColor: "#43f094" });
                    // }}
                    onClick={() => {
                        props.addCountry(props.country);
                    }}
                >
                    <span className="plus">&#43;</span>
                    {showAdd && (
                        <span className="addButtonText">add to email list</span>
                    )}
                </button>
            </div>
        </div>
    );
}

export default Country;
