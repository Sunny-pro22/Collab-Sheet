import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from "gsap";
import Navbar from './Navbar';
import Sheet from './spd';
import Croom from './m'; 
import img1 from "./pic/img1.png";
import { useGSAP } from "@gsap/react";
import './App.css';
import Login from './login';
import Past from './past';

export default function Home() {
    const [showLogin, setShowLogin] = useState(false);
   
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();
    
    const checkUserLogin = () => {
        const userEmail = localStorage.getItem('email');
        return !!userEmail; 
    };

    const handleCreateClick = () => {
        if (checkUserLogin()) {
            navigate("/past");
        } else {
            setShowLogin(true);
        }
    };

    const handleModalClick = () => {
        if (checkUserLogin()) {
            setShowModal(prev => !prev);
        } else {
            setShowLogin(true);
        }
    };

    const closeLogin = () => {
        setShowLogin(false);
    };

    useGSAP(() => {
        gsap.from(".img", {
            x: -700,
            delay: 1,
            duration: 1
        });
        gsap.from(".h1", {
            y: 100,
            delay: 1,
            duration: 0.5,
            opacity: 0
        });
        gsap.from(".h2", {
            y: 100,
            delay: 1.5,
            duration: 0.5,
            opacity: 0
        });
        gsap.from(".button-container", {
            y: 100,
            delay: 1.7,
            duration: 0.5,
            opacity: 0
        });
    });

    return (
        <>
            <div className="container">
                <div className="content">
                    <img className="img" src={img1} alt="Interactive" />
                    <div className="text-section">
                        <div className="txt">
                            <h1 className='h1'>COLLAB SHEET</h1>
                            <h2 className='h2'>is an advanced user-friendly spreadsheet application designed to empower collaboration.</h2>
                        </div>
                        
                        {!showModal && (
                            <div className="button-container">
                                <button className="create-button" onClick={handleCreateClick}>
                                    Create
                                </button>
                                <button className="edit-button" onClick={handleModalClick}>
                                    Edit a Sheet
                                </button>
                            </div>
                        )}
                        {showModal && <Croom onClose={handleModalClick} />} 
                    </div>
                </div>
            </div>
            {showLogin && <Login show={showLogin} onClose={closeLogin} />}
        </>
    );
}
