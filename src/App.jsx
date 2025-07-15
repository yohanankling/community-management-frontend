import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { UserProvider } from './context/UserProvider';

import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import UserDashboard from "./pages/UserDashboard.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ConnectionsDashboard from "./components/connections/ConnectionsDashboard.jsx";
import RequestsDashboard from "./pages/RequestsDashboard.jsx";

function App() {
    return (
        <BrowserRouter>
            <UserProvider>
                <Routes>
                    <Route path="/login" element={<Login/>} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/user-dashboard" element={<UserDashboard />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/" element={<Navigate to="/login" replace />} />
                    <Route path="*" element={<Navigate to="/login" replace />} />
                    <Route path="/connections" element={<ConnectionsDashboard />} />
                    <Route path="/requests" element={<RequestsDashboard />} />
                </Routes>
            </UserProvider>
        </BrowserRouter>
    );
}

export default App;
