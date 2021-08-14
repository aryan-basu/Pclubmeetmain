import React, { useEffect, useRef, useState } from 'react';
import './Meeting.css'
import Peer from 'peerjs';
import { io } from 'socket.io-client';
import firebase from 'firebase';
import { useHistory, useLocation } from 'react-router-dom';
import TabPanel from './TabPanel'

const Meeting = (props) => {

    //firebase
    const history = useHistory();
    const location = useLocation();
    var user = firebase.auth().currentUser;
    if (user === null) {
        history.push('/');
    }
    //states
    const [peers, setPeers] = useState({})
    const [myId, setMyId] = useState('');
    const [stream, setStream] = useState();

    //setting up my video
    const videoGrid = useRef();
    const myVideo = document.createElement('video')
    //myVideo.muted = location.state.currentAudioState

    //helper function to add stream to video element
    const addVideoStream = (video, stream) => {
        video.srcObject = stream
        video.addEventListener('loadedmetadata', () => { //alert
            video.play() 
        })
        if (videoGrid.current)
            videoGrid.current.append(video);
    }

    //audio
    const handleAudioClick = () => {
        const enabled = stream.getAudioTracks()[0].enabled;
        if( enabled ){
            stream.getAudioTracks()[0].enabled = false;
            //render html
        }
        else{
            stream.getAudioTracks()[0].enabled = true;
            //render html
        }
    }

    //video
    const handleVideoClick = () => {
        const enabled = stream.getVideoTracks()[0].enabled;
        if( enabled ){
            stream.getVideoTracks()[0].enabled = false;
            //render html
        }
        else{
            stream.getVideoTracks()[0].enabled = true;
            //render html
        }
    }

    const connectToNewUser = (userId, stream, myPeer) => {
        const call = myPeer.call(userId, stream)
        const video = document.createElement('video')
        video.muted = true;
        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream)
        })
        call.on('close', () => {
            video.remove()
        })

        peers[userId] = call
    }

    const initializePeerEvents = (myPeer, socket) => {

        myPeer.on('open', id => {
            setMyId(id);
            socket.emit('join-room', props.match.params.roomId, id)
        })

        myPeer.on('error', (err) => {
            console.log('peer-connection-error', err);
            myPeer.reconnect();
        })
    }

    const initializeSocketEvents = (socket) => {

        socket.on('connect', () => {
            console.log('socket-connected');
        })

        socket.on('user-disconnected', userId => {
            if (peers[userId]) {
                peers[userId].close()
            }
        })

        socket.on('disconnect', () => {
            console.log('socket-disconnected');
        })

        socket.on('error', () => {
            console.log('socket-error');
        })
    }

    useEffect(() => {

        const socket = io("https://pclub-meet-backend.herokuapp.com/"); //initializing socket 
        const myPeer = new Peer(undefined, { // initialzing my peer object
            host: 'pclub-meet-backend.herokuapp.com',
            port: '443',
            path: '/peerjs',
            secure: true
        })


        navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        }).then(stream => {

            stream.getAudioTracks()[0].enabled = location.state.currentAudioState;
            stream.getVideoTracks()[0].enabled = location.state.currentVideoState;

            setStream(stream)
            addVideoStream(myVideo, stream)

            myPeer.on('call', call => {
                call.answer(stream)
                const video = document.createElement('video')
                video.muted = true;

                call.on('stream', userVideoStream => {
                    addVideoStream(video, userVideoStream)
                })

                call.on('close', () => {
                    video.remove()
                })
            })

            socket.on('user-connected', userId => {
                if (userId != myId) {
                    // user is joining
                    setTimeout(() => {
                        // user joined
                        connectToNewUser(userId, stream, myPeer)
                    }, 1000)
                }
            });

        })

        //socket.on('user-disconnected)
        initializeSocketEvents(socket);

        //myPeer.on('open')
        initializePeerEvents(myPeer, socket);


    }, [])



    return (
        <div>
            <div className="meeting-main">
                <div id="video-grid" ref = {videoGrid} >
                </div>
                <div className='medias'>
                    <div>
                        <i class="fas fa-hand-paper media-icon one" ></i>
                        <i class="fas fa-ellipsis-h media-icon two"></i>
                    </div>
                    <div class='mute'>
                        <i class="far fa-microphone media-icon three" onClick = { handleAudioClick } ></i>
                        <i class="far fa-phone media-icon four"></i>
                        <i class="far fa-video media-icon five" onClick = { handleVideoClick } ></i>
                    </div>
                    <div>
                        <i class="fas fa-user-friends media-icon six"></i>
                        <i class="far fa-comment-alt media-icon seven"></i>
                    </div>
                </div>
            </div>
            <TabPanel className='chats'/>            
        </div>

    );
}

export default Meeting;
