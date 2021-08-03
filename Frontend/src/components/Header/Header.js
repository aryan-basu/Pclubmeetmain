import React from 'react';
import Clock from 'react-live-clock';
import './Header.css';
import IconButton from '@material-ui/core/IconButton';
import { IoMdPerson } from 'react-icons/io';
import Logo from '../assets/images/Logo.png';

import firebase from 'firebase';
import { useHistory } from 'react-router-dom';

const Header = ({currentUser}) => {

    const d = new Date();
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const weeks = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

    return (
        <div>
            <section className='main'>
                <div className="header">
                    <div className="time">
                        <Clock format={'hh:mm A'} ticking={true} className='clock' />
                        <p>{weeks[d.getDay()]}, {months[d.getMonth()]} {d.getDate()}, {d.getFullYear()}</p>
                    </div>
                    <div className="logos">

                        <img src={Logo} alt="" className='logo' />
                        <div className="line"></div>
                        <h1>Meetings</h1>
                    </div>
                    <IconButton className='button'>
                        <IoMdPerson className='icons' />
                    </IconButton>
                </div>
            </section>
        </div>
    );
}

export default Header;