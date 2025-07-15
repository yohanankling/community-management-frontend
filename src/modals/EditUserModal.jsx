// src/components/EditUserModal.js
import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import { PencilSquare } from "react-bootstrap-icons";

function EditUserModal({ show, onHide, user, onUserUpdate }) {
    // Initialize editableUser state with the user prop, or an empty object if user is null
    const [editableUser, setEditableUser] = useState(user || {
        fullName: "",
        email: "",
        phone: "",
        linkedin: "",
        role: "",
    });
    const [showAlert, setShowAlert] = useState(false);
    const [alertVariant, setAlertVariant] = useState("success");
    const [alertMessage, setAlertMessage] = useState("");

    // Update editableUser whenever the 'user' prop changes (e.g., a different user is selected)
    useEffect(() => {
        if (user) {
            setEditableUser(user);
            setShowAlert(false); // Clear any alerts on user change
        }
    }, [user, show]); // Also depend on 'show' to reset when modal is reopened

    // Don't render the modal if no user is provided
    if (!user) {
        return null;
    }

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditableUser((prevUser) => ({
            ...prevUser,
            [name]: value,
        }));
    };

    const handleSave = () => {
        if (!editableUser.fullName || !editableUser.email) {
            setAlertVariant("danger");
            setAlertMessage("Full name and email are required fields.");
            setShowAlert(true);
            return;
        }

        onUserUpdate(editableUser); // Call the parent's update function
        setAlertVariant("success");
        setAlertMessage("User details updated successfully!");
        setShowAlert(true);
        setTimeout(() => {
            setShowAlert(false);
            onHide(); // Close modal after successful update
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
                {showAlert && (
                    <Alert variant={alertVariant} onClose={() => setShowAlert(false)} dismissible>
                        {alertMessage}
                    </Alert>
                )}
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