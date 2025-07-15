import React, { useState, useEffect } from "react";
import UserBottomNavbar from "../components/layout/UserBottomNavbar.jsx";
import {
    Container,
    Form,
    Button,
    Alert
} from "react-bootstrap";
import UserDashboardCards from "../components/dashboard/UserDashboardCards.jsx";
import { useUser } from '../context/UserProvider';

import logo from '../assets/logo.png';

function UserDashboard() {
    const { user } = useUser();

    const [editableUser, setEditableUser] = useState(null);
    const [showAlert, setShowAlert] = useState(false);
    const [alertVariant, setAlertVariant] = useState("success");
    const [alertMessage, setAlertMessage] = useState("");

    useEffect(() => {
        if (user) {
            setEditableUser(user);
        }
    }, [user]);

    const handleUserChange = (e) => {
        const { name, value } = e.target;
        setEditableUser((prevUser) => ({
            ...prevUser,
            [name]: value,
        }));
    };

    const handleUpdateProfile = () => {
        console.log("Updating user profile:", editableUser);
        setAlertVariant("success");
        setAlertMessage("Profile updated successfully!");
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
    };

    if (!editableUser) {
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
                <header style={{ display: 'flex', alignItems: 'center', paddingBottom: '20px', borderBottom: '1px solid #eee', marginBottom: '20px' }}>
                    <a href="/user-dashboard" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}>
                        <img src={logo} alt="Home" style={{ height: '40px', marginRight: '10px' }} />
                    </a>
                    <h2 className="mb-0 text-primary">My Profile</h2>
                </header>

                <UserDashboardCards totalMembers={0} />

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
                            value={editableUser.fullName || ''}
                            onChange={handleUserChange}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Enter email"
                            name="email"
                            value={editableUser.email || ''}
                            onChange={handleUserChange}
                            disabled
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>LinkedIn Profile</Form.Label>
                        <Form.Control
                            type="url"
                            placeholder="Enter LinkedIn profile link"
                            name="linkedin"
                            value={editableUser.linkedin || ''}
                            onChange={handleUserChange}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Role</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter role"
                            name="role"
                            value={editableUser.role || ''}
                            onChange={handleUserChange}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Years of Experience</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="Enter years of experience"
                            name="yearsOfExperience"
                            value={editableUser.yearsOfExperience || ''}
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