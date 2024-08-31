import React, { useState, useEffect } from 'react';
import './Navbar.css';
import Login from './login';
import logo from "./pic/3.png";
import { useNavigate } from 'react-router-dom';
export default function Navbar() {
    const [showLogin, setShowLogin] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    useEffect(() => {

        const email = localStorage.getItem("email");
        if (email) {
            setIsLoggedIn(true);
        }
    }, []);

    const openLogin = () => setShowLogin(true);
    const closeLogin = () => setShowLogin(false);

    const handleLogout = () => {
        localStorage.removeItem("email");
        localStorage.removeItem("name");
        localStorage.removeItem("phoneNumber");
        setIsLoggedIn(false);
        
    };

    return (
        <>
            <nav className="navbar">
                <div className="logo">
                    <img src={logo} alt="Logo" />
                    <h1>Colloab SHeet</h1>
                </div>
                <div className="nav-buttons">
                    {isLoggedIn ? (
                        <a href="/"><button className="nav-button" onClick={handleLogout}>Logout</button></a>
                        
                    ) : (
                        <button className="nav-button" onClick={openLogin}>Login/Signup</button>
                    )}
                </div>
            </nav>
            {showLogin && <Login show={showLogin} onClose={closeLogin} />}
        </>
    );
}
