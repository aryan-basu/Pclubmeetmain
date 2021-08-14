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
import Axios from 'axios';
import { useHistory, useLocation } from 'react-router-dom';
import firebase from 'firebase';
import Header from '../Header/Header';



const Preview = (props) => {

    //states & ref's
    const history = useHistory();
    const location = useLocation();
    //const location = useLocation();
    const [roomId, setroomId] = useState('');
    const myVideo = useRef()
    //stream
    const [stream,setStream] = useState();
    //states of audio & video
    const [audioState,setAudioState] = useState(true);
    const [videoState,setVideoState] = useState(true);


    //firebase
    var user = firebase.auth().currentUser;
    if (user === null) {
        history.push('/');
    }

    //audio
    const handleAudioClick = () => {
        const enabled = stream.getAudioTracks()[0].enabled;
        if( enabled ){
            stream.getAudioTracks()[0].enabled = false;
            setAudioState(false)
            //render html
        }
        else{
            stream.getAudioTracks()[0].enabled = true;
            setAudioState(true)
            //render html
        }
    }

    //video
    const handleVideoClick = () => {
        const enabled = stream.getVideoTracks()[0].enabled;
        if( enabled ){
            stream.getVideoTracks()[0].enabled = false;
            setVideoState(false)
            //render html
        }
        else{
            stream.getVideoTracks()[0].enabled = true;
            setVideoState(true)
            //render html
        }
    }

    //initial mounting
    useEffect(() => {

        navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        }).then(stream => {
            setStream(stream)
            if (myVideo.current) {
                myVideo.current.srcObject = stream
            }
        })


        if ( location.state.isInitiator ) {

            Axios.get('https://pclub-meet-backend.herokuapp.com/join').then(res => {
                setroomId(res.data.link)
                const inputLink = document.getElementById('input-with-icon-adornment text')
                inputLink.value = res.data.link
            })
            .catch((err) => console.log(err))

        }

        else{
            setroomId(location.state.roomId)
            const inputLink = document.getElementById('input-with-icon-adornment text')
            inputLink.value = location.state.roomId
        }

        // const videoButton = document.querySelector('#videoButton')
        // videoButton.addEventListener('click', () => console.log('clicked'))

    }, []); // passing location here ALERT



    //handle button join
    const handleJoin = () => {

        const newPath = '/meeting/' + roomId

        history.push({
            pathname: newPath,
            state: {
                currentAudioState : audioState,
                currentVideoState : videoState
            }
        })
    }

    return (
        <div>
             <Header/>
            <div className="preview-main">
                <h1 className='heading'>Room #1</h1>
                <Card className='card'>
                    <CardContent className='video'>
                        <video autoPlay ref={myVideo} />
                    </CardContent>
                    <CardActions className='card-buttons'>
                        <IconButton size="medium" className='preview-icon' onClick = { handleAudioClick } >
                            <BiMicrophone />
                        </IconButton>
                        <IconButton size="medium" className='preview-icon' onClick = { handleVideoClick } >
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
                                <IconButton onClick={() => { navigator.clipboard.writeText(roomId) }} >
                                    <IoCopySharp />
                                </IconButton>
                            </InputAdornment>
                        }
                    />
                    <Button onClick={handleJoin} className='btn'>Join Meet</Button>
                </div>
            </div>
        </div>
    );
}

export default Preview;
