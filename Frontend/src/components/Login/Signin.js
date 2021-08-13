import React from 'react';
import { FormControl, InputLabel, FormHelperText } from '@material-ui/core';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import PersonIcon from '@material-ui/icons/Person';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import Button from '@material-ui/core/Button'
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import './Signin.css'
import firebase from 'firebase';
import { useHistory } from 'react-router';
import { auth } from '../../firebase/firebase.utils';
import { withRouter } from 'react-router-dom';
import Header from '../Header/Header';


class Signin extends React.Component  {
    constructor(props){
    super(props);
    this.state={
        email:'',
        password:''
    };
}

 handleSubmit= async event=>{
    const { history } = this.props;
    event.preventDefault();
  const {email,password}=this.state;
   try {
      await auth.signInWithEmailAndPassword(email,password)
      var user = firebase.auth().currentUser;
    console.log(user);
      if(user!=null)
      {
       //this.setState({email:'',password:''});
     history.push('/home');
      }
      else
      {
          history.push('/');
      }
   } catch (error) {
       console.log(error);
   }

};





handleChange=event=>{
    const {name,value}=event.target;
    this.setState({[name]:value});
};
 render(){
    const { history } = this.props;
    var uiConfig = {
        signInFlow: "popup",
        signInSuccessUrl: '/home',
        signInOptions: [
            firebase.auth.GoogleAuthProvider.PROVIDER_ID,

            firebase.auth.GithubAuthProvider.PROVIDER_ID
        ],
        tosUrl: '<your-tos-url>',
        // Privacy policy url.
        privacyPolicyUrl: '<your-privacy-policy-url>'
    };
    const {email,password}=this.state;
    return (
    
        <div>
              <Header currentUser={this.state.currentUser}/>
            <div className="main-body">
                    <div className="desc">
                        <h2>Introducing a free and secure video calling service accessible for all.</h2>
                        <p>For more information, visit {" "}
                            <a
                                className='text-success'
                                href={" https://www.pclubmeet.com/ "}>PClub</a>
                        </p>
                    </div>
                    <div className="card">
                        <h1>Sign In</h1>
                        <FormControl className='form'autoComplete="off">
                            <form onSubmit={this.handleSubmit}>
                            <Input
                            required
                                className='input'
                                placeholder='Email'
                                name='email'
                             type="email"

                                   onChange={this.handleChange}
                                    value={email}
                                label="Filled" variant="filled"
                                id="input-with-icon-adornment"
                                startAdornment={
                                    <InputAdornment position="start" className='icons'>
                                        <PersonIcon />
                                    </InputAdornment>
                                }
                            />
                            <Input
                            required
                                className='input'
                                placeholder='Password'
                                type='password'
                                name='password'
                               // value={this.state.password}
                               value={password}
                                onChange={this.handleChange}
                               // value={password}
                                label="Filled" variant="filled"
                                id="input-with-icon-adornment"
                                startAdornment={
                                    <InputAdornment position="start" className='icons'>
                                        <VpnKeyIcon />
                                    </InputAdornment>
                                }
                            />
                            <Button variant="contained" type='submit'className='btn'>Login</Button>

                            <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()}/>
                            <p className='signup'>Don't have an account, {" "}
                                <a
                                className='text-success'
                                href='Signup'>Signup</a>
                            </p>
                            </form>
                        </FormControl>
                    </div>
            </div>
        </div>
    );
}
}

export default withRouter( Signin);