import React,{useState} from 'react'
import "./Diary.css"
import {Link} from "react-router-dom";
import { border } from '@mui/system';
import {onAuthStateChanged} from "firebase/auth";
import { auth } from "./firebase";
import { getDatabase, ref, set,child,get } from "firebase/database";
import { toast } from 'react-toastify';


function Diary() {
  var CryptoJS = require("crypto-js");
    let time=new Date().toLocaleTimeString();
    let date=new Date();
    // date.getDate();
    const [ user,setuser] = useState();
    onAuthStateChanged(auth,(currentUser)=>{
    setuser(currentUser);
    });
   
const dbRef = ref(getDatabase());
const [user_name,set_user_name]=useState("");
let curr_email="";
let display=user? "none":"block";
let display2=user? "block":"none";
let user_id="";

if(user){
    if(auth.currentUser){
     curr_email=auth.currentUser.email;
    }
  const l1=curr_email.split(".")[0];
  const l2=curr_email.split("@")[0];
   user_id=l1.length<l2.length? l1:l2;
  const dbRef = ref(getDatabase());
  // getting users details

  get(child(dbRef, `users/${user_id}`)).then((snapshot) => {
    if (snapshot.exists()) {
      const user_detail=snapshot.val();
      set_user_name(user_detail.Name);
    } else {
      console.log("No data available");
    }
  }).catch((error) => {
    console.error(error);
  });
  // getting user dairy record
  }
  let size=0;
  const number=()=>{
    get(child(dbRef, `Diaries/${user_id}`)).then((snapshot) => {
      if (snapshot.exists()) {
        let user_content=snapshot.val();
      for(let key in user_content){
                size++;
      }
      document.getElementById("number").innerHTML=` ${size}`;
    }
  });
  // document.getElementById("number").innerHTML=` ${size}`;
  return ` ${size}`;
  }
 const show_diary=()=>{
  if(user){
    const dbRef = ref(getDatabase());
    get(child(dbRef, `Diaries/${user_id}`)).then((snapshot) => {
      if (snapshot.exists()) {
        let user_content=snapshot.val();
          document.getElementById("showBtn").style.display="none";
          document.getElementById("diary").style.display="block";
          document.getElementById("diary").innerHTML+="<h4>Your previous diary</h4>";
          document.getElementById("closeBtn").style.display="block";
          let cnt=0;
          for(let key in user_content){
            if(cnt===5)
            break;
            document.getElementById("diary").innerHTML+=`<div class="user_diary" >${key}</div>`;
            cnt++;
          }
  
          let elements=document.getElementsByClassName("user_diary");
          let i;
          for ( i = 0; i < elements.length; i++) {
           
            elements[i].addEventListener('click', show_full_diary);
        }
    
          document.getElementById("viewAllDiary").style.display="block";
          document.getElementById("diary_btn").innerHTML="Hide Diary";
      
         
      } else {
        toast.error("You have not written any Diary yet . Write your diary",{position:"top-center"})
        console.log("No data available");
      }
    }).catch((error) => {
      console.error(error);
    });
  }
}

const show_full_diary=(e)=>{
  let date=e.target.innerHTML;
  const dbRef = ref(getDatabase());
  get(child(dbRef, `Diaries/${user_id}/${date}`)).then((snapshot) => {
      if (snapshot.exists()) {
          let content=snapshot.val().Content;
          var user_content = CryptoJS.AES.decrypt(content.toString(), 'my-secret-key@123').toString(CryptoJS.enc.Utf8);
          // let user_content = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
          // console.log(user_content);
          let  newwindow=window.open("","","toolbar=yes,scrollbars=yes,resizable=yes,top=50,left=30%,width=600,height=600");
          let write=`<style>.photo{width:120px;height:120px;margin: 0px auto;font-weight:bold;}#diary_content{font-size:20px;font-style:italic;margin:50px auto;}#btn{width:110px;margin:60px auto;display:block; cursor:pointer;}@media print {#btn{display: none;}@page { size: auto;  margin: 0mm; }#diary_content{font-size:25px;}} .item{margin:20px;} #name{position:absolute;right:20px;} </style><div class="photo" ><img class="photo" src="diary_logo.png" alt="" /></div><div id="diary_content"><div class="item">${date}</div><div class="item">${user_content}</div><div id="name">${user_name}</div></div><button onClick="window.print()" id="btn">Print</button>`;
      newwindow.document.write(write);
  }
});
}

function hide_diary(){
    document.getElementById("diary").innerHTML="";
    document.getElementById("diary").style.display="none";   
    document.getElementById("showBtn").style.display="block";   
    document.getElementById("closeBtn").style.display="none";   
    document.getElementById("viewAllDiary").style.display="none";   
    
  }


    function saveDiary(){
      if(user){
        if(auth.currentUser){
            curr_email=auth.currentUser.email;
           }
         const l1=curr_email.split(".")[0];
         const l2=curr_email.split("@")[0];
         const user_id=l1.length<l2.length? l1:l2;
         const db = getDatabase();
         var diary_content= document.getElementById("diary_content");
       
       if(diary_content.value===""){
         toast("Diary was empty ! Please write something to save ",{position:"top-center"});
         return;
       }
       let d=new Date().toDateString();
      //  checking if diary of the same day already exits 
      const dbRef = ref(getDatabase());
      get(child(dbRef, `Diaries/${user_id}/${d}`)).then((snapshot) => {
          if (snapshot.exists()) {
              let user_content=snapshot.val().Content;
            let prev_content=  document.getElementById("prev_content");
            prev_content.innerHTML=user_content;
            var prev_content_of_user = CryptoJS.AES.decrypt(prev_content.innerHTML.toString(), 'my-secret-key@123').toString(CryptoJS.enc.Utf8);
            var encrypted_content = CryptoJS.AES.encrypt(prev_content_of_user+" "+diary_content.value, 'my-secret-key@123').toString();
              set(ref(db, `Diaries/${user_id}/${d}`), {
                Content:encrypted_content

                     })
                     .then(()=>{toast.success("Diary Saved Successfully",{position:'top-center'}); })
                       .catch((error)=>{
                           toast.error("error occured "+error);
                       });
          }
          else {
            var encrypted_content = CryptoJS.AES.encrypt(diary_content.value, 'my-secret-key@123').toString();
            set(ref(db,`Diaries/${user_id}/${d}`), {
              // Content:diary_content.value
              Content:encrypted_content
                   })
                   .then(()=>{toast.success("Diary Saved Successfully",{position:'top-center'}); })
                     .catch((error)=>{
                         toast.error("error occured "+error);
                     });
          }
          document.getElementById("diary").innerHTML="";

          show_diary();
     diary_content.value="";
        });

      }
    }
const [ctime,setctime]=useState(time);
setInterval(get_time,1000);
    function get_time(){
        time=new Date().toLocaleTimeString();
        setctime(time)
    }
  
   
 
  

    return (
        <>
        
            <style>
    {'@media print {#first{display: none; #second{margin:0;}}}'}
              </style>
                      
            <div className="content" >
                {/* book photo start here */}
            <div className="containers" ><img id="photo" src="diary_logo.png" alt="" /></div>

            {/* user cart start here */}

                <div className="containers" id="first" >
                    <div id="user" className="detail">
                        <div className="user_info"> 
    
  
                    <img id="user_logo" src="user_logo.png" alt="" /></div> 
                    <div className="user_info"><h2>{!user ? "Guest":user_name}</h2> Number of entries :<span id="number">{!user ? 0 : number()}</span> <br /> 
                    Date :  {date.toDateString()}<br /> <span id="time">Time : {ctime}</span></div>  
                    </div>
                
                    {/* Diary details start here */}

                    <div id="diary" className="detail">
                      <Link to={!user && "/alert"}>
                        <h4 id="prev"></h4>
    
                        <div className="user_diary" style={{display:display}}>Diary 1</div>
                        <div className="user_diary" style={{display:display}}>Diary 2</div>
                        <div className="user_diary" style={{display:display}}>Diary 3</div>
                        <div className="user_diary" style={{display:display}}>Diary 4</div>
                        <div className="user_diary" style={{display:display}}>Diary 5</div>
                       
                        <span className='see_all'style={{display:display}}>See All </span>
                        </Link>
                        </div>
                        <div className="user_diar" id='viewAllDiary'>
                           {/* <a href="/my_all_diaries"> */}
                           <Link to="/my_all_diaries">
                           View All Diary
                           </Link>
                           {/* </a> */}
                           </div>
                        <div id="showBtn" className='see_all' onClick={show_diary} style={{display:display2}}>Show My Diary</div>
                        <div id="closeBtn" className='see_all' onClick={hide_diary} style={{display:"none"}}> Hide Diary</div>
                     
                     
                      
                </div>

              {/* TExt area starts here */}

                <div className="containers" id="second" >
                  <Link to={!user && "/alert"}>
                    <div id="heading"><h3>My Dear Diary</h3></div>
                    <textarea  id="diary_content" cols="50" rows="30" ></textarea>
                   <div className="btn" onClick={ saveDiary}> <input type="button"  value="Save Diary " /></div>
                   </Link>
                 {/* { for(let i=0;i<4;i++){console.log(i);}} */}
                </div>
         <div id="prev_content"></div>
            </div>


        </>
    )
   

}

export default Diary
