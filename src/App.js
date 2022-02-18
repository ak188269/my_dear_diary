import React, { useEffect,useState ,useReducer} from "react";
import "./App.css";
import {Link , BrowserRouter as Router , Switch , Route} from "react-router-dom";
import Diary from "./Diary";
import {Header} from "./Header";
import Login from './Login'
import Message from "./Message";
import About from "./About";
import Alert from "./Alert";
// import Register from "./Register";
import All_Diary from "./All_Diary";

function App() {
 
  return (
    <>
    <Router>
      <Header/>
      <Switch>
<Route exact path="/login">
  <Login/>
  </Route> 
  
  <Route exact path="/message">
    <Message/>
    </Route>
    {/* <Route exact path="/register" component={Register}/> */}
 
  {/* <Route  path="/about" >
  <About/>
  </Route> */}
  <Route exact path="/alert">
  <Alert/>

     </Route>
  <Route exact path="/my_all_diaries">
{/* <Diary/> */}
 <All_Diary/>
     </Route>
  <Route exact path="/">
   
  <Diary/>
  </Route> 
  </Switch>
    </Router>
  
  

</>
  )
  
}

export default App;