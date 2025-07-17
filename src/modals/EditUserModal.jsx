import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import { PencilSquare } from "react-bootstrap-icons";

// EditUserModal component provides a modal for editing user details.
// It receives 'show' (boolean for visibility), 'onHide' (callback to close modal),
// 'user' (the user object to be edited), and 'onUserUpdate' (callback to save changes) as props.
function EditUserModal({ show, onHide, user, onUserUpdate }) {
    // editableUser state holds the user data currently being edited within the form.
    // It is initialized with the `user` prop data or an empty object if `user` is null.
    const [editableUser, setEditableUser] = useState(user || {
        fullName: "",
        email: "",
        phone: "",
        linkedin: "",
        role: "",
    });
    // showAlert controls the visibility of the alert message within the modal.
    const [showAlert, setShowAlert] = useState(false);
    // alertVariant determines the styling (e.g., 'success', 'danger') of the alert.
    const [alertVariant, setAlertVariant] = useState("success");
    // alertMessage stores the text content displayed within the alert.
    const [alertMessage, setAlertMessage] = useState("");

    // useEffect hook to synchronize `editableUser` state with the `user` prop.
    // This ensures that when a different user is selected or the modal is reopened,
    // the form fields reflect the correct user's details and any previous alerts are cleared.
    useEffect(() => {
        if (user) {
            setEditableUser(user); // Update form fields with the new user's data.
            setShowAlert(false);   // Hide any active alerts from previous interactions.
        }
    }, [user, show]); // Dependencies: `user` prop (to detect user change) and `show` prop (to reset on modal open).

    // If no user object is passed, the modal should not be rendered.
    // This serves as a safety check to prevent rendering errors.
    if (!user) {
        return null;
    }

    // handleEditChange updates the `editableUser` state as the user types into form fields.
    // It dynamically updates the corresponding property based on the input's 'name' attribute.
    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditableUser((prevUser) => ({
            ...prevUser,
            [name]: value,
        }));
    };

    // handleSave is triggered when the "Save Changes" button is clicked.
    // It performs basic client-side validation and then calls the `onUserUpdate` callback prop.
    // It displays an alert message based on the outcome and optionally closes the modal.
    const handleSave = () => {
        // Basic validation: checks if full name and email fields are not empty.
        if (!editableUser.fullName || !editableUser.email) {
            setAlertVariant("danger");
            setAlertMessage("Full name and email are required fields.");
            setShowAlert(true); // Show an error alert.
            return; // Stop the save process.
        }

        // Call the parent component's `onUserUpdate` function, passing the modified user data.
        onUserUpdate(editableUser);
        setAlertVariant("success");
        setAlertMessage("User details updated successfully!");
        setShowAlert(true); // Show a success alert.

        // Optionally close the modal after a short delay to allow the user to see the success message.
        setTimeout(() => {
            setShowAlert(false); // Hide the alert.
            onHide(); // Close the modal.
        }, 1500);
    };

    return (
        // Bootstrap Modal component.
        // `show` and `onHide` props control its visibility and closing behavior.
        // `centered` positions it in the middle of the screen, and `modal-lg` sets its size.
        <Modal show={show} onHide={onHide} centered className="modal-lg">
            {/* Modal header with a close button and title showing the user being edited. */}
            <Modal.Header closeButton className="bg-light">
                <Modal.Title>
                    <PencilSquare size={20} /> Edit User: {user.fullName}
                </Modal.Title>
            </Modal.Header>
            {/* Modal body contains the alert area and the form for user details. */}
            <Modal.Body className="p-4">
                {/* Conditionally renders an alert message if `showAlert` is true. */}
                {showAlert && (
                    <Alert variant={alertVariant} onClose={() => setShowAlert(false)} dismissible>
                        {alertMessage}
                    </Alert>
                )}
                {/* Form for editing user's personal and professional details. */}
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
            {/* Modal footer with "Save Changes" and "Cancel" buttons. */}
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