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

// Mock authentication data for testing and development purposes.
const mockUserAuthentication = {
    id: "user-123",
    email: "user@example.com",
    lastLogin: "2024-07-15T10:00:00Z",
};

// Mock user profile data, typically fetched from a backend API.
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

// Mock user details, potentially a subset of the profile, used for specific components.
const mockUserDetails = {
    user_id: "user-123",
    fullName: "John Doe",
    linkedin: "https://www.linkedin.com/in/johndoe"
};

// Consolidated mock user data combining authentication, profile, and details.
const mockUserData = {
    authentication: mockUserAuthentication,
    profile: mockUserProfile,
    details: mockUserDetails,
};

// UserDashboard component serves as the main dashboard for a logged-in user.
// It displays user profile information, allows editing, and provides navigation to other features.
function UserDashboard() {
    // useUser hook provides access to the global user context for login status and user data.
    const { user, login } = useUser();
    // useNavigate hook from react-router-dom allows programmatic navigation between routes.
    const navigate = useNavigate();

    // editableUser state holds the user profile data currently being displayed and edited.
    const [editableUser, setEditableUser] = useState(null);
    // showAlert controls the visibility of alert messages (e.g., success, error).
    const [showAlert, setShowAlert] = useState(false);
    // alertVariant determines the styling (e.g., 'success', 'danger') of the alert.
    const [alertVariant, setAlertVariant] = useState("success");
    // alertMessage stores the text content displayed within the alert.
    const [alertMessage, setAlertMessage] = useState("");
    // loadingProfile indicates if the user profile data is currently being fetched.
    const [loadingProfile, setLoadingProfile] = useState(true);
    // isUpdating indicates if the user profile is currently being updated.
    const [isUpdating, setIsUpdating] = useState(false);

    // showUserDetailsModal controls the visibility of the UserDetailsModal.
    const [showUserDetailsModal, setShowUserDetailsModal] = useState(false);
    // selectedUserForModal stores the user object to be passed to UserDetailsModal.
    const [selectedUserForModal, setSelectedUserForModal] = useState(null);

    // fetchUserProfile is a memoized callback function to fetch the user's profile data.
    // It simulates an API call and updates the `editableUser` state with the fetched data.
    const fetchUserProfile = useCallback(async (initialUserId = null) => {
        setLoadingProfile(true);
        setShowAlert(false);

        // Determine the user ID to fetch, prioritizing the one from context or an initial ID.
        const userIdToFetch = initialUserId || (user ? user.id : null);

        // If no user ID is available, display an error and redirect to the login page.
        if (!userIdToFetch) {
            setLoadingProfile(false);
            setAlertVariant("danger");
            setAlertMessage("שגיאה: ID משתמש לא זמין. אנא נסה להתחבר שוב.");
            setShowAlert(true);
            navigate('/login', { replace: true });
            return;
        }

        try {
            // Simulate an API delay.
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Simulate an API response with mock data.
            const response = {
                success: true,
                user: mockUserData,
                message: "פרופיל משתמש נטען בהצלחה!"
            };

            // Process the successful response.
            if (response.success && response.user) {
                // Update the user context with authentication data.
                login(response.user.authentication);

                // Combine all parts of the mock user data into a single object for the form.
                const fullUserData = {
                    ...response.user.authentication,
                    ...response.user.profile,
                    ...response.user.details,
                    user_id: response.user.authentication.id || response.user.profile.user_id,
                    fullName: response.user.profile.english_name,
                    linkedin: response.user.profile.linkedin_url
                };
                setEditableUser(fullUserData); // Set the combined data to editableUser state.
            } else {
                // Handle unsuccessful response by showing an error and redirecting to login.
                setAlertVariant("danger");
                setAlertMessage(response.message || "שגיאה בטעינת פרטי המשתמש.");
                setShowAlert(true);
                navigate('/login', { replace: true });
            }
        } catch (error) {
            // Catch and handle any errors during the fetch operation.
            console.error("Error fetching user profile:", error);
            setAlertVariant("danger");
            setAlertMessage(`שגיאה בטעינת פרטי המשתמש: ${error.message}`);
            setShowAlert(true);
        } finally {
            setLoadingProfile(false); // End loading state.
        }
    }, [user, login, navigate]); // Dependencies for useCallback.

    // handleUpdateProfileWrapper is an event handler for the form submission.
    // It prevents the default form submission and then calls handleUpdateProfile.
    const handleUpdateProfileWrapper = async (event) => {
        event.preventDefault();
        await handleUpdateProfile();
    };

    // handleUpdateProfile is a memoized callback function to simulate updating the user profile.
    // It sets loading states, performs validation, and simulates an API call to save changes.
    const handleUpdateProfile = useCallback(async () => {
        setIsUpdating(true);
        setShowAlert(false);

        // Client-side validation: ensure editableUser and its ID exist.
        if (!editableUser || !editableUser.user_id) {
            setAlertVariant("danger");
            setAlertMessage("שגיאה: לא ניתן לעדכן פרופיל ללא ID משתמש.");
            setShowAlert(true);
            setIsUpdating(false);
            return;
        }

        try {
            // Simulate an API delay for updating.
            await new Promise(resolve => setTimeout(resolve, 800));

            // Simulate an API response for profile update.
            const response = {
                success: true,
                user: { authentication: { id: editableUser.user_id, email: editableUser.email } },
                message: "הפרופיל עודכן בהצלחה!"
            };

            // Process the update response.
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
            // Catch and handle any errors during the update operation.
            console.error("Error updating user profile:", error);
            setAlertVariant("danger");
            setAlertMessage(`שגיאה בעדכון הפרופיל: ${error.message}`);
            setShowAlert(true);
        } finally {
            setIsUpdating(false); // End updating state.
        }
    }, [editableUser]); // Dependency for useCallback.

    // handleUserChange updates the `editableUser` state as the user types into form fields.
    // It uses the input's 'name' attribute to dynamically update the corresponding property.
    const handleUserChange = (e) => {
        const { name, value } = e.target;
        setEditableUser(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // useEffect hook to trigger fetching the user profile when the component mounts
    // or when the user context changes.
    useEffect(() => {
        // Determine the user ID to fetch; uses mock ID if context user ID is not available.
        const userIdFromContextOrUrl = user?.id || "user-123";
        fetchUserProfile(userIdFromContextOrUrl);
    }, [fetchUserProfile, user]); // Dependencies: fetchUserProfile (memoized) and user context.

    // handleShowUserDetailsModal sets the user to be viewed in the modal and shows the modal.
    const handleShowUserDetailsModal = (userToView) => {
        setSelectedUserForModal(userToView);
        setShowUserDetailsModal(true);
    };

    // handleHideUserDetailsModal hides the UserDetailsModal and clears the selected user.
    const handleHideUserDetailsModal = () => {
        setShowUserDetailsModal(false);
        setSelectedUserForModal(null);
    };

    // handleViewConnections navigates the user to the connections history page for a specific user.
    // It closes the current modal after initiating navigation.
    const handleViewConnections = (user) => {
        if (user && user.user_id) {
            navigate(`/connections/${user.user_id}`); // Navigate to the connections route with the user ID.
            setShowUserDetailsModal(false); // Close the UserDetailsModal.
        } else {
            console.warn("User ID not available for connections navigation.");
            // Optionally, handle cases where user ID is missing (e.g., show error, navigate to generic page).
        }
    };

    return (
        <div className="user-dashboard-page" style={{ paddingBottom: '70px', minHeight: '100vh' }}>
            <Container className="my-5">
                <div className="text-center mb-4">
                    <img src={logo} alt="Logo" style={{ maxWidth: '150px', marginBottom: '20px' }} />
                    <h2>ברוך הבא לדשבורד המשתמש</h2>
                </div>

                {/* Conditionally renders an alert message based on `showAlert` state. */}
                {showAlert && (
                    <Alert variant={alertVariant} onClose={() => setShowAlert(false)} dismissible>
                        {alertMessage}
                    </Alert>
                )}

                {/* Displays a spinner while the profile is loading. */}
                {loadingProfile ? (
                    <div className="text-center my-5">
                        <Spinner animation="border" role="status">
                            <span className="visually-hidden">טוען פרופיל...</span>
                        </Spinner>
                        <p className="mt-3">טוען את פרטי הפרופיל שלך...</p>
                    </div>
                ) : (
                    // Renders the dashboard content if the profile is loaded.
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

                            {/* Displays user dashboard cards if user ID is available. */}
                            {editableUser.user_id && <UserDashboardCards user={editableUser} />}

                            <hr className="my-4" />
                            <h3>ערוך את הפרופיל שלך</h3>
                            {/* Form for editing user profile details. */}
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
                                        disabled // Email field is disabled as it's typically not editable.
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
                        // Displays an informative alert if no profile details are found.
                        <Alert variant="info" className="text-center">
                            <p>לא נמצאו פרטי פרופיל. ודא שהקוד מוגדר נכון.</p>
                        </Alert>
                    )
                )}
            </Container>

            {/* Conditionally renders UserDetailsModal if a user is selected and `showUserDetailsModal` is true. */}
            {selectedUserForModal && (
                <UserDetailsModal
                    show={showUserDetailsModal}
                    onHide={handleHideUserDetailsModal}
                    user={selectedUserForModal}
                    onEditClick={() => console.log('Edit clicked from UserDetailsModal')}
                    onMessageClick={() => console.log('Message clicked from UserDetailsModal')}
                    onDeleteClick={() => console.log('Delete clicked from UserDetailsModal')}
                    onViewConnectionsClick={handleViewConnections} // Passes the navigation handler to the modal.
                    onViewEventsClick={() => console.log('Events clicked from UserDetailsModal')}
                />
            )}

            {/* UserBottomNavbar provides navigation links at the bottom of the page. */}
            <UserBottomNavbar />
        </div>
    );
}

export default UserDashboard;