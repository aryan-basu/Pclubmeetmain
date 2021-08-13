import React from 'react';
import { BrowserRouter as Router, Switch, Route, BrowserRouter } from "react-router-dom";
import Header from './components/Header/Header';
import Signin from './components/Login/Signin'
import Signup from './components/Signup/Signup';
import Meetend from './components/Meetend/Meetend';
import Meeting from './components/Meeting/Meeting';
import Preview from './components/Preview/Preview';
import Home from './components/Home/Home'
import {auth,createUserProfileDocument, } from './firebase/firebase.utils';

class App extends React.Component{
  constructor(){
    super();
    this.state={
      currentUser:null
    }
  }
  unsubscribeFromAuth = null
  componentDidMount(){
    this.unsubscribeFromAuth=auth.onAuthStateChanged(async userAuth=>{

      //this.setState({currentUser:user});
      //console.log(user);
     // createUserProfileDocument(user);
     if(userAuth){
      const userRef=await createUserProfileDocument(userAuth);


       userRef.onSnapshot(onSnapshot=>{

        this.setState({
          currentUser:{
            id:onSnapshot.id,
            ...onSnapshot.data()

          }
        });
     console.log(this.state);

       });

     }
     else{
      this.setState({currentUser:userAuth}) ;
     }


    });
  }

  componentWillUnmount(){
    this.unsubscribeFromAuth();
  }
  render(){

    
  return (
  
    <div>
    
  
   

      <Router>
     
        <Switch>
          <Route path='/' exact component={Signin} />
          <Route path='/signin' exact component={Signin} />
          <Route path='/signup' exact component={Signup} />
          <Route path='/meetend' exact component={Meetend} />
          <Route path='/home' exact component={Home} />
          <Route path='/meeting/:roomId' exact component={Meeting} />
          <Route path='/preview' exact component={Preview} />
        </Switch>
      </Router>
    
    </div>
  );
  }
}

export default App;