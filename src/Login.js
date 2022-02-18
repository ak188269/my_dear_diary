import React, { useState } from 'react';
import './Login.css'
import { Link, useHistory, BrowserRouter as Router } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
toast.configure()
function Login() {
    const auth = getAuth();

    const history = useHistory();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setusername] = useState('');

    const signIn = e => {
        e.preventDefault();

        signInWithEmailAndPassword(auth, email, password).then(auth => {
                history.push('/')
            })
            .catch(error => alert(error.message))
    }
    const register = e => {
        e.preventDefault();
       
        createUserWithEmailAndPassword(auth, email, password).then((user) => {
                if (user) {
            const db=getDatabase();  
            const l1=email.split(".")[0];
            const l2=email.split("@")[0];
        const user=l1.length<l2.length? l1:l2;
            set(ref(db, 'users/' + user), {
            Name:username,
        Email:email
              })
              .then(()=>{toast.success("Account Created Successfully",{position:'top-center'}); })
                .catch((error)=>{
                    toast.error("error occured "+error);
                });
                history.push('/');
              }}).catch((error)=>{toast.error(error.message,{position:'top-center'});});
            //   setEmail("");
            //   setusername("");
    }


//     const handlesignup = ()=> {
// window.location.href="/register";
//     }
    const openSignUp=()=>{
        document.getElementById("loginHeading").innerHTML="Sign Up";
       let userSignUp= document.getElementsByClassName("userSignUp");
       for(let i=0;i<userSignUp.length;i++){
           userSignUp[i].style.display="block";
       }
       document.getElementById("create_account").style.display="none";
       document.getElementById("singInBtn").style.display="none";

    }
    const openSignIn=()=>{
        document.getElementById("loginHeading").innerHTML="Go to my diary";
        let userSignUp= document.getElementsByClassName("userSignUp");
        for(let i=0;i<userSignUp.length;i++){
            userSignUp[i].style.display="none";
        }
        document.getElementById("create_account").style.display="block";
        document.getElementById("singInBtn").style.display="block";
    }
    

    return (
        <Router>
          

        <div className='login'>
            
                <img
                    className="login__logo"
                    // src='https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/1024px-Amazon_logo.svg.png' 
                    src="user_logo.png"
                />
            

            <div className='login__container'>
                <h1 id='loginHeading'>Go to my diary</h1>

                <form>
                    <h5>E-mail</h5>
                    <input type='text' value={email} onChange={e => setEmail(e.target.value)} />
{/* for user id  */}
<h5 className='userSignUp'>UserName</h5>
                    <input type='text' value={username} onChange={e => setusername(e.target.value)} className="userSignUp" />
                    <h5>Password</h5>
                    <input type='password' value={password} onChange={e => setPassword(e.target.value)} />

                    {/* <button type='submit' onClick={signIn} className='login__signInButton'>Sign In</button> */}
                    <button type='submit' onClick={signIn} className='login__signInButton' id='singInBtn'>Sign In</button>
                    <button type='submit' onClick={register} className='login__signInButton userSignUp' id='signUpBtn'>Create Account</button>
                </form>

  

                {/* <button onClick={register} className='login__registerButton'>Create your Amazon Account</button> */}
                {/* <a  href="/register" id='create_account'> */}
                {/* <Link to="/register"> */}
                    <span  id="create_account" onClick={openSignUp}>

                     Don`t have account  ?  Create  Your Account
                    </span>
                    {/* <br/> */}
                    <h3 onClick={openSignIn} id="already" className='userSignUp'> Already have account ? Sign in </h3>
                {/* </Link> */}
                     {/* </a>s */}
            </div>
        </div>
        </Router>
    )
}

export default Login