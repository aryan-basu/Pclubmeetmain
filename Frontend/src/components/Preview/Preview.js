import React, { useEffect, useState, useRef } from 'react';
import Card from '@material-ui/core/Card'
import './Preview.css'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import IconButton from '@material-ui/core/IconButton'
import { BiMicrophone } from 'react-icons/bi'
import { IoVideocamOutline } from 'react-icons/io5'
import Input from '@material-ui/core/Input'
import InputAdornment from '@material-ui/core/InputAdornment'
import { IoCopySharp } from 'react-icons/io5'
import Button from '@material-ui/core/Button'
import styled from "styled-components";
import Axios from 'axios';
import { useHistory } from 'react-router-dom';
import firebase from 'firebase';



const Preview = () => {

    //states & ref's
    const history = useHistory();
    const [roomId, setroomId] = useState('');
    const myVideo = useRef()
 

    //firebase
    var user = firebase.auth().currentUser;
    if(user===null)
    {
      history.push('/');
    }
    //initial mounting
    useEffect(() => {
        
        navigator.mediaDevices.getUserMedia({ 
            video: true, 
            audio: true
         }).then(stream => {
            if( myVideo.current ){
                myVideo.current.srcObject = stream
            }
        })


        Axios.get('https://pclub-meet-backend.herokuapp.com/join').then( res => {
            setroomId(res.data.link)
            const inputLink = document.getElementById('input-with-icon-adornment text')    
            inputLink.value = res.data.link
        } )
        .catch( (err) => console.log(err) )

    }, []); // passing location here ALERT

    

    //handle button join
    const handleJoin = () => {

        const newPath = '/meeting/' + roomId

        history.push({
            pathname : newPath
        })
    } 

    return (
        <div>
            <div className="preview-main">
                <h1 className='heading'>Room #1</h1>
                <Card className='card'>
                    <CardContent className='video'>
                        <video  autoPlay muted ref = {myVideo}/>
                    </CardContent>
                    <CardActions className='card-buttons'>
                        <IconButton size="medium" className='preview-icon'>
                            <BiMicrophone />
                        </IconButton>
                        <IconButton size="medium" className='preview-icon'>
                            <IoVideocamOutline />
                        </IconButton>
                    </CardActions>
                </Card>
                <Input type="text" variant="filled" className='username' placeholder='Add Username' />
                <div className='join'>
                    <Input
                        className='input'
                        placeholder='Some text to copy'
                        label="Filled" variant="filled"
                        id="input-with-icon-adornment text"
                        endAdornment={
                            <InputAdornment position="end" >
                                <IconButton onClick = {() => {navigator.clipboard.writeText(roomId)} } >
                                    <IoCopySharp />
                                </IconButton>
                            </InputAdornment>
                        }
                    />
                    <Button onClick = {handleJoin} className='btn'>Join Meet</Button>
                </div>
            </div>
        </div>
    );
}

export default Preview;
