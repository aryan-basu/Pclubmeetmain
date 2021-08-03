import React, { useEffect, useState } from 'react';
import './Home.css'
import TextField from '@material-ui/core/TextField'
import InputAdornment from '@material-ui/core/InputAdornment'
import { AiOutlineArrowRight } from 'react-icons/ai'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import { RiAddBoxLine } from 'react-icons/ri'
import { useHistory } from 'react-router-dom';
import firebase from 'firebase';
const Home = (props) => {
    const history = useHistory();
    let textInput = React.createRef();
    var user = firebase.auth().currentUser;
    var fullname, email;
    if (user !== null) {
        fullname =user.displayName.split(' ')[0];
        email = user.email;
    }
   

   
    async function handleLogout() {
        await firebase.auth().signOut();
        history.push("/");
    };

    function handlejoin() {
     const code=textInput.current.value;
     if(code!=null)
     {
         history.push('/meeting/'+code)
     }
      }
    return (
        <div>
            <div className="home">
                <h4>Welcome {fullname} !</h4>
         
                <input type="text" ref={textInput} placeholder="Enter Meeting code" /> 
                <button onClick={handlejoin}>Join meet</button>
                <div className='lines'>
                    <div className='line-1'></div>
                    <p>or</p>
                    <div className='line-1'></div>
                </div>

                <Button onClick={() => { history.push({ pathname: '/preview' }) }} fullWidth={true} className='btn-meet'>
                    <InputAdornment>
                        <RiAddBoxLine className='btn-icon' />
                    </InputAdornment>
                    New Meet
                </Button>
                <Button onClick={handleLogout} className='btn mt-2'>Sign out</Button>
            </div>
        </div>
    );
}

export default Home;
