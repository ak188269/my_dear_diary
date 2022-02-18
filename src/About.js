import React from 'react'
import EmailIcon from '@mui/icons-material/Email';
import LoginIcon from '@mui/icons-material/Login';
import {Link , BrowserRouter as Router , Switch , Route} from "react-router-dom";

function About() {
    return (
        <div>
            i am spiderman i am developer of this website
            <div className="nav_item"><Link className="Link" to="/message"><EmailIcon className="icon" fontSize="large"/><span>Message Us</span></Link></div>
  <div className="nav_item"><Link className="Link" to="/login"><LoginIcon className="icon" fontSize="large"/><span>Login</span></Link></div>
        </div>
    )
}

export default About
