// UserDashboard.jsx (or the parent component rendering UserDetailsModal)
import React, { useState, useEffect, useCallback } from "react";
import UserBottomNavbar from "../../components/layout/UserBottomNavbar.jsx";
import {
    Container,
    Form,
    Button,
    Alert,
    Spinner
} from "react-bootstrap";
import UserDashboardCards from "../../components/dashboard/UserDashboardCards.jsx";
import { useUser } from '../../context/UserProvider';
import logo from '../assets/logo.png';
import { useNavigate } from 'react-router-dom';
// import ConnectionsHistoryModal from "../components/ConnectionsHistoryModal"; // No longer needed if navigating

const mockUserAuthentication = {
    id: "user-123",
    email: "user@example.com",
    lastLogin: "2024-07-15T10:00:00Z",
};

const mockUserProfile = {
    user_id: "user-123",
    english_name: "John Doe",
    hebrew_name: "ג'ון דו",
    role: "מפתח תוכנה",
    seniority: "ראש צוות",
    phone: "050-1234567",
    city: "תל אביב",
    years_of_xp: 7,
    linkedin_url: "https://www.linkedin.com/in/johndoe",
    facebook_url: "https://www.facebook.com/johndoe",
    description: "תיאור אישי קצר של המשתמש.",
};

const mockUserDetails = {
    user_id: "user-123",
    fullName: "John Doe",
    linkedin: "https://www.linkedin.com/in/johndoe"
};

const mockUserData = {
    authentication: mockUserAuthentication,
    profile: mockUserProfile,
    details: mockUserDetails,
};

function UserDashboard() {
    const { user, login } = useUser();
    const navigate = useNavigate(); // This is crucial for navigation

    const [editableUser, setEditableUser] = useState(null);
    const [showAlert, setShowAlert] = useState(false);
    const [alertVariant, setAlertVariant] = useState("success");
    const [alertMessage, setAlertMessage] = useState("");
    const [loadingProfile, setLoadingProfile] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);

    const [showUserDetailsModal, setShowUserDetailsModal] = useState(false);
    const [selectedUserForModal, setSelectedUserForModal] = useState(null);

    // No longer need state for showConnectionsModal or userForConnections if navigating
    // const [showConnectionsModal, setShowConnectionsModal] = useState(false);
    // const [userForConnections, setUserForConnections] = useState(null);

    const fetchUserProfile = useCallback(async (initialUserId = null) => {
        setLoadingProfile(true);
        setShowAlert(false);

        const userIdToFetch = initialUserId || (user ? user.id : null);

        if (!userIdToFetch) {
            setLoadingProfile(false);
            setAlertVariant("danger");
            setAlertMessage("שגיאה: ID משתמש לא זמין. אנא נסה להתחבר שוב.");
            setShowAlert(true);
            navigate('/login', { replace: true });
            return;
        }

        try {
            await new Promise(resolve => setTimeout(resolve, 1000));

            const response = {
                success: true,
                user: mockUserData,
                message: "פרופיל משתמש נטען בהצלחה!"
            };

            if (response.success && response.user) {
                login(response.user.authentication);

                const fullUserData = {
                    ...response.user.authentication,
                    ...response.user.profile,
                    ...response.user.details,
                    user_id: response.user.authentication.id || response.user.profile.user_id,
                    fullName: response.user.profile.english_name,
                    linkedin: response.user.profile.linkedin_url
                };
                setEditableUser(fullUserData);
            } else {
                setAlertVariant("danger");
                setAlertMessage(response.message || "שגיאה בטעינת פרטי המשתמש.");
                setShowAlert(true);
                navigate('/login', { replace: true });
            }
        } catch (error) {
            console.error("Error fetching user profile:", error);
            setAlertVariant("danger");
            setAlertMessage(`שגיאה בטעינת פרטי המשתמש: ${error.message}`);
            setShowAlert(true);
        } finally {
            setLoadingProfile(false);
        }
    }, [user, login, navigate]);

    const handleUpdateProfileWrapper = async (event) => {
        event.preventDefault();
        await handleUpdateProfile();
    };

    const handleUpdateProfile = useCallback(async () => {
        setIsUpdating(true);
        setShowAlert(false);

        if (!editableUser || !editableUser.user_id) {
            setAlertVariant("danger");
            setAlertMessage("שגיאה: לא ניתן לעדכן פרופיל ללא ID משתמש.");
            setShowAlert(true);
            setIsUpdating(false);
            return;
        }

        try {
            await new Promise(resolve => setTimeout(resolve, 800));

            const response = {
                success: true,
                user: { authentication: { id: editableUser.user_id, email: editableUser.email } },
                message: "הפרופיל עודכן בהצלחה!"
            };

            if (response.success) {
                setAlertVariant("success");
                setAlertMessage("הפרופיל עודכן בהצלחה!");
                setShowAlert(true);
            } else {
                setAlertVariant("danger");
                setAlertMessage(response.message || "נכשל בעדכון הפרופיל.");
                setShowAlert(true);
            }
        } catch (error) {
            console.error("Error updating user profile:", error);
            setAlertVariant("danger");
            setAlertMessage(`שגיאה בעדכון הפרופיל: ${error.message}`);
            setShowAlert(true);
        } finally {
            setIsUpdating(false);
        }
    }, [editableUser]);

    const handleUserChange = (e) => {
        const { name, value } = e.target;
        setEditableUser(prev => ({
            ...prev,
            [name]: value
        }));
    };

    useEffect(() => {
        const userIdFromContextOrUrl = user?.id || "user-123";
        fetchUserProfile(userIdFromContextOrUrl);
    }, [fetchUserProfile, user]);

    const handleShowUserDetailsModal = (userToView) => {
        setSelectedUserForModal(userToView);
        setShowUserDetailsModal(true);
    };

    const handleHideUserDetailsModal = () => {
        setShowUserDetailsModal(false);
        setSelectedUserForModal(null);
    };

    // --- MODIFIED: Handle navigation to connections URL ---
    const handleViewConnections = (user) => {
        if (user && user.user_id) {
            navigate(`/connections/${user.user_id}`); // Navigate to a specific user's connections
            setShowUserDetailsModal(false); // Close the modal after navigation
        } else {
            console.warn("User ID not available for connections navigation.");
            // Optionally navigate to a generic connections page or show an error
            // navigate('/connections');
        }
    };
    // --- END MODIFIED ---

    // The handleHideConnectionsModal and userForConnections state are no longer needed
    // const handleHideConnectionsModal = () => {
    //     setShowConnectionsModal(false);
    //     setUserForConnections(null);
    // };

    return (
        <div className="user-dashboard-page" style={{ paddingBottom: '70px', minHeight: '100vh' }}>
            <Container className="my-5">
                <div className="text-center mb-4">
                    <img src={logo} alt="Logo" style={{ maxWidth: '150px', marginBottom: '20px' }} />
                    <h2>ברוך הבא לדשבורד המשתמש</h2>
                </div>

                {showAlert && (
                    <Alert variant={alertVariant} onClose={() => setShowAlert(false)} dismissible>
                        {alertMessage}
                    </Alert>
                )}

                {loadingProfile ? (
                    <div className="text-center my-5">
                        <Spinner animation="border" role="status">
                            <span className="visually-hidden">טוען פרופיל...</span>
                        </Spinner>
                        <p className="mt-3">טוען את פרטי הפרופיל שלך...</p>
                    </div>
                ) : (
                    editableUser ? (
                        <>
                            <div className="text-center mb-4">
                                <Button
                                    variant="outline-primary"
                                    onClick={() => handleShowUserDetailsModal(editableUser)}
                                >
                                    הצג פרטי פרופיל מלאים (במודאל)
                                </Button>
                            </div>

                            {editableUser.user_id && <UserDashboardCards user={editableUser} />}

                            <hr className="my-4" />
                            <h3>ערוך את הפרופיל שלך</h3>
                            <Form onSubmit={handleUpdateProfileWrapper}>
                                <Form.Group className="mb-3">
                                    <Form.Label>שם באנגלית</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="הזן שם באנגלית"
                                        name="english_name"
                                        value={editableUser.english_name || ''}
                                        onChange={handleUserChange}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>שם בעברית</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="הזן שם בעברית"
                                        name="hebrew_name"
                                        value={editableUser.hebrew_name || ''}
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
                                    <Form.Label>ותק</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="הזן ותק"
                                        name="seniority"
                                        value={editableUser.seniority || ''}
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
                                    <Form.Label>עיר</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="הזן עיר מגורים"
                                        name="city"
                                        value={editableUser.city || ''}
                                        onChange={handleUserChange}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>שנות ניסיון</Form.Label>
                                    <Form.Control
                                        type="number"
                                        placeholder="הזן שנות ניסיון"
                                        name="years_of_xp"
                                        value={editableUser.years_of_xp || ''}
                                        onChange={handleUserChange}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>פרופיל לינקדאין</Form.Label>
                                    <Form.Control
                                        type="url"
                                        placeholder="הזן קישור לפרופיל לינקדאין"
                                        name="linkedin_url"
                                        value={editableUser.linkedin_url || ''}
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
                                <Button variant="primary" type="submit" disabled={isUpdating}>
                                    {isUpdating ? 'שומר שינויים...' : 'שמור שינויים'}
                                </Button>
                            </Form>
                        </>
                    ) : (
                        <Alert variant="info" className="text-center">
                            <p>לא נמצאו פרטי פרופיל. ודא שהקוד מוגדר נכון.</p>
                        </Alert>
                    )
                )}
            </Container>

            {selectedUserForModal && (
                <UserDetailsModal
                    show={showUserDetailsModal}
                    onHide={handleHideUserDetailsModal}
                    user={selectedUserForModal}
                    onEditClick={() => console.log('Edit clicked from UserDetailsModal')}
                    onMessageClick={() => console.log('Message clicked from UserDetailsModal')}
                    onDeleteClick={() => console.log('Delete clicked from UserDetailsModal')}
                    onViewConnectionsClick={handleViewConnections} // This now triggers navigation
                    onViewEventsClick={() => console.log('Events clicked from UserDetailsModal')}
                />
            )}

            {/* The ConnectionsHistoryModal is no longer rendered here if you're navigating */}
            {/* {userForConnections && (
                <ConnectionsHistoryModal
                    show={showConnectionsModal}
                    onHide={handleHideConnectionsModal}
                    user={userForConnections}
                />
            )} */}

            <UserBottomNavbar />
        </div>
    );
}

export default UserDashboard;