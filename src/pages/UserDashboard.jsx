import React, { useState, useEffect } from "react";
import UserBottomNavbar from "../components/layout/UserBottomNavbar.jsx";
import { Container, Form, Button, Alert, Spinner } from "react-bootstrap";
import UserDashboardCards from "../components/dashboard/UserDashboardCards.jsx";
import { useUser } from '../context/UserProvider';
import logo from '../assets/logo.png';
import { useNavigate, useLocation } from 'react-router-dom';
import UserDetailsModal from "../modals/UserDetailsModal";
import ConnectionsHistoryModal from "../modals/UserEventsHistoryModal.jsx";
import { getUserById } from '../services/authService.jsx';


function UserDashboard() {
    const { user, login } = useUser();
    const navigate = useNavigate();
    const location = useLocation();

    const [editableUser, setEditableUser] = useState(null);
    const [loadingProfile, setLoadingProfile] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const [hasFetched, setHasFetched] = useState(false); // משתנה חדש לעקוב אחרי קריאה מוצלחת
    const [currentUserId, setCurrentUserId] = useState(null); // לעקוב אחרי ה-ID הנוכחי

    const [showUserDetailsModal, setShowUserDetailsModal] = useState(false);
    const [selectedUserForModal, setSelectedUserForModal] = useState(null);
    const [showConnectionsModal, setShowConnectionsModal] = useState(false);
    const [userForConnections, setUserForConnections] = useState(null);

    // פונקציית עדכון הפרופיל
    const handleUpdateProfile = async () => {
        setIsUpdating(true);

        if (!editableUser || !editableUser.user_id) {
            console.error("Console Log: Error: Cannot update profile without User ID.");
            setIsUpdating(false);
            return;
        }

        console.log("Console Log: Attempting to update profile for User ID:", editableUser.user_id);
        console.log("Console Log: Data being sent for update (mock):", editableUser);

        try {
            await new Promise(resolve => setTimeout(resolve, 800));
            const response = {
                success: true,
                message: "הפרופיל עודכן בהצלחה!"
            };

            if (response.success) {
                console.log("Console Log: Profile updated successfully!");
            } else {
                console.error("Console Log: Failed to update profile:", response.message || "Unknown error.");
            }
        } catch (error) {
            console.error("Console Log: Error updating user profile:", error);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleUpdateProfileWrapper = (event) => {
        event.preventDefault();
        handleUpdateProfile();
    };

    const handleUserChange = (e) => {
        const { name, value } = e.target;
        setEditableUser(prev => ({
            ...prev,
            [name]: value
        }));
        console.log(`Console Log: User input changed - Field: ${name}, New Value: ${value}`);
    };

    useEffect(() => {
        // מזהה את ה-ID מה-URL
        const params = new URLSearchParams(location.search);
        const idFromUrl = params.get('userId');

        if (idFromUrl) {
            console.log("Console Log: User ID retrieved from URL:", idFromUrl);
        } else {
            console.log("Console Log: No User ID found in URL parameters. Using context/default.");
        }

        const finalUserIdToFetch = idFromUrl || user?.id || "user-123";

        // בדיקה אם כבר טענו נתונים עבור ה-ID הזה
        if (hasFetched && currentUserId === finalUserIdToFetch) {
            console.log("Console Log: Data already fetched for User ID:", finalUserIdToFetch);
            setLoadingProfile(false);
            return;
        }

        const fetchUserData = async () => {
            if (!finalUserIdToFetch) {
                setLoadingProfile(false);
                console.error("Console Log: Error: User ID not available for fetching. Redirecting to login.");

('/login', { replace: true });
                return;
            }

            // בדיקה נוספת למניעת קריאה כפולה
            if (editableUser && editableUser.user_id === finalUserIdToFetch) {
                console.log("Console Log: User profile with ID", finalUserIdToFetch, "already loaded and matched. Skipping API call.");
                setLoadingProfile(false);
                setHasFetched(true);
                setCurrentUserId(finalUserIdToFetch);
                return;
            }

            setLoadingProfile(true);
            console.log("Console Log: Attempting to fetch profile for User ID:", finalUserIdToFetch, "from API.");

            try {
                const response = await getUserById(finalUserIdToFetch);
                console.log("Console Log: Raw API response for user data:", response);

                if (response.success && response.user) {
                    const authenticationData = response.user.authentication;
                    const profileData = response.user.profile;
                    const detailsData = response.user.details;

                    // עדכון קונטקסט המשתמש רק אם הכרחי
                    if (authenticationData && user?.id !== authenticationData.id) {
                        login(authenticationData);
                    } else if (!authenticationData && user?.id !== finalUserIdToFetch) {
                        login({ id: finalUserIdToFetch, email: detailsData?.email || 'unknown@example.com' });
                    }

                    const fullUserData = {
                        user_id: authenticationData?.id || profileData?.user_id || detailsData?.user_id || finalUserIdToFetch,
                        ...authenticationData,
                        ...profileData,
                        ...detailsData,
                        fullName: profileData?.english_name || detailsData?.fullName,
                        linkedin: profileData?.linkedin_url || detailsData?.linkedin,
                    };
                    setEditableUser(fullUserData);
                    setHasFetched(true); // סימון שהקריאה הצליחה
                    setCurrentUserId(finalUserIdToFetch); // עדכון ה-ID הנוכחי
                    console.log("Console Log: User profile loaded successfully!");
                    console.log("Console Log: Full User Data (after API fetch):", fullUserData);
                } else {
                    console.error("Console Log: Error loading user details from server:", response.message || "Unknown error.");
                    navigate('/login', { replace: true });
                }
            } catch (error) {
                console.error("Console Log: Error fetching user profile from API:", error);
                navigate('/login', { replace: true });
            } finally {
                setLoadingProfile(false);
            }
        };

        fetchUserData();

    }, [user, location.search, navigate, login]); // תלויות ללא editableUser

    const handleShowUserDetailsModal = (userToView) => {
        setSelectedUserForModal(userToView);
        setShowUserDetailsModal(true);
        console.log("Console Log: Showing UserDetailsModal for user:", userToView?.user_id);
    };

    const handleHideUserDetailsModal = () => {
        setShowUserDetailsModal(false);
        setSelectedUserForModal(null);
        console.log("Console Log: Hiding UserDetailsModal.");
    };

    const handleViewConnections = (user) => {
        setUserForConnections(user);
        setShowConnectionsModal(true);
        console.log("Console Log: Showing ConnectionsHistoryModal for user:", user?.user_id);
    };

    const handleHideConnectionsModal = () => {
        setShowConnectionsModal(false);
        setUserForConnections(null);
        console.log("Console Log: Hiding ConnectionsHistoryModal.");
    };

    return (
        <div className="user-dashboard-page" style={{ paddingBottom: '70px', minHeight: '100vh' }}>
            <Container className="my-5">
                <div className="text-center mb-4">
                    <img src={logo} alt="Logo" style={{ maxWidth: '150px', marginBottom: '20px' }} />
                    <h2>ברוך הבא לדשבורד המשתמש</h2>
                </div>

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
                    onEditClick={() => console.log('Console Log: Edit clicked from UserDetailsModal')}
                    onMessageClick={() => console.log('Console Log: Message clicked from UserDetailsModal')}
                    onDeleteClick={() => console.log('Console Log: Delete clicked from UserDetailsModal')}
                    onViewConnectionsClick={handleViewConnections}
                    onViewEventsClick={() => console.log('Console Log: Events clicked from UserDetailsModal')}
                />
            )}

            {userForConnections && (
                <ConnectionsHistoryModal
                    show={showConnectionsModal}
                    onHide={handleHideConnectionsModal}
                    user={userForConnections}
                />
            )}

            <UserBottomNavbar />
        </div>
    );
}

export default UserDashboard;