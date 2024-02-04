import React from 'react';
import { FiHome } from 'react-icons/fi';
import { IoHeart } from 'react-icons/io5';
import { TbUserCancel } from 'react-icons/tb';
import { MdOutlineArchive } from 'react-icons/md';
import { IoSettingsOutline } from 'react-icons/io5';
import { FaRegUser } from 'react-icons/fa';
import { Link } from 'react-router-dom';

function Navbar({ userData }) {
    return (
        <div className="left-container">
                <div className="left-container-elements">
                        <div className="user-logo">
                            <div className="box">
                                    {userData.profilePicture ? 
                                    <img src={userData.profilePicture}/>
                                     :
                                <div className="profile-icon">
                                    <p>{userData.username && userData.username.slice(0,2)}</p>
                                </div>
                                     }
                                <div className="user-username">
                                    <p>@{userData?.username?.slice(0,10)}</p>
                                </div>
                            </div>
                        </div>
                        <div className="navbar-elements nav-links">
                            <div>
                                <div className="nav-items">
                                    <Link to='/home'><FiHome size={25} /></Link>
                                </div>
                                <div className="nav-items">
                                    <Link to='/favourites'><IoHeart size={28}/></Link>
                                </div>
                                <div className="nav-items">
                                    <Link to='/blocked'><TbUserCancel size={28} /></Link>
                                </div>
                                <div className="nav-items">
                                    <Link><MdOutlineArchive size={28} /></Link>
                                </div>
                            </div>
                        </div>
                        <div className="navbar-elements user-options-container">
                            <div>
                                <div className="user-options">
                                    <Link><FaRegUser size={25} /></Link>
                                </div>
                                <div className="user-options">
                                    <Link to='/settings'><IoSettingsOutline size={25} /></Link>
                                </div>
                            </div>
                        </div>
                </div>
            </div>
    );
}

export default Navbar;
