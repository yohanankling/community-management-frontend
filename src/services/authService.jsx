import React, { useState, useEffect } from "react";
import UserBottomNavbar from "../components/layout/UserBottomNavbar.jsx";
import { Container, Form, Button, Alert, Spinner } from "react-bootstrap";
import UserDashboardCards from "../components/dashboard/UserDashboardCards.jsx";
import { useUser } from '../context/UserProvider';
import logo from '../assets/logo.png';
import { useNavigate, useLocation } from 'react-router-dom';
import UserDetailsModal from "../modals/UserDetailsModal";
import ConnectionsHistoryModal from "../modals/UserEventsHistoryModal.jsx";
import { getUserById } from '../services/authService.jsx'; // Imports getUserById from the authentication service.

// UserDashboard component displays a personalized dashboard for a logged-in user.
function UserDashboard() {
    // Destructure user context and navigation hooks.
    const { user, login } = useUser();
    const navigate = useNavigate();
    const location = useLocation();

    // State variables for managing user profile data and UI states.
    const [editableUser, setEditableUser] = useState(null); // Stores the user data that can be edited.
    const [loadingProfile, setLoadingProfile] = useState(true); // Indicates if the user profile is currently being loaded.
    const [isUpdating, setIsUpdating] = useState(false); // Indicates if the profile update is in progress.
    const [hasFetched, setHasFetched] = useState(false); // Tracks if user data has been successfully fetched.
    const [currentUserId, setCurrentUserId] = useState(null); // Stores the ID of the user whose profile is currently displayed.

    // State variables for controlling modal visibility and data.
    const [showUserDetailsModal, setShowUserDetailsModal] = useState(false); // Controls visibility of the UserDetailsModal.
    const [selectedUserForModal, setSelectedUserForModal] = useState(null); // Stores user data for the UserDetailsModal.
    const [showConnectionsModal, setShowConnectionsModal] = useState(false); // Controls visibility of the ConnectionsHistoryModal.
    const [userForConnections, setUserForConnections] = useState(null); // Stores user data for the ConnectionsHistoryModal.

    // Function to handle updating the user's profile.
    const handleUpdateProfile = async () => {
        setIsUpdating(true); // Set updating state to true.

        // Log an error and stop if user data or ID is missing.
        if (!editableUser || !editableUser.user_id) {
            console.error("Console Log: Error: Cannot update profile without User ID.");
            setIsUpdating(false);
            return;
        }

        console.log("Console Log: Attempting to update profile for User ID:", editableUser.user_id);
        console.log("Console Log: Data being sent for update (mock):", editableUser);

        try {
            // Simulate an API call with a delay.
            await new Promise(resolve => setTimeout(resolve, 800));
            // Mock response for the update operation.
            const response = {
                success: true,
                message: "Profile updated successfully!"
            };

            // Check the mock response and log success or failure.
            if (response.success) {
                console.log("Console Log: Profile updated successfully!");
            } else {
                console.error("Console Log: Failed to update profile:", response.message || "Unknown error.");
            }
        } catch (error) {
            // Catch and log any errors during the update process.
            console.error("Console Log: Error updating user profile:", error);
        } finally {
            setIsUpdating(false); // Reset updating state.
        }
    };

    // Wrapper function for handleUpdateProfile to prevent default form submission.
    const handleUpdateProfileWrapper = (event) => {
        event.preventDefault(); // Prevent page reload on form submission.
        handleUpdateProfile(); // Call the actual update function.
    };

    // Handles changes in form input fields, updating the editableUser state.
    const handleUserChange = (e) => {
        const { name, value } = e.target; // Get the name and value of the changed input.
        setEditableUser(prev => ({
            ...prev, // Spread previous editableUser state.
            [name]: value // Update the specific field.
        }));
        console.log(`Console Log: User input changed - Field: ${name}, New Value: ${value}`);
    };

    // useEffect hook to fetch user data on component mount or when dependencies change.
    useEffect(() => {
        // Identify the user ID from URL parameters.
        const params = new URLSearchParams(location.search);
        const idFromUrl = params.get('userId');

        if (idFromUrl) {
            console.log("Console Log: User ID retrieved from URL:", idFromUrl);
        } else {
            console.log("Console Log: No User ID found in URL parameters. Using context/default.");
        }

        // Determine the final user ID to fetch: from URL, then from context, then a default.
        const finalUserIdToFetch = idFromUrl || user?.id || "user-123";

        // Check if data has already been fetched for the current user ID to prevent redundant API calls.
        if (hasFetched && currentUserId === finalUserIdToFetch) {
            console.log("Console Log: Data already fetched for User ID:", finalUserIdToFetch);
            setLoadingProfile(false); // Stop loading animation.
            return; // Exit the effect.
        }

        // Asynchronous function to fetch user data.
        const fetchUserData = async () => {
            // If no user ID is available, log an error and redirect to login.
            if (!finalUserIdToFetch) {
                setLoadingProfile(false);
                console.error("Console Log: Error: User ID not available for fetching. Redirecting to login.");
                navigate('/login', { replace: true }); // Redirect to login page.
                return;
            }

            // Additional check to prevent duplicate API calls if the profile is already loaded.
            if (editableUser && editableUser.user_id === finalUserIdToFetch) {
                console.log("Console Log: User profile with ID", finalUserIdToFetch, "already loaded and matched. Skipping API call.");
                setLoadingProfile(false);
                setHasFetched(true);
                setCurrentUserId(finalUserIdToFetch);
                return;
            }

            setLoadingProfile(true); // Start loading animation.
            console.log("Console Log: Attempting to fetch profile for User ID:", finalUserIdToFetch, "from API.");

            try {
                // Call the getUserById service to fetch user data.
                const response = await getUserById(finalUserIdToFetch);
                console.log("Console Log: Raw API response for user data:", response);

                // Process the API response.
                if (response.success && response.user) {
                    const authenticationData = response.user.authentication;
                    const profileData = response.user.profile;
                    const detailsData = response.user.details;

                    // Update user context only if necessary (e.g., ID mismatch).
                    if (authenticationData && user?.id !== authenticationData.id) {
                        login(authenticationData);
                    } else if (!authenticationData && user?.id !== finalUserIdToFetch) {
                        login({ id: finalUserIdToFetch, email: detailsData?.email || 'unknown@example.com' });
                    }

                    // Combine all relevant user data into a single object.
                    const fullUserData = {
                        user_id: authenticationData?.id || profileData?.user_id || detailsData?.user_id || finalUserIdToFetch,
                        ...authenticationData,
                        ...profileData,
                        ...detailsData,
                        fullName: profileData?.english_name || detailsData?.fullName,
                        linkedin: profileData?.linkedin_url || detailsData?.linkedin,
                    };
                    setEditableUser(fullUserData); // Set the editable user data.
                    setHasFetched(true); // Mark data as successfully fetched.
                    setCurrentUserId(finalUserIdToFetch); // Update the current user ID.
                    console.log("Console Log: User profile loaded successfully!");
                    console.log("Console Log: Full User Data (after API fetch):", fullUserData);
                } else {
                    // Log error and redirect if user details cannot be loaded.
                    console.error("Console Log: Error loading user details from server:", response.message || "Unknown error.");
                    navigate('/login', { replace: true });
                }
            } catch (error) {
                // Catch and log any errors during the API fetch.
                console.error("Console Log: Error fetching user profile from API:", error);
                navigate('/login', { replace: true }); // Redirect to login on fetch error.
            } finally {
                setLoadingProfile(false); // Stop loading animation regardless of outcome.
            }
        };

        fetchUserData(); // Call the fetch function.

    }, [user, location.search, navigate, login]); // Dependencies for the useEffect hook.

    // Handles showing the UserDetailsModal for a selected user.
    const handleShowUserDetailsModal = (userToView) => {
        setSelectedUserForModal(userToView); // Set the user data for the modal.
        setShowUserDetailsModal(true); // Show the modal.
        console.log("Console Log: Showing UserDetailsModal for user:", userToView?.user_id);
    };

    // Handles hiding the UserDetailsModal.
    const handleHideUserDetailsModal = () => {
        setShowUserDetailsModal(false); // Hide the modal.
        setSelectedUserForModal(null); // Clear the selected user data.
        console.log("Console Log: Hiding UserDetailsModal.");
    };

    // Handles showing the ConnectionsHistoryModal for a selected user.
    const handleViewConnections = (user) => {
        setUserForConnections(user); // Set the user data for the connections modal.
        setShowConnectionsModal(true); // Show the connections modal.
        console.log("Console Log: Showing ConnectionsHistoryModal for user:", user?.user_id);
    };

    // Handles hiding the ConnectionsHistoryModal.
    const handleHideConnectionsModal = () => {
        setShowConnectionsModal(false); // Hide the connections modal.
        setUserForConnections(null); // Clear the user data for connections.
        console.log("Console Log: Hiding ConnectionsHistoryModal.");
    };

    // Render the User Dashboard UI.
    return (
        <div className="user-dashboard-page" style={{ paddingBottom: '70px', minHeight: '100vh' }}>
            <Container className="my-5">
                {/* Header section with logo and welcome message. */}
                <div className="text-center mb-4">
                    <img src={logo} alt="Logo" style={{ maxWidth: '150px', marginBottom: '20px' }} />
                    <h2>Welcome to the User Dashboard</h2>
                </div>

                {/* Conditional rendering based on loading state. */}
                {loadingProfile ? (
                    // Display spinner and loading message while profile is loading.
                    <div className="text-center my-5">
                        <Spinner animation="border" role="status">
                            <span className="visually-hidden">Loading profile...</span>
                        </Spinner>
                        <p className="mt-3">Loading your profile details...</p>
                    </div>
                ) : (
                    // If profile is loaded, check if editableUser exists.
                    editableUser ? (
                        <>
                            {/* Button to show full profile details in a modal. */}
                            <div className="text-center mb-4">
                                <Button
                                    variant="outline-primary"
                                    onClick={() => handleShowUserDetailsModal(editableUser)}
                                >
                                    Show Full Profile Details (in Modal)
                                </Button>
                            </div>

                            {/* Display UserDashboardCards if user_id is available. */}
                            {editableUser.user_id && <UserDashboardCards user={editableUser} />}

                            <hr className="my-4" />
                            <h3>Edit Your Profile</h3>
                            {/* Form for editing user profile details. */}
                            <Form onSubmit={handleUpdateProfileWrapper}>
                                {/* Form Group for English Name */}
                                <Form.Group className="mb-3">
                                    <Form.Label>English Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter English Name"
                                        name="english_name"
                                        value={editableUser.english_name || ''}
                                        onChange={handleUserChange}
                                    />
                                </Form.Group>
                                {/* Form Group for Hebrew Name */}
                                <Form.Group className="mb-3">
                                    <Form.Label>Hebrew Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter Hebrew Name"
                                        name="hebrew_name"
                                        value={editableUser.hebrew_name || ''}
                                        onChange={handleUserChange}
                                    />
                                </Form.Group>
                                {/* Form Group for Email (disabled as it's typically not editable) */}
                                <Form.Group className="mb-3">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        placeholder="Enter Email"
                                        name="email"
                                        value={editableUser.email || ''}
                                        onChange={handleUserChange}
                                        disabled // Email field is disabled for editing.
                                    />
                                </Form.Group>
                                {/* Form Group for Role */}
                                <Form.Group className="mb-3">
                                    <Form.Label>Role</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter Role"
                                        name="role"
                                        value={editableUser.role || ''}
                                        onChange={handleUserChange}
                                    />
                                </Form.Group>
                                {/* Form Group for Seniority */}
                                <Form.Group className="mb-3">
                                    <Form.Label>Seniority</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter Seniority"
                                        name="seniority"
                                        value={editableUser.seniority || ''}
                                        onChange={handleUserChange}
                                    />
                                </Form.Group>
                                {/* Form Group for Phone */}
                                <Form.Group className="mb-3">
                                    <Form.Label>Phone</Form.Label>
                                    <Form.Control
                                        type="tel"
                                        placeholder="Enter Phone Number"
                                        name="phone"
                                        value={editableUser.phone || ''}
                                        onChange={handleUserChange}
                                    />
                                </Form.Group>
                                {/* Form Group for City */}
                                <Form.Group className="mb-3">
                                    <Form.Label>City</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter City"
                                        name="city"
                                        value={editableUser.city || ''}
                                        onChange={handleUserChange}
                                    />
                                </Form.Group>
                                {/* Form Group for Years of Experience */}
                                <Form.Group className="mb-3">
                                    <Form.Label>Years of Experience</Form.Label>
                                    <Form.Control
                                        type="number"
                                        placeholder="Enter Years of Experience"
                                        name="years_of_xp"
                                        value={editableUser.years_of_xp || ''}
                                        onChange={handleUserChange}
                                    />
                                </Form.Group>
                                {/* Form Group for LinkedIn Profile URL */}
                                <Form.Group className="mb-3">
                                    <Form.Label>LinkedIn Profile</Form.Label>
                                    <Form.Control
                                        type="url"
                                        placeholder="Enter LinkedIn Profile URL"
                                        name="linkedin_url"
                                        value={editableUser.linkedin_url || ''}
                                        onChange={handleUserChange}
                                    />
                                </Form.Group>
                                {/* Form Group for Facebook Profile URL */}
                                <Form.Group className="mb-3">
                                    <Form.Label>Facebook Profile</Form.Label>
                                    <Form.Control
                                        type="url"
                                        placeholder="Enter Facebook Profile URL"
                                        name="facebook_url"
                                        value={editableUser.facebook_url || ''}
                                        onChange={handleUserChange}
                                    />
                                </Form.Group>
                                {/* Form Group for Description (textarea) */}
                                <Form.Group className="mb-3">
                                    <Form.Label>Description</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        placeholder="Enter personal or professional description"
                                        name="description"
                                        value={editableUser.description || ''}
                                        onChange={handleUserChange}
                                    />
                                </Form.Group>
                                {/* Submit button for saving changes. */}
                                <Button variant="primary" type="submit" disabled={isUpdating}>
                                    {isUpdating ? 'Saving Changes...' : 'Save Changes'}
                                </Button>
                            </Form>
                        </>
                    ) : (
                        // Display an alert if no profile details are found.
                        <Alert variant="info" className="text-center">
                            <p>No profile details found. Ensure the code is configured correctly.</p>
                        </Alert>
                    )
                )}
            </Container>

            {/* UserDetailsModal component, conditionally rendered. */}
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

            {/* ConnectionsHistoryModal component, conditionally rendered. */}
            {userForConnections && (
                <ConnectionsHistoryModal
                    show={showConnectionsModal}
                    onHide={handleHideConnectionsModal}
                    user={userForConnections}
                />
            )}

            {/* Bottom navigation bar for the user dashboard. */}
            <UserBottomNavbar />
        </div>
    );
}

export default UserDashboard;
