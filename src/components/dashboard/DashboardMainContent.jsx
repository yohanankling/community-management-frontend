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

function DashboardMainContent({ onExcelImport }) {
    const [users, setUsers] = useState([]);
    const [displayUsers, setDisplayUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                setFetchError(null);
                const fetchedUsers = await getAllUsers();
                const formattedUsers = fetchedUsers.map(user => ({
                    id: user.user_id,
                    fullName: user.english_name,
                    linkedin: user.linkedin || '',
                    role: user.role,
                    yearsOfExperience: Math.floor(Math.random() * 15) + 1,
                }));
                setUsers(formattedUsers);
            } catch (error) {
                setFetchError(error.message || "Failed to load users from server.");
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);


    useEffect(() => {
        setDisplayUsers(users);
    }, [users]);

    const [userForDetails, setUserForDetails] = useState(null);
    const [showAddUserModal, setShowAddUserModal] = useState(false);
    const [newUser, setNewUser] = useState({
        fullName: "",
        email: "",
        password: "",
        linkedin: "",
        role: "",
        yearsOfExperience: "",
    });
    const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [showSendMessageModal, setShowSendMessageModal] = useState(false);
    const [userForMessage, setUserForMessage] = useState(null);
    const [showEditUserModal, setShowEditUserModal] = useState(false);
    const [userForEdit, setUserForEdit] = useState(null);
    const [showEventsHistoryModal, setShowEventsHistoryModal] = useState(false);
    const [userForEventsHistory, setUserForEventsHistory] = useState(null);
    const [showConnectionsHistoryModal, setShowConnectionsHistoryModal] = useState(false);
    const [userForConnectionsHistory, setUserForConnectionsHistory] = useState(null);
    const [showAlertAddUser, setShowAlertAddUser] = useState(false);
    const [alertVariantAddUser, setAlertVariantAddUser] = useState("success");
    const [alertMessageAddUser, setAlertMessageAddUser] = useState("");

    const handleFilteredUsersChange = useCallback((filteredList) => {
        setDisplayUsers(filteredList);
    }, []);

    const handleExcelImportOnContent = (data) => {
        setUsers((prevUsers) => [...prevUsers, ...data]);
        onExcelImport(data);
    };

    const handleRowClick = (user) => {
        setUserForDetails(user);
    };

    const handleCloseUserDetailsModal = () => {
        setUserForDetails(null);
    };

    const handleShowAddUserModal = () => setShowAddUserModal(true);
    const handleCloseAddUserModal = () => {
        setShowAddUserModal(false);
        setNewUser({
            fullName: "",
            email: "",
            password: "",
            linkedin: "",
            role: "",
            yearsOfExperience: "",
        });
        setShowAlertAddUser(false);
    };

    const handleNewUserChange = (e) => {
        const { name, value } = e.target;
        setNewUser((prevUser) => ({
            ...prevUser,
            [name]: value,
        }));
    };

    const handleAddUser = async () => {
        if (!newUser.email || !newUser.password) {
            setAlertVariantAddUser("danger");
            setAlertMessageAddUser("Email and password are required fields.");
            setShowAlertAddUser(true);
            return;
        }

        try {
            const addedUserResponse = {
                user_id: Date.now(),
                email: newUser.email,
                is_manager: newUser.role === 'Manager',
                english_name: newUser.fullName || newUser.email.split('@')[0],
                linkedin: newUser.linkedin,
                role: newUser.role,
                seniority: newUser.yearsOfExperience,
            };

            const formattedAddedUser = {
                id: addedUserResponse.user_id,
                fullName: addedUserResponse.english_name,
                linkedin: addedUserResponse.linkedin || '',
                role: addedUserResponse.role || (addedUserResponse.is_manager ? 'Manager' : 'User'),
                yearsOfExperience: parseInt(addedUserResponse.seniority) || Math.floor(Math.random() * 15) + 1, // גם כאן נגריל מספר
            };

            setUsers((prevUsers) => [...prevUsers, formattedAddedUser]);
            setAlertVariantAddUser("success");
            setAlertMessageAddUser("User added successfully!");
            setShowAlertAddUser(true);
            handleCloseAddUserModal();
        } catch (error) {
            setAlertVariantAddUser("danger");
            setAlertMessageAddUser(error.message || "Failed to add user.");
            setShowAlertAddUser(true);
        }
    };

    const handleDeleteClick = (user) => {
        setUserToDelete(user);
        setShowDeleteConfirmModal(true);
        handleCloseUserDetailsModal();
    };

    const handleConfirmDelete = async () => {
        if (!userToDelete) return;
        try {
            await deleteUser(userToDelete.id);
            setUsers((prevUsers) =>
                prevUsers.filter((user) => user.id !== userToDelete.id)
            );
            setAlertVariantAddUser("success");
            setAlertMessageAddUser("User deleted successfully!");
            setShowAlertAddUser(true);
            setShowDeleteConfirmModal(false);
            setUserToDelete(null);
        } catch (error) {
            setAlertVariantAddUser("danger");
            setAlertMessageAddUser(error.message || "Failed to delete user.");
            setShowAlertAddUser(true);
        }
    };

    const handleCancelDelete = () => {
        setShowDeleteConfirmModal(false);
        setUserToDelete(null);
    };

    const handleShowSendMessageModal = (user) => {
        setUserForMessage(user);
        setShowSendMessageModal(true);
        handleCloseUserDetailsModal();
    };

    const handleCloseSendMessageModal = () => {
        setShowSendMessageModal(false);
        setUserForMessage(null);
    };

    const onSendMessage = (userId, message) => {
        console.log(`Sending message to user ID ${userId}: "${message}"`);
    };

    const handleShowEditUserModal = (user) => {
        setUserForEdit(user);
        setShowEditUserModal(true);
        handleCloseUserDetailsModal();
    };

    const handleCloseEditUserModal = () => {
        setShowEditUserModal(false);
        setUserForEdit(null);
    };

    const handleUserUpdate = async (updatedUser) => {
        try {
            const response = await updateUser(updatedUser.id, updatedUser);

            const formattedUpdatedUser = {
                id: response.user_id || response.id,
                fullName: response.english_name || response.fullName || response.email.split('@')[0],
                linkedin: response.linkedin || '',
                role: response.role || (response.is_manager ? 'Manager' : 'User'),
                yearsOfExperience: parseInt(response.seniority) || parseInt(response.yearsOfExperience) || Math.floor(Math.random() * 15) + 1, // ודא שגם כאן הערך נשמר
            };

            setUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user.id === formattedUpdatedUser.id ? formattedUpdatedUser : user
                )
            );
            if (userForDetails && userForDetails.id === formattedUpdatedUser.id) {
                setUserForDetails(formattedUpdatedUser);
            }
            setAlertVariantAddUser("success");
            setAlertMessageAddUser("User updated successfully!");
            setShowAlertAddUser(true);
            handleCloseEditUserModal();
        } catch (error) {
            setAlertVariantAddUser("danger");
            setAlertMessageAddUser(error.message || "Failed to update user.");
            setShowAlertAddUser(true);
        }
    };

    const handleShowConnectionsHistoryModal = (user) => {
        setUserForConnectionsHistory(user);
        setShowConnectionsHistoryModal(true);
        handleCloseUserDetailsModal();
    };

    const handleCloseConnectionsHistoryModal = () => {
        setShowConnectionsHistoryModal(false);
        setUserForConnectionsHistory(null);
    };

    const handleShowEventsHistoryModal = (user) => {
        setUserForEventsHistory(user);
        setShowEventsHistoryModal(true);
        handleCloseUserDetailsModal();
    };

    const handleCloseEventsHistoryModal = () => {
        setShowEventsHistoryModal(false);
        setUserForEventsHistory(null);
    };

    if (loading) {
        return (
            <Container fluid className="p-4 bg-light flex-grow-1 d-flex justify-content-center align-items-center">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading users...</span>
                </Spinner>
            </Container>
        );
    }

    if (fetchError) {
        return (
            <Container fluid className="p-4 bg-light flex-grow-1 d-flex justify-content-center align-items-center">
                <Alert variant="danger">
                    Error: {fetchError} Please try again later.
                </Alert>
            </Container>
        );
    }

    return (
        <Container
            fluid
            className="p-4 bg-light flex-grow-1 dashboard-main-content"
            style={{ overflowY: 'auto' }}
        >
            <DashboardTable
                users={users}
                displayUsers={displayUsers}
                onFilteredUsersChange={handleFilteredUsersChange}
                onShowAddUserModal={handleShowAddUserModal}
                onRowClick={handleRowClick}
            />

            <UserDetailsModal
                show={!!userForDetails}
                onHide={handleCloseUserDetailsModal}
                user={userForDetails}
                onEditClick={handleShowEditUserModal}
                onMessageClick={handleShowSendMessageModal}
                onDeleteClick={handleDeleteClick}
                onViewEventsClick={handleShowEventsHistoryModal}
            />

            <Modal show={showAddUserModal} onHide={handleCloseAddUserModal} centered>
                <Modal.Header closeButton className="bg-light">
                    <Modal.Title><PersonCircle size={20} /> Add New User</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {showAlertAddUser && (
                        <Alert variant={alertVariantAddUser} onClose={() => setShowAlertAddUser(false)} dismissible>
                            {alertMessageAddUser}
                        </Alert>
                    )}
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

            <SendMessageModal
                show={showSendMessageModal}
                onHide={handleCloseSendMessageModal}
                user={userForMessage}
                onSendMessage={onSendMessage}
            />

            <EditUserModal
                show={showEditUserModal}
                onHide={handleCloseEditUserModal}
                user={userForEdit}
                onUserUpdate={handleUserUpdate}
            />

            <UserEventsHistoryModal
                show={showEventsHistoryModal}
                onHide={handleCloseEventsHistoryModal}
                user={userForEventsHistory}
            />
        </Container>
    );
}

export default DashboardMainContent;