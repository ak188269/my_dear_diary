import React,{useState} from 'react'
import { auth } from "./firebase";
import { getDatabase, ref, set,child,get } from "firebase/database";
import { toast } from 'react-toastify';
import { onAuthStateChanged } from "firebase/auth";
import "./All_Diary.css";
function All_Diary() {
    var CryptoJS = require("crypto-js");
    const [ user,setuser] = useState();
    onAuthStateChanged(auth,(currentUser)=>{
    setuser(currentUser);
    });

const [user_name,set_user_name]=useState("");
let curr_email="";
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
}
    const show_all_diaries=()=>{
        if(user){
       
          const dbRef = ref(getDatabase());
          get(child(dbRef, `Diaries/${user_id}`)).then((snapshot) => {
            if (snapshot.exists()) {
              let user_content=snapshot.val();
                // document.getElementById("showBtn").style.display="none";
                document.getElementById("all_diary").style.display="block";
                document.getElementById("all_diary").innerHTML+="<h4>Your previous diaries</h4>";
                // document.getElementById("closeBtn").style.display="block";
                let cnt=0;
                for(let key in user_content){
                
                  document.getElementById("all_diary").innerHTML+=`<div class="user_diary" id="the">${key}</div>`;
                  cnt++;
                }
                // document.getElementById("diary").innerHTML+=`<div class="user_diary" id="the">View All Diary</div>`;
                // document.getElementById("the").addEventListener("click",function(){window.print()});
                let elements=document.getElementsByClassName("user_diary");
                let i;
                for ( i = 0; i < elements.length; i++) {
                 
                  elements[i].addEventListener('click', show_full_diary);
              }
              document.getElementById("view").style.display="none";
            //   elements[i].addEventListener('click',show_all_diary);
             

                // document.getElementById("diary_btn").innerHTML="Hide Diary";

                // document.getElementById("myid").innerHTML=" hello";
               
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
      
    return (<>
        <div id="up">
           
        </div>
        <div id='all_diary'>
           
        </div>
        <button id="view" onClick={show_all_diaries}>view all</button>
     </>   
    )
}

export default All_Diary
