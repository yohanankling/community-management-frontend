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
import { getUserById } from '../services/authService';
import logo from '../assets/logo.png';

function UserDashboard() {
    const { user } = useUser();

    const [editableUser, setEditableUser] = useState(null);
    const [showAlert, setShowAlert] = useState(false);
    const [alertVariant, setAlertVariant] = useState("success");
    const [alertMessage, setAlertMessage] = useState("");
    const [loadingProfile, setLoadingProfile] = useState(true);

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (user && user.id) {
                setLoadingProfile(true);
                try {
                    const response = await getUserById(user.id);
                    console.log("Full user data from server:", response);

                    if (response.success && response.user) {
                        const serverUser = response.user;
                        const mappedUser = {
                            id: serverUser.authentication?.id || null,
                            email: serverUser.authentication?.email || null,
                            fullName: serverUser.details?.hebrew_name || serverUser.profile?.english_name || null,
                            linkedin: serverUser.details?.linkedin_url || null,
                            role: serverUser.profile?.role || null,
                            yearsOfExperience: serverUser.details?.years_of_xp || null,
                            is_manager: serverUser.authentication?.is_manager || false,
                            seniority: serverUser.profile?.seniority || null,
                            city: serverUser.details?.city || null,
                            phone: serverUser.details?.phone || null,
                            facebook_url: serverUser.details?.facebook_url || null,
                            description: serverUser.details?.description || null,
                        };
                        setEditableUser(mappedUser);
                        console.log("Mapped user data for form:", mappedUser);
                    } else {
                        console.error("Failed to fetch user data or no user found in response.");
                        setEditableUser(null);
                    }
                } catch (error) {
                    console.error("Error fetching user profile:", error);
                    setEditableUser(null);
                } finally {
                    setLoadingProfile(false);
                }
            } else if (!user) {
                setLoadingProfile(false);
                console.warn("No user context available.");
            } else if (!user.id) {
                setLoadingProfile(false);
                console.warn("User context exists but no ID found.");
            }
        };

        fetchUserProfile();
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

    if (loadingProfile) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                טוען פרופיל...
            </div>
        );
    }

    if (!editableUser) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                לא ניתן לטעון את פרטי הפרופיל.
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
                    <h2 className="mb-0 text-primary">הפרופיל שלי</h2>
                </header>

                <UserDashboardCards totalMembers={0} />

                <h3 className="mb-4 mt-4 text-primary">ערוך את הפרופיל שלך</h3>

                {showAlert && (
                    <Alert variant={alertVariant} onClose={() => setShowAlert(false)} dismissible>
                        {alertMessage}
                    </Alert>
                )}

                <Form className="bg-white p-4 rounded shadow-sm">
                    <Form.Group className="mb-3">
                        <Form.Label>שם מלא</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="הזן שם מלא"
                            name="fullName"
                            value={editableUser.fullName || ''}
                            onChange={handleUserChange}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>אימייל</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="הזן אימייל"
                            name="email"
                            value={editableUser.email || ''}
                            onChange={handleUserChange}
                            disabled
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>פרופיל לינקדאין</Form.Label>
                        <Form.Control
                            type="url"
                            placeholder="הזן קישור לפרופיל לינקדאין"
                            name="linkedin"
                            value={editableUser.linkedin || ''}
                            onChange={handleUserChange}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>תפקיד</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="הזן תפקיד"
                            name="role"
                            value={editableUser.role || ''}
                            onChange={handleUserChange}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>שנות ניסיון</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="הזן שנות ניסיון"
                            name="yearsOfExperience"
                            value={editableUser.yearsOfExperience || ''}
                            onChange={handleUserChange}
                            min="0"
                        />
                    </Form.Group>
                    <Button variant="primary" onClick={handleUpdateProfile}>
                        שמור שינויים
                    </Button>
                </Form>

            </Container>

            <UserBottomNavbar />
        </div>
    );
}

export default UserDashboard;