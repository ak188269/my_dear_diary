import React from 'react'
import "./Alert.css";
import {Link} from "react-router-dom";
function Alert() {
//    document.getElementById("close").style.color=color;
    return (
        <>
            <div id="warning">
    <div id="warning_content">
    {/* <span className="warning_message">Oops ! You need to login first </span> <button id="close" onClick={function(){close()}}>X</button> */}
    <span className="warning_message">Oops ! you need to login first </span> 
    <Link to="/" id="cls">
        <button id="close" >X</button>
        </Link>
    </div>
</div>
        </>
    )
}

export default Alert
