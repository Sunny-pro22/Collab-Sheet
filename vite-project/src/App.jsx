import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Navbar from './Navbar';
import Scene from './Scene';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Past from './past';
import Spreadsheet from './spd';
function App() {
    return (
        <>
            <Navbar />
            <Router>
           
                <Routes>
                
                    <Route path="/" element={<Home />} />
                    <Route path="/past" element={<Past />} />
                    <Route path="/sheet" element={<Spreadsheet />} />
                    <Route path="/data/:id" element={<Spreadsheet />} />
                    
                </Routes>
            </Router>
        </>
    );
}

export default App;
