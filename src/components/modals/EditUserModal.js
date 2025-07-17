import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import { PencilSquare } from "react-bootstrap-icons";

function EditUserModal({ show, onHide, user, onUserUpdate }) {
    // editableUser holds the current state of the user data being edited in the form.
    const [editableUser, setEditableUser] = useState(user || {
        fullName: "",
        email: "",
        phone: "",
        linkedin: "",
        role: "",
    });
    // showAlert controls the visibility of the alert message in the modal.
    const [showAlert, setShowAlert] = useState(false);
    // alertVariant determines the styling (e.g., success, danger) of the alert message.
    const [alertVariant, setAlertVariant] = useState("success");
    // alertMessage stores the text content displayed within the alert.
    const [alertMessage, setAlertMessage] = useState("");

    // This effect synchronizes the modal's internal state (editableUser) with the 'user' prop.
    // It ensures that when a new user is selected for editing or the modal is reopened,
    // the form fields are pre-populated with the correct user data.
    // It also clears any active alert messages to provide a fresh state for the new editing session.
    useEffect(() => {
        if (user) {
            setEditableUser(user);
            setShowAlert(false);
        }
    }, [user, show]);

    // If no user object is provided, the modal should not render.
    // This prevents rendering the modal with incomplete or missing data.
    if (!user) {
        return null;
    }

    // handleEditChange updates the `editableUser` state as the user types into the form fields.
    // It uses the input's 'name' attribute to dynamically update the corresponding property in the state.
    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditableUser((prevUser) => ({
            ...prevUser,
            [name]: value,
        }));
    };

    // handleSave is triggered when the "Save Changes" button is clicked.
    // It first performs client-side validation to ensure essential fields are not empty.
    // If validation passes, it calls the `onUserUpdate` prop, passing the modified user data
    // back to the parent component for further processing (e.g., API call).
    // Finally, it displays a success or error alert and closes the modal after a short delay.
    const handleSave = () => {
        if (!editableUser.fullName || !editableUser.email) {
            setAlertVariant("danger");
            setAlertMessage("Full name and email are required fields.");
            setShowAlert(true);
            return;
        }

        onUserUpdate(editableUser);

        setAlertVariant("success");
        setAlertMessage("User details updated successfully!");
        setShowAlert(true);

        setTimeout(() => {
            setShowAlert(false);
            onHide();
        }, 1500);
    };

    return (
        <Modal show={show} onHide={onHide} centered className="modal-lg">
            <Modal.Header closeButton className="bg-light">
                <Modal.Title>
                    <PencilSquare size={20} /> Edit User: {user.fullName}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="p-4">
                {/* The Alert component is conditionally rendered based on the `showAlert` state. */}
                <Alert variant={alertVariant} onClose={() => setShowAlert(false)} dismissible show={showAlert}>
                    {alertMessage}
                </Alert>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Full Name</Form.Label>
                        <Form.Control
                            type="text"
                            name="fullName"
                            value={editableUser.fullName}
                            onChange={handleEditChange}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            name="email"
                            value={editableUser.email}
                            onChange={handleEditChange}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Phone</Form.Label>
                        <Form.Control
                            type="tel"
                            name="phone"
                            value={editableUser.phone}
                            onChange={handleEditChange}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>LinkedIn Profile</Form.Label>
                        <Form.Control
                            type="url"
                            name="linkedin"
                            value={editableUser.linkedin}
                            onChange={handleEditChange}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Role</Form.Label>
                        <Form.Control
                            type="text"
                            name="role"
                            value={editableUser.role}
                            onChange={handleEditChange}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer className="bg-light">
                <Button variant="primary" onClick={handleSave}>
                    <PencilSquare size={15} /> Save Changes
                </Button>
                <Button variant="secondary" onClick={onHide}>
                    Cancel
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default EditUserModal;