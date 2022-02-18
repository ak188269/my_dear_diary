import{useState,react} from 'react'
import {BrowserRouter as Router,Link ,Route,Switch} from "react-router-dom";
import "./Header.css";
import HomeIcon from '@mui/icons-material/Home';
import EmailIcon from '@mui/icons-material/Email';
import LoginIcon from '@mui/icons-material/Login';
import InfoIcon from '@mui/icons-material/Info';
import PersonIcon from '@mui/icons-material/Person';
import Message  from './Message';
import { getAuth, signOut,onAuthStateChanged } from "firebase/auth";
// import { useStateValue } from "./StateProvider";
import { auth } from "./firebase";
import { getDatabase, ref, set,child,get } from "firebase/database";



function Header() {
  const [user_name,set_user_name]=useState("");
  const [ user,setuser] = useState();
  onAuthStateChanged(auth,(currentUser)=>{
    setuser(currentUser);
  });
  const signout = () => {
    if (user) {
      auth.signOut();
      window.location.href="/";
    }
  }
 

let curr_email="";
if(user){
  if(auth.currentUser){
   curr_email=auth.currentUser.email;
  }
const l1=curr_email.split(".")[0];
const l2=curr_email.split("@")[0];
const user_id=l1.length<l2.length? l1:l2;
const dbRef = ref(getDatabase());
get(child(dbRef, `users/${user_id}`)).then((snapshot) => {
  if (snapshot.exists()) {
    const user_detail=snapshot.val();
    set_user_name(user_detail.Name);
  } else {
    // document.getElementById("para").innerHTML="not avaiable";
    console.log("No data available");
  }
}).catch((error) => {
  console.error(error);
});
}

  return (
    <>
    
<div className="navbar">
<div className="nav_item"><Link className="Link" to="/"><img id="logo" src="diary_logo2.png" alt="My Diary" /></Link></div>
 <div className="nav_item"><Link className="Link" to="/"><HomeIcon className="icon" fontSize="medium"/><span>Home</span></Link></div>
  <div className="nav_item"><Link className="Link" to={user? "/message":"/alert"}><EmailIcon className="icon" fontSize="medium"/><span>Message</span></Link></div>
  <div className="nav_item"  ><Link className="Link" to={!user && "/login"}><LoginIcon className="icon" fontSize="medium"/><span onClick={signout}>{user ? 'Sign Out' : 'Sign In'}</span></Link></div>
  <div className="nav_item"><PersonIcon className="icon" fontSize="medium"/><span>{!user ? 'Guest': user_name}</span></div>
  {/* <div className="nav_item"><Link className="Link" to="/about"><InfoIcon className="icon" fontSize="medium"/><span>About</span></Link></div> */}
</div>

      
    </>
  )
}

export  {Header};

