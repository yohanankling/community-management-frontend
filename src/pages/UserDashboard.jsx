import React, { useState, useEffect } from "react";
import UserBottomNavbar from "../components/layout/UserBottomNavbar.jsx";
import {
    Container,
    Form,
    Button,
    Alert
} from "react-bootstrap";
import mockUsers from "../data/mockUsers";
import UserDashboardCards from "../components/dashboard/UserDashboardCards.jsx";

import logo from '../assets/logo.png';

function UserDashboard() {
    // For a user dashboard, we'd typically load the current user's data.
    // For this example, let's assume the first user in mockUsers is the current user.
    const [currentUser, setCurrentUser] = useState(null);
    const [showAlert, setShowAlert] = useState(false);
    const [alertVariant, setAlertVariant] = useState("success");
    const [alertMessage, setAlertMessage] = useState("");

    useEffect(() => {
        // In a real application, you'd fetch the logged-in user's data
        // For now, let's pick a mock user
        if (mockUsers.length > 0) {
            setCurrentUser(mockUsers[0]);
        }
    }, []);

    const handleUserChange = (e) => {
        const { name, value } = e.target;
        setCurrentUser((prevUser) => ({
            ...prevUser,
            [name]: value,
        }));
    };

    const handleUpdateProfile = () => {
        // In a real application, you would send this data to a backend API
        console.log("Updating user profile:", currentUser);
        setAlertVariant("success");
        setAlertMessage("Profile updated successfully!");
        setShowAlert(true);
        // Simulate API call success/failure
        setTimeout(() => setShowAlert(false), 3000);
    };

    if (!currentUser) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                Loading profile...
            </div>
        );
    }

    return (
        <div className="d-flex flex-column vh-100">
            <Container
                fluid
                className="p-4 bg-light flex-grow-1 dashboard-main-content"
                style={{
                    overflowY: 'auto',
                }}
            >
                {/* Home Page Button with Logo */}
                <header style={{ display: 'flex', alignItems: 'center', paddingBottom: '20px', borderBottom: '1px solid #eee', marginBottom: '20px' }}>
                    <a href="/user-dashboard" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}>
                        <img src={logo} alt="Home" style={{ height: '40px', marginRight: '10px' }} />
                    </a>
                    <h2 className="mb-0 text-primary">My Profile</h2>
                </header>

                {/* Render the UserDashboardCards component */}
                {/* totalMembers here might represent the total community members, not just the current user */}
                <UserDashboardCards totalMembers={mockUsers.length} />

                <h3 className="mb-4 mt-4 text-primary">Edit Your Profile</h3>

                {showAlert && (
                    <Alert variant={alertVariant} onClose={() => setShowAlert(false)} dismissible>
                        {alertMessage}
                    </Alert>
                )}

                <Form className="bg-white p-4 rounded shadow-sm">
                    <Form.Group className="mb-3">
                        <Form.Label>Full Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter full name"
                            name="fullName"
                            value={currentUser.fullName}
                            onChange={handleUserChange}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Enter email"
                            name="email"
                            value={currentUser.email}
                            onChange={handleUserChange}
                            disabled // Email might not be editable
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>LinkedIn Profile</Form.Label>
                        <Form.Control
                            type="url"
                            placeholder="Enter LinkedIn profile link"
                            name="linkedin"
                            value={currentUser.linkedin}
                            onChange={handleUserChange}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Role</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter role"
                            name="role"
                            value={currentUser.role}
                            onChange={handleUserChange}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Years of Experience</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="Enter years of experience"
                            name="yearsOfExperience"
                            value={currentUser.yearsOfExperience}
                            onChange={handleUserChange}
                            min="0"
                        />
                    </Form.Group>
                    <Button variant="primary" onClick={handleUpdateProfile}>
                        Save Changes
                    </Button>
                </Form>

            </Container>

            <UserBottomNavbar />
        </div>
    );
}

export default UserDashboard;