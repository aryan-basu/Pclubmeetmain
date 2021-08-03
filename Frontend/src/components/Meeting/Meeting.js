import React, { useEffect, useRef, useState } from 'react';
import './Meeting.css'
import Peer from 'peerjs';
import { io } from 'socket.io-client';
import firebase from 'firebase';
import { useHistory } from 'react-router-dom';

const Meeting = (props) => {
   

    //firebase
    const history = useHistory();
    var user = firebase.auth().currentUser;
    if(user===null)
    {
      history.push('/');
    }
      //states
    const [peers, setPeers] = useState({})
    const [myId, setMyId] = useState('');

    //setting up my video
    const videoGrid = useRef();
    const myVideo = document.createElement('video')
    myVideo.muted = true

    //helper function to add stream to video element
    const addVideoStream = (video, stream) => {
        video.srcObject = stream
        video.addEventListener('loadedmetadata', () => {
            video.play()
        })
        if(videoGrid.current)
        videoGrid.current.append(video);
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

    const initializePeerEvents = (myPeer,socket) => {
        
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
            if (peers[userId]){
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
            path: '/peerjs'
        })
        

        navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        }).then(stream => {
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
                if( userId != myId ){
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
        initializePeerEvents(myPeer,socket);


    }, [])

    return (

        <div className="meeting-main">
            <div id="video-grid" ref = {videoGrid}  ></div>
        </div>

    );
}

export default Meeting;
