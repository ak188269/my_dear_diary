import React,{useState} from 'react'
import "./Message.css";
import {Link} from "react-router-dom";
import { getDatabase, ref, set,child,get } from "firebase/database";
import {auth} from "./firebase";
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
toast.configure()

function Message() {
  const dbRef = ref(getDatabase());
  const send_message=()=>{
    let user_message=document.getElementById("user_message").value;
    if(user_message===""){
    toast("Message Box was empty ! Write something to send",{position:"top-center"});
    return;
    }
    const db=getDatabase();  
    const email=auth.currentUser.email;
    const l1=email.split(".")[0];
    const l2=email.split("@")[0];
const user_id=l1.length<l2.length? l1:l2;   
// gettiing user name
get(child(dbRef, `users/${user_id}`)).then((snapshot) => {
  if (snapshot.exists()) {
    const user_detail=snapshot.val();
    const userName=user_detail.Name;
    console.log("user name  ",userName);
    set(ref(db, "User's Message/" + userName), {
      Email:email,
    Message:user_message
          })
          .then(()=>{toast.success("Message Send Successfully",{position:'top-center'}); })
            .catch((error)=>{
                toast.error("error occured "+error);
            });
  } else {
    console.log("No data available");
  }
}).catch((error) => {
  console.error(error);
});

        }
    return (
        <>
            <div id="message">
  <div id="content">
    <h3 id="heading_info">Write your message here</h3>
    <form action="">
    <textarea  id="user_message" cols="30" rows="10" required></textarea><br />
   <Link to="/" className="close_btn"> <button id="cl_btn">Close</button></Link>
   <Link to="/" className="send_btn"> <input id="send" type="button" value="Send Message" onClick={send_message} /> </Link>
    </form>
  </div>
  
</div>
        </>
    )
}

export default Message
