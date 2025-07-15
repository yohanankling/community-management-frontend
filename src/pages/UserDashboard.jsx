import React, { useState, useEffect, useCallback } from "react";
import UserBottomNavbar from "../components/layout/UserBottomNavbar.jsx";
import {
    Container,
    Form,
    Button,
    Alert,
    Spinner
} from "react-bootstrap";
import UserDashboardCards from "../components/dashboard/UserDashboardCards.jsx";
import { useUser } from '../context/UserProvider';
import { getUserById } from '../services/authService.jsx';
import { updateUser } from '../services/userService';
import logo from '../assets/logo.png';
import { useLocation } from 'react-router-dom';

function UserDashboard() {
    const { user, login } = useUser();
    const location = useLocation();

    const [editableUser, setEditableUser] = useState(null);
    const [showAlert, setShowAlert] = useState(false);
    const [alertVariant, setAlertVariant] = useState("success");
    const [alertMessage, setAlertMessage] = useState("");
    const [loadingProfile, setLoadingProfile] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);

    const fetchUserProfile = useCallback(async (initialUserId = null) => {
        const userIdToFetch = initialUserId || (user ? user.id : null);

        if (userIdToFetch) {
            setLoadingProfile(true);
            try {
                const response = await getUserById(userIdToFetch);

                if (response.success && response.user) {
                    const serverUser = response.user;

                    const mappedUser = {
                        id: serverUser.authentication?.id || serverUser.profile?.user_id || null,
                        email: serverUser.authentication?.email || serverUser.details?.email || null,
                        fullName: serverUser.details?.hebrew_name || serverUser.profile?.english_name || serverUser.authentication?.email?.split('@')[0] || 'משתמש חדש',
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

                    if (!user || user.id !== mappedUser.id) {
                        login(mappedUser);
                    }

                } else {
                    setEditableUser(null);
                    setAlertVariant("danger");
                    setAlertMessage("שגיאה בטעינת פרטי הפרופיל.");
                    setShowAlert(true);
                }
            } catch (error) {
                setEditableUser(null);
                setAlertVariant("danger");
                setAlertMessage(`שגיאה בטעינת פרטי הפרופיל: ${error.message || "שגיאה לא ידועה"}`);
                setShowAlert(true);
            } finally {
                setLoadingProfile(false);
            }
        } else {
            setLoadingProfile(false);
            setAlertVariant("warning");
            setAlertMessage("אין נתוני משתמש. אנא התחבר מחדש.");
            setShowAlert(true);
        }
    }, [user, login]);

    useEffect(() => {
        if (user && user.id) {
            fetchUserProfile();
        } else {
            const params = new URLSearchParams(location.search);
            const linkedinUserId = params.get('userId');

            if (linkedinUserId) {
                fetchUserProfile(linkedinUserId);
            } else {
                setLoadingProfile(false);
                setAlertVariant("danger");
                setAlertMessage("שגיאה: ID משתמש לא זמין. אנא נסה להתחבר שוב.");
                setShowAlert(true);
            }
        }
    }, [fetchUserProfile, user, location.search]);

    const handleUserChange = (e) => {
        const { name, value } = e.target;
        setEditableUser((prevUser) => ({
            ...prevUser,
            [name]: value,
        }));
    };

    const handleUpdateProfile = async () => {
        if (!editableUser || !editableUser.id) {
            setAlertVariant("danger");
            setAlertMessage("לא ניתן לעדכן פרופיל: חסר ID משתמש.");
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 3000);
            return;
        }

        setIsUpdating(true);
        setShowAlert(false);

        try {
            const dataToUpdate = {
                hebrew_name: editableUser.fullName,
                linkedin_url: editableUser.linkedin,
                years_of_xp: editableUser.yearsOfExperience,
                role: editableUser.role,
                city: editableUser.city,
                phone: editableUser.phone,
                facebook_url: editableUser.facebook_url,
                description: editableUser.description
            };

            const response = await updateUser(editableUser.id, dataToUpdate);

            if (response.success) {
                login({ ...user, ...response.user });
                setAlertVariant("success");
                setAlertMessage("הפרופיל עודכן בהצלחה!");
                setShowAlert(true);
                await fetchUserProfile();
            } else {
                setAlertVariant("danger");
                setAlertMessage(response.message || "שגיאה בעדכון הפרופיל.");
                setShowAlert(true);
            }
        } catch (error) {
            setAlertVariant("danger");
            setAlertMessage(`שגיאה בעדכון הפרופיל: ${error.message || "שגיאה לא ידועה"}`);
            setShowAlert(true);
        } finally {
            setIsUpdating(false);
            setTimeout(() => setShowAlert(false), 3000);
        }
    };

    if (loadingProfile) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">טוען פרופיל...</span>
                </Spinner>
            </div>
        );
    }

    if (!editableUser) {
        return (
            <div className="d-flex flex-column justify-content-center align-items-center vh-100 p-4">
                <Alert variant="danger" className="text-center">
                    לא ניתן לטעון את פרטי הפרופיל.
                    <br />
                    ייתכן שיש בעיה בחיבור לשרת או בנתוני המשתמש.
                </Alert>
                <Button variant="primary" onClick={() => window.location.reload()}>
                    נסה שוב
                </Button>
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
                    <Form.Group className="mb-3">
                        <Form.Label>עיר</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="הזן עיר"
                            name="city"
                            value={editableUser.city || ''}
                            onChange={handleUserChange}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>טלפון</Form.Label>
                        <Form.Control
                            type="tel"
                            placeholder="הזן מספר טלפון"
                            name="phone"
                            value={editableUser.phone || ''}
                            onChange={handleUserChange}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>פרופיל פייסבוק</Form.Label>
                        <Form.Control
                            type="url"
                            placeholder="הזן קישור לפרופיל פייסבוק"
                            name="facebook_url"
                            value={editableUser.facebook_url || ''}
                            onChange={handleUserChange}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>תיאור</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            placeholder="הזן תיאור אישי או מקצועי"
                            name="description"
                            value={editableUser.description || ''}
                            onChange={handleUserChange}
                        />
                    </Form.Group>
                    <Button variant="primary" onClick={handleUpdateProfile} disabled={isUpdating}>
                        {isUpdating ? 'שומר שינויים...' : 'שמור שינויים'}
                    </Button>
                </Form>

            </Container>

            <UserBottomNavbar />
        </div>
    );
}

export default UserDashboard;