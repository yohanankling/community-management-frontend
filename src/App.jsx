import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Register from "./pages/Register.jsx"; // Ensure Register.jsx is correctly imported
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from "./pages/Login.jsx";
import UserDashboard from "./pages/UserDashboard.jsx";
import Dashboard from "./pages/Dashboard.jsx";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/*
                  Corrected: Render the Register component as a JSX element (<Register />)
                  The 'element' prop expects a React Node (e.g., a JSX element),
                  not the component function itself.
                */}
                <Route path="/login" element={<Login/>} /> {/* This can be an actual Login component later */}
                <Route path="/register" element={<Register />} />
                <Route path="/user-dashboard" element={<UserDashboard />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="*" element={null} /> {/* Catch-all for undefined routes, can be a 404 page */}
            </Routes>
        </BrowserRouter>
    );
}

export default App;
