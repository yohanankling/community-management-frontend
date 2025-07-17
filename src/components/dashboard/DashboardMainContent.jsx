import React, {useState, useEffect, useCallback} from "react";
import {
    Container,
    Modal,
    Button,
    Form,
    Alert,
    Spinner,
} from "react-bootstrap";
import {
    PersonCircle,
    Trash,
} from "react-bootstrap-icons";

import {
    getAllUsers,
    deleteUser,
    updateUser,
} from "../../services/userService";

import SendMessageModal from "../../modals/SendMessageModal.jsx";
import EditUserModal from "../../modals/EditUserModal.jsx";
import UserDetailsModal from "../../modals/UserDetailsModal.jsx";
import UserEventsHistoryModal from "../../modals/UserEventsHistoryModal.jsx";
import DashboardTable from "./DashboardTable";

// DashboardMainContent component is responsible for displaying and managing user data.
// It receives 'onExcelImport' as a prop, which is a callback for handling Excel imports.
function DashboardMainContent({ onExcelImport }) {
    // State to store the full list of users fetched from the server.
    const [users, setUsers] = useState([]);
    // State to store the list of users currently displayed in the table,
    // which might be a filtered subset of 'users'.
    const [displayUsers, setDisplayUsers] = useState([]);
    // State to indicate if data is currently being loaded.
    const [loading, setLoading] = useState(true);
    // State to store any error message during data fetching.
    const [fetchError, setFetchError] = useState(null);

    // useEffect hook to fetch user data when the component mounts.
    useEffect(() => {
        // Asynchronous function to fetch users from the backend.
        const fetchUsers = async () => {
            try {
                // Set loading to true and clear any previous error before fetching.
                setLoading(true);
                setFetchError(null);
                // Call the API to get all users.
                const fetchedUsers = await getAllUsers();
                // Format the fetched user data to match the component's expected structure.
                const formattedUsers = fetchedUsers.map(user => ({
                    id: user.user_id,
                    fullName: user.english_name,
                    linkedin: user.linkedin || '',
                    role: user.role,
                    yearsOfExperience: Math.floor(Math.random() * 15) + 1, // Assign a random number for demo purposes
                }));
                // Update the 'users' state with the formatted data.
                setUsers(formattedUsers);
            } catch (error) {
                // Set an error message if fetching fails.
                setFetchError(error.message || "Failed to load users from server.");
            } finally {
                // Set loading to false once the fetch operation completes (success or failure).
                setLoading(false);
            }
        };
        // Invoke the fetchUsers function.
        fetchUsers();
    }, []); // Empty dependency array ensures this effect runs only once on mount.

    // useEffect hook to update 'displayUsers' whenever 'users' state changes.
    // This ensures that the displayed list always reflects the complete user data initially.
    useEffect(() => {
        setDisplayUsers(users);
    }, [users]); // Dependency on 'users' array.

    // State variables for various modal controls and data associated with them.
    const [userForDetails, setUserForDetails] = useState(null); // User object for details modal.
    const [showAddUserModal, setShowAddUserModal] = useState(false); // Controls visibility of Add User modal.
    // State for new user input fields.
    const [newUser, setNewUser] = useState({
        fullName: "",
        email: "",
        password: "",
        linkedin: "",
        role: "",
        yearsOfExperience: "",
    });
    const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false); // Controls visibility of delete confirmation modal.
    const [userToDelete, setUserToDelete] = useState(null); // User object to be deleted.
    const [showSendMessageModal, setShowSendMessageModal] = useState(false); // Controls visibility of Send Message modal.
    const [userForMessage, setUserForMessage] = useState(null); // User object for sending a message.
    const [showEditUserModal, setShowEditUserModal] = useState(false); // Controls visibility of Edit User modal.
    const [userForEdit, setUserForEdit] = useState(null); // User object for editing.
    const [showEventsHistoryModal, setShowEventsHistoryModal] = useState(false); // Controls visibility of Events History modal.
    const [userForEventsHistory, setUserForEventsHistory] = useState(null); // User object for events history.
    const [showConnectionsHistoryModal, setShowConnectionsHistoryModal] = useState(false); // Controls visibility of Connections History modal (not used in current JSX).
    const [userForConnectionsHistory, setUserForConnectionsHistory] = useState(null); // User object for connections history (not used in current JSX).
    const [showAlertAddUser, setShowAlertAddUser] = useState(false); // Controls visibility of alert in Add User modal.
    const [alertVariantAddUser, setAlertVariantAddUser] = useState("success"); // Variant of the alert.
    const [alertMessageAddUser, setAlertMessageAddUser] = useState(""); // Message for the alert.

    // Callback function to update the list of displayed users,
    // typically used by the DashboardTable component for search/filter results.
    const handleFilteredUsersChange = useCallback((filteredList) => {
        setDisplayUsers(filteredList);
    }, []); // Memoized with useCallback to prevent unnecessary re-renders.

    // Function to handle Excel import data.
    // It updates the main 'users' state and calls the parent's 'onExcelImport' prop.
    const handleExcelImportOnContent = (data) => {
        setUsers((prevUsers) => [...prevUsers, ...data]);
        onExcelImport(data);
    };

    // Handler for clicking on a table row, sets the user for the details modal.
    const handleRowClick = (user) => {
        setUserForDetails(user);
    };

    // Handler to close the User Details modal.
    const handleCloseUserDetailsModal = () => {
        setUserForDetails(null);
    };

    // Handlers for managing the Add User modal.
    const handleShowAddUserModal = () => setShowAddUserModal(true);
    const handleCloseAddUserModal = () => {
        setShowAddUserModal(false);
        // Reset the new user form fields.
        setNewUser({
            fullName: "",
            email: "",
            password: "",
            linkedin: "",
            role: "",
            yearsOfExperience: "",
        });
        setShowAlertAddUser(false); // Hide alert when closing.
    };

    // Handler for updating new user form input changes.
    const handleNewUserChange = (e) => {
        const { name, value } = e.target;
        setNewUser((prevUser) => ({
            ...prevUser,
            [name]: value,
        }));
    };

    // Handler for adding a new user.
    const handleAddUser = async () => {
        // Client-side validation for required fields.
        if (!newUser.email || !newUser.password) {
            setAlertVariantAddUser("danger");
            setAlertMessageAddUser("Email and password are required fields.");
            setShowAlertAddUser(true);
            return;
        }

        try {
            // Simulating an API response for adding a user.
            // In a real application, this would be an actual API call.
            const addedUserResponse = {
                user_id: Date.now(), // Generate a unique ID for the new user.
                email: newUser.email,
                is_manager: newUser.role === 'Manager',
                english_name: newUser.fullName || newUser.email.split('@')[0], // Default name if not provided.
                linkedin: newUser.linkedin,
                role: newUser.role,
                seniority: newUser.yearsOfExperience,
            };

            // Format the "added" user data to match the component's state structure.
            const formattedAddedUser = {
                id: addedUserResponse.user_id,
                fullName: addedUserResponse.english_name,
                linkedin: addedUserResponse.linkedin || '',
                role: addedUserResponse.role || (addedUserResponse.is_manager ? 'Manager' : 'User'),
                yearsOfExperience: parseInt(addedUserResponse.seniority) || Math.floor(Math.random() * 15) + 1, // Random years if not provided.
            };

            // Update the 'users' state by adding the new user.
            setUsers((prevUsers) => [...prevUsers, formattedAddedUser]);
            // Show success alert and close the modal.
            setAlertVariantAddUser("success");
            setAlertMessageAddUser("User added successfully!");
            setShowAlertAddUser(true);
            handleCloseAddUserModal();
        } catch (error) {
            // Show error alert if adding fails.
            setAlertVariantAddUser("danger");
            setAlertMessageAddUser(error.message || "Failed to add user.");
            setShowAlertAddUser(true);
        }
    };

    // Handler for triggering the delete confirmation modal.
    const handleDeleteClick = (user) => {
        setUserToDelete(user);
        setShowDeleteConfirmModal(true);
        handleCloseUserDetailsModal(); // Close details modal if open.
    };

    // Handler for confirming and executing user deletion.
    const handleConfirmDelete = async () => {
        if (!userToDelete) return; // Exit if no user is selected for deletion.
        try {
            // Call the API to delete the user.
            await deleteUser(userToDelete.id);
            // Update the 'users' state by filtering out the deleted user.
            setUsers((prevUsers) =>
                prevUsers.filter((user) => user.id !== userToDelete.id)
            );
            // Show success alert and close the delete modal.
            setAlertVariantAddUser("success");
            setAlertMessageAddUser("User deleted successfully!");
            setShowAlertAddUser(true);
            setShowDeleteConfirmModal(false);
            setUserToDelete(null);
        } catch (error) {
            // Show error alert if deletion fails.
            setAlertVariantAddUser("danger");
            setAlertMessageAddUser(error.message || "Failed to delete user.");
            setShowAlertAddUser(true);
        }
    };

    // Handler for canceling user deletion.
    const handleCancelDelete = () => {
        setShowDeleteConfirmModal(false);
        setUserToDelete(null);
    };

    // Handlers for managing the Send Message modal.
    const handleShowSendMessageModal = (user) => {
        setUserForMessage(user);
        setShowSendMessageModal(true);
        handleCloseUserDetailsModal();
    };

    const handleCloseSendMessageModal = () => {
        setShowSendMessageModal(false);
        setUserForMessage(null);
    };

    // Placeholder function for sending a message.
    const onSendMessage = (userId, message) => {
        console.log(`Sending message to user ID ${userId}: "${message}"`);
    };

    // Handlers for managing the Edit User modal.
    const handleShowEditUserModal = (user) => {
        setUserForEdit(user);
        setShowEditUserModal(true);
        handleCloseUserDetailsModal();
    };

    const handleCloseEditUserModal = () => {
        setShowEditUserModal(false);
        setUserForEdit(null);
    };

    // Handler for updating user information after editing.
    const handleUserUpdate = async (updatedUser) => {
        try {
            // Call the API to update the user.
            const response = await updateUser(updatedUser.id, updatedUser);

            // Format the response data from the API to match the component's state structure.
            const formattedUpdatedUser = {
                id: response.user_id || response.id,
                fullName: response.english_name || response.fullName || response.email.split('@')[0],
                linkedin: response.linkedin || '',
                role: response.role || (response.is_manager ? 'Manager' : 'User'),
                yearsOfExperience: parseInt(response.seniority) || parseInt(response.yearsOfExperience) || Math.floor(Math.random() * 15) + 1,
            };

            // Update the 'users' state with the modified user.
            setUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user.id === formattedUpdatedUser.id ? formattedUpdatedUser : user
                )
            );
            // If the details modal is open for the updated user, refresh its data.
            if (userForDetails && userForDetails.id === formattedUpdatedUser.id) {
                setUserForDetails(formattedUpdatedUser);
            }
            // Show success alert and close the edit modal.
            setAlertVariantAddUser("success");
            setAlertMessageAddUser("User updated successfully!");
            setShowAlertAddUser(true);
            handleCloseEditUserModal();
        } catch (error) {
            // Show error alert if update fails.
            setAlertVariantAddUser("danger");
            setAlertMessageAddUser(error.message || "Failed to update user.");
            setShowAlertAddUser(true);
        }
    };

    // Handlers for managing the Connections History modal (not used in current JSX).
    const handleShowConnectionsHistoryModal = (user) => {
        setUserForConnectionsHistory(user);
        setShowConnectionsHistoryModal(true);
        handleCloseUserDetailsModal();
    };

    const handleCloseConnectionsHistoryModal = () => {
        setShowConnectionsHistoryModal(false);
        setUserForConnectionsHistory(null);
    };

    // Handlers for managing the Events History modal.
    const handleShowEventsHistoryModal = (user) => {
        setUserForEventsHistory(user);
        setShowEventsHistoryModal(true);
        handleCloseUserDetailsModal();
    };

    const handleCloseEventsHistoryModal = () => {
        setShowEventsHistoryModal(false);
        setUserForEventsHistory(null);
    };

    // Conditional rendering for loading state.
    if (loading) {
        return (
            <Container fluid className="p-4 bg-light flex-grow-1 d-flex justify-content-center align-items-center">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading users...</span>
                </Spinner>
            </Container>
        );
    }

    // Conditional rendering for fetch error state.
    if (fetchError) {
        return (
            <Container fluid className="p-4 bg-light flex-grow-1 d-flex justify-content-center align-items-center">
                <Alert variant="danger">
                    Error: {fetchError} Please try again later.
                </Alert>
            </Container>
        );
    }

    // Main render block of the component.
    return (
        <Container
            fluid
            className="p-4 bg-light flex-grow-1 dashboard-main-content"
            style={{ overflowY: 'auto' }} // Allows vertical scrolling if content overflows.
        >
            {/* Renders the DashboardTable component, passing necessary props for user data, filtering, and modal triggers. */}
            <DashboardTable
                users={users}
                displayUsers={displayUsers}
                onFilteredUsersChange={handleFilteredUsersChange}
                onShowAddUserModal={handleShowAddUserModal}
                onRowClick={handleRowClick}
            />

            {/* Renders the UserDetailsModal, controlled by 'userForDetails' state. */}
            <UserDetailsModal
                show={!!userForDetails} // Modal is shown if userForDetails is not null.
                onHide={handleCloseUserDetailsModal}
                user={userForDetails}
                onEditClick={handleShowEditUserModal}
                onMessageClick={handleShowSendMessageModal}
                onDeleteClick={handleDeleteClick}
                onViewEventsClick={handleShowEventsHistoryModal}
            />

            {/* Modal for adding a new user. */}
            <Modal show={showAddUserModal} onHide={handleCloseAddUserModal} centered>
                <Modal.Header closeButton className="bg-light">
                    <Modal.Title><PersonCircle size={20} /> Add New User</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/* Alert message for Add User modal. */}
                    {showAlertAddUser && (
                        <Alert variant={alertVariantAddUser} onClose={() => setShowAlertAddUser(false)} dismissible>
                            {alertMessageAddUser}
                        </Alert>
                    )}
                    {/* Form for new user details. */}
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter email"
                                name="email"
                                value={newUser.email}
                                onChange={handleNewUserChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Enter password"
                                name="password"
                                value={newUser.password}
                                onChange={handleNewUserChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Full Name (Optional)</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter full name"
                                name="fullName"
                                value={newUser.fullName}
                                onChange={handleNewUserChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>LinkedIn Profile (Optional)</Form.Label>
                            <Form.Control
                                type="url"
                                placeholder="Enter LinkedIn profile link"
                                name="linkedin"
                                value={newUser.linkedin}
                                onChange={handleNewUserChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Role (Optional)</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter role"
                                name="role"
                                value={newUser.role}
                                onChange={handleNewUserChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Years of Experience (Optional)</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Enter years of experience"
                                name="yearsOfExperience"
                                value={newUser.yearsOfExperience}
                                onChange={handleNewUserChange}
                                min="0"
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer className="bg-light">
                    <Button variant="secondary" onClick={handleCloseAddUserModal}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleAddUser}>
                        Add User
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal for confirming user deletion. */}
            <Modal show={showDeleteConfirmModal} onHide={handleCancelDelete} centered>
                <Modal.Header closeButton className="bg-danger text-white">
                    <Modal.Title><Trash size={20} /> Confirm Deletion</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {userToDelete && (
                        <p>
                            Are you sure you want to delete user <strong>{userToDelete.fullName || userToDelete.email}</strong>? This action cannot be undone.
                        </p>
                    )}
                </Modal.Body>
                <Modal.Footer className="bg-light">
                    <Button variant="secondary" onClick={handleCancelDelete}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleConfirmDelete}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Renders the SendMessageModal. */}
            <SendMessageModal
                show={showSendMessageModal}
                onHide={handleCloseSendMessageModal}
                user={userForMessage}
                onSendMessage={onSendMessage}
            />

            {/* Renders the EditUserModal. */}
            <EditUserModal
                show={showEditUserModal}
                onHide={handleCloseEditUserModal}
                user={userForEdit}
                onUserUpdate={handleUserUpdate}
            />

            {/* Renders the UserEventsHistoryModal. */}
            <UserEventsHistoryModal
                show={showEventsHistoryModal}
                onHide={handleCloseEventsHistoryModal}
                user={userForEventsHistory}
            />
        </Container>
    );
}

export default DashboardMainContent;