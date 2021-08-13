import React from 'react';
import { FormControl, InputLabel, FormHelperText } from '@material-ui/core';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import PersonIcon from '@material-ui/icons/Person';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import Button from '@material-ui/core/Button'
import Email from '@material-ui/icons/Email'
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import './Signup.css'
import '../Login/Signin.css'
import '../Login/Signin'
import Header from '../Header/Header';
import { auth,createUserProfileDocument } from '../../firebase/firebase.utils';
import { withRouter } from 'react-router-dom';
class Signup extends React.Component{
constructor(){
    super();
    this.state={
        displayName:'',
        email:'',
        password:'',
        confirmPassword:'',
    }
}
handleSubmit=async event=>{
    event.preventDefault();
    const { history } = this.props;
    const {displayName,email,password,confirmPassword}=this.state;
    if(password !== confirmPassword){
        alert("password don't match");
        return;
    }
    try {
        const {user}=await auth.createUserWithEmailAndPassword(email,password);

        await user.updateProfile({
            displayName : displayName
        });

        await createUserProfileDocument(user,{displayName});
        this.setState({
            displayName:'',
            email:'',
            password:'',
            confirmPassword:'',
        })
        history.push('/home');
    }
    catch(error)
    {
        console.log(error);
    }
};
handleChange=event=>{
    const {name,value}=event.target;
    this.setState({[name]:value});
};
render(){
    const {displayName,email,password,confirmPassword}=this.state;
    return (
        <div>
            <Header currentUser={this.state.currentUser}/>
    
        <div className="signup-card">
             
            <FormControl className='form' onSubmit={this.handleSubmit} autoComplete="off">
                <h1>Sign Up</h1>
                <form  onSubmit={this.handleSubmit}>
                <Input
                    required
                    className='input'
                    name='displayName'
                    value={displayName}
                    onChange={this.handleChange}
                    placeholder='Full name'
                    label="Filled" variant="filled"
                    id="input-with-icon-adornment"
                    startAdornment={
                        <InputAdornment position="start" className='icons'>
                            <PersonIcon />
                        </InputAdornment>
                    }
                />
                <Input
                    className='input'
                    name='email'
                    value={email}
                    onChange={this.handleChange}
                    placeholder='Email'
                    label="Filled" variant="filled"
                    id="input-with-icon-adornment"
                    startAdornment={
                        <InputAdornment position="start" className='icons'>
                            <Email />
                        </InputAdornment>
                    }
                />
                <Input
                    className='input'
                    placeholder='Password'
                    name='password'
                    type='password'
                    value={password}
                    onChange={this.handleChange}
                    label="Filled" variant="filled"
                    id="input-with-icon-adornment"
                    startAdornment={
                        <InputAdornment position="start" className='icons'>
                            <VpnKeyIcon/>
                        </InputAdornment>
                    }
                />

                <Input
                    className='input'
                    type='password'
                    name='confirmPassword'
                    value={confirmPassword}
                    onChange={this.handleChange}
                    placeholder='Confirm Password'
                    label="Filled" variant="filled"
                    id="input-with-icon-adornment"
                    startAdornment={
                        <InputAdornment position="start" className='icons'>
                            <VpnKeyIcon />
                        </InputAdornment>
                    }
                />
                <Button variant="contained" type='submit'className='btn'>Signup</Button>
                </form>
                <p className='signup'>Already have an account, {" "}
                    <a
                        className='text-success'
                        href='Signin'>Signin</a>
                </p>
            </FormControl>
        </div>
        </div>
    );
}
}

export default withRouter( Signup);